import { NextResponse } from "next/server";
import {
  createSessionToken,
  decryptStoredUser,
  normalizeEmail,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  userDocumentId,
  verifyPassword,
} from "@/lib/auth";
import {
  CustomerAuthDocument,
  getAuthSanityClient,
} from "@/lib/sanity/authClient";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;

    const email =
      typeof body?.email === "string" ? normalizeEmail(body.email) : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const client = getAuthSanityClient();
    const id = userDocumentId(email);
    const document = await client.getDocument<CustomerAuthDocument>(id);
    const storedUser = document ? decryptStoredUser(document.payload) : null;

    if (!storedUser || normalizeEmail(storedUser.email) !== email) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await verifyPassword(
      password,
      storedUser.passwordSalt,
      storedUser.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user = { id, name: storedUser.name, email: storedUser.email };
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
