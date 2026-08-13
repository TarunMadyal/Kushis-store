import { NextResponse } from "next/server";
import { publicUser, setSessionCookies, supabaseAuthFetch } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const authResponse = await supabaseAuthFetch("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await authResponse.json().catch(() => ({}));

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: authResponse.status === 400 ? 401 : authResponse.status },
      );
    }

    const response = NextResponse.json({ user: publicUser(data.user) });
    setSessionCookies(response, data);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
