import { NextResponse } from "next/server";
import { publicUser, resolveSession, setSessionCookies } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await resolveSession();
    const response = NextResponse.json({
      user: session ? publicUser(session.user) : null,
    });

    if (session?.refreshedSession) {
      setSessionCookies(response, session.refreshedSession);
    }
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ user: null });
  }
}
