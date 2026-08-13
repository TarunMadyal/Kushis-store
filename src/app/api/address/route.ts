import { NextResponse } from "next/server";
import {
  resolveSession,
  setSessionCookies,
  supabaseDataFetch,
} from "@/lib/supabase";

export const runtime = "nodejs";

export type AddressPayload = {
  recipientName?: unknown;
  phone?: unknown;
  line1?: unknown;
  line2?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  country?: unknown;
};

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function applyRefresh(response: NextResponse, session: Awaited<ReturnType<typeof resolveSession>>) {
  if (session?.refreshedSession) setSessionCookies(response, session.refreshedSession);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  try {
    const session = await resolveSession();
    if (!session) return NextResponse.json({ address: null }, { status: 401 });

    const result = await supabaseDataFetch(
      `/addresses?user_id=eq.${encodeURIComponent(session.user.id)}&is_default=eq.true&select=id,recipient_name,phone,line1,line2,city,state,postal_code,country&limit=1`,
      { method: "GET" },
      session.accessToken,
    );
    const rows = await result.json().catch(() => []);

    if (!result.ok) {
      console.error("Address fetch failed", rows);
      return applyRefresh(
        NextResponse.json({ error: "Unable to load address." }, { status: 500 }),
        session,
      );
    }

    const row = Array.isArray(rows) ? rows[0] : null;
    return applyRefresh(
      NextResponse.json({
        address: row
          ? {
              id: row.id,
              recipientName: row.recipient_name || "",
              phone: row.phone || "",
              line1: row.line1 || "",
              line2: row.line2 || "",
              city: row.city || "",
              state: row.state || "",
              postalCode: row.postal_code || "",
              country: row.country || "India",
            }
          : null,
      }),
      session,
    );
  } catch (error) {
    console.error("Address fetch failed", error);
    return NextResponse.json({ error: "Unable to load address." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await resolveSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => null)) as AddressPayload | null;
    const address = {
      recipient_name: text(body?.recipientName, 80),
      phone: text(body?.phone, 30),
      line1: text(body?.line1, 160),
      line2: text(body?.line2, 160),
      city: text(body?.city, 80),
      state: text(body?.state, 80),
      postal_code: text(body?.postalCode, 20),
      country: text(body?.country, 80) || "India",
    };

    if (
      !address.recipient_name ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postal_code
    ) {
      return NextResponse.json(
        { error: "Please complete the required delivery address fields." },
        { status: 400 },
      );
    }

    const existingResponse = await supabaseDataFetch(
      `/addresses?user_id=eq.${encodeURIComponent(session.user.id)}&is_default=eq.true&select=id&limit=1`,
      { method: "GET" },
      session.accessToken,
    );
    const existingRows = await existingResponse.json().catch(() => []);
    const existing = Array.isArray(existingRows) ? existingRows[0] : null;

    const result = existing?.id
      ? await supabaseDataFetch(
          `/addresses?id=eq.${encodeURIComponent(existing.id)}`,
          {
            method: "PATCH",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({ ...address, updated_at: new Date().toISOString() }),
          },
          session.accessToken,
        )
      : await supabaseDataFetch(
          "/addresses",
          {
            method: "POST",
            headers: { Prefer: "return=representation" },
            body: JSON.stringify({
              user_id: session.user.id,
              ...address,
              is_default: true,
            }),
          },
          session.accessToken,
        );
    const data = await result.json().catch(() => null);

    if (!result.ok) {
      console.error("Address save failed", data);
      return applyRefresh(
        NextResponse.json({ error: "Unable to save address." }, { status: 500 }),
        session,
      );
    }

    return applyRefresh(NextResponse.json({ success: true }), session);
  } catch (error) {
    console.error("Address save failed", error);
    return NextResponse.json({ error: "Unable to save address." }, { status: 500 });
  }
}
