import { NextResponse } from "next/server";
import { publicUser, setSessionCookies, supabaseAuthFetch } from "@/lib/supabase";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    } | null;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters." },
        { status: 400 },
      );
    }

    const authResponse = await supabaseAuthFetch("/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        data: { full_name: name },
      }),
    });
    const data = await authResponse.json().catch(() => ({}));

    if (!authResponse.ok) {
      const message = typeof data?.msg === "string" ? data.msg : "";
      const lowerMessage = message.toLowerCase();
      const duplicate =
        lowerMessage.includes("already") || lowerMessage.includes("registered");

      return NextResponse.json(
        {
          error: duplicate
            ? "An account with this email already exists."
            : message || "Unable to create your account. Please try again.",
        },
        { status: duplicate ? 409 : authResponse.status },
      );
    }

    const user = data.user || data;
    const requiresEmailConfirmation = !data.access_token || !data.refresh_token;
    const response = NextResponse.json(
      {
        user: user?.id ? publicUser(user) : { id: "", name, email },
        requiresEmailConfirmation,
      },
      { status: 201 },
    );

    if (!requiresEmailConfirmation) setSessionCookies(response, data);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    console.error("Signup failed", error);
    return NextResponse.json(
      { error: "Sign up is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
