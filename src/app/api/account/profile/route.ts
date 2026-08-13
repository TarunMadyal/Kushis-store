import { NextResponse } from "next/server";
import {
  publicUser,
  resolveSession,
  setSessionCookies,
  supabaseDataFetch,
} from "@/lib/supabase";

export const runtime = "nodejs";

function withRefreshedSession(response: NextResponse, refreshedSession: any) {
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const session = await resolveSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileResponse = await supabaseDataFetch(
    `/profiles?id=eq.${session.user.id}&select=id,full_name,phone`,
    { method: "GET" },
    session.accessToken,
  );
  const profileRows = profileResponse.ok ? await profileResponse.json() : [];

  const addressResponse = await supabaseDataFetch(
    `/addresses?user_id=eq.${session.user.id}&is_default=eq.true&select=id,label,recipient_name,phone,line1,line2,city,state,postal_code,country,is_default&limit=1`,
    { method: "GET" },
    session.accessToken,
  );
  const addressRows = addressResponse.ok ? await addressResponse.json() : [];

  return withRefreshedSession(
    NextResponse.json({
      user: publicUser(session.user),
      profile: profileRows?.[0] || null,
      address: addressRows?.[0] || null,
    }),
    session.refreshedSession,
  );
}

export async function PUT(request: Request) {
  const session = await resolveSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (fullName && (fullName.length < 2 || fullName.length > 80)) {
    return NextResponse.json({ error: "Please enter a valid full name." }, { status: 400 });
  }

  const profilePatch = await supabaseDataFetch(
    `/profiles?id=eq.${session.user.id}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        full_name: fullName || null,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      }),
    },
    session.accessToken,
  );

  if (!profilePatch.ok) {
    return NextResponse.json({ error: "Unable to save your profile." }, { status: 500 });
  }

  const line1 = typeof body.line1 === "string" ? body.line1.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const postalCode = typeof body.postalCode === "string" ? body.postalCode.trim() : "";

  if (line1 || city || state || postalCode) {
    if (!line1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: "Please complete address line, city, state and PIN code." },
        { status: 400 },
      );
    }

    const existingResponse = await supabaseDataFetch(
      `/addresses?user_id=eq.${session.user.id}&is_default=eq.true&select=id&limit=1`,
      { method: "GET" },
      session.accessToken,
    );
    const existingRows = existingResponse.ok ? await existingResponse.json() : [];
    const addressBody = {
      user_id: session.user.id,
      label: typeof body.label === "string" && body.label.trim() ? body.label.trim() : "Home",
      recipient_name: fullName || null,
      phone: phone || null,
      line1,
      line2: typeof body.line2 === "string" && body.line2.trim() ? body.line2.trim() : null,
      city,
      state,
      postal_code: postalCode,
      country: typeof body.country === "string" && body.country.trim() ? body.country.trim() : "India",
      is_default: true,
      updated_at: new Date().toISOString(),
    };

    const addressResponse = existingRows?.[0]?.id
      ? await supabaseDataFetch(
          `/addresses?id=eq.${existingRows[0].id}`,
          { method: "PATCH", body: JSON.stringify(addressBody) },
          session.accessToken,
        )
      : await supabaseDataFetch(
          "/addresses",
          { method: "POST", body: JSON.stringify(addressBody) },
          session.accessToken,
        );

    if (!addressResponse.ok) {
      return NextResponse.json({ error: "Profile saved, but address could not be saved." }, { status: 500 });
    }
  }

  return withRefreshedSession(
    NextResponse.json({ success: true }),
    session.refreshedSession,
  );
}
