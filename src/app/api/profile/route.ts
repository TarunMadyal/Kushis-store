import { NextResponse } from "next/server";
import {
  resolveSession,
  setSessionCookies,
  supabaseDataFetch,
} from "@/lib/supabase";

export const runtime = "nodejs";

type ProfileInput = {
  fullName?: unknown;
  phone?: unknown;
};

function applyRefresh(response: NextResponse, session: Awaited<ReturnType<typeof resolveSession>>) {
  if (session?.refreshedSession) setSessionCookies(response, session.refreshedSession);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  try {
    const session = await resolveSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await supabaseDataFetch(
      `/profiles?id=eq.${encodeURIComponent(session.user.id)}&select=id,full_name,phone&limit=1`,
      { method: "GET" },
      session.accessToken,
    );
    const rows = await result.json().catch(() => []);

    if (!result.ok) {
      console.error("Profile fetch failed", rows);
      return applyRefresh(
        NextResponse.json({ error: "Unable to load profile." }, { status: 500 }),
        session,
      );
    }

    const row = Array.isArray(rows) ? rows[0] : null;
    return applyRefresh(
      NextResponse.json({
        profile: {
          fullName: row?.full_name || "",
          phone: row?.phone || "",
        },
      }),
      session,
    );
  } catch (error) {
    console.error("Profile fetch failed", error);
    return NextResponse.json({ error: "Unable to load profile." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await resolveSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => null)) as ProfileInput | null;
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (fullName && (fullName.length < 2 || fullName.length > 80)) {
      return NextResponse.json({ error: "Please enter a valid full name." }, { status: 400 });
    }
    if (phone.length > 30) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const result = await supabaseDataFetch(
      "/profiles?on_conflict=id",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          id: session.user.id,
          full_name: fullName || null,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        }),
      },
      session.accessToken,
    );
    const data = await result.json().catch(() => null);

    if (!result.ok) {
      console.error("Profile update failed", data);
      return applyRefresh(
        NextResponse.json({ error: "Unable to save profile." }, { status: 500 }),
        session,
      );
    }

    return applyRefresh(NextResponse.json({ success: true }), session);
  } catch (error) {
    console.error("Profile update failed", error);
    return NextResponse.json({ error: "Unable to save profile." }, { status: 500 });
  }
}
