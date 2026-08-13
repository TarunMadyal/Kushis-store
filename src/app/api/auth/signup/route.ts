import { NextResponse } from "next/server";
import {
  createSessionToken,
  encryptStoredUser,
  hashPassword,
  normalizeEmail,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  userDocumentId,
} from "@/lib/auth";
import {
  CustomerAuthDocument,
  getAuthSanityClient,
} from "@/lib/sanity/authClient";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isConflictError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 409
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    } | null;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? normalizeEmail(body.email) : "";
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

    const client = getAuthSanityClient();
    const id = userDocumentId(email);
    const existing = await client.getDocument<CustomerAuthDocument>(id);

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const { passwordHash, passwordSalt } = await hashPassword(password);
    const payload = encryptStoredUser({
      name,
      email,
      passwordHash,
      passwordSalt,
    });

    try {
      await client.create<CustomerAuthDocument>({
        _id: id,
        _type: "customerAuth",
        payload,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (isConflictError(error)) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 },
        );
      }
      throw error;
    }

    const user = { id, name, email };
    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Signup failed", error);
    return NextResponse.json(
      { error: "Sign up is temporarily unavailable. Please try again." },
      { status: 500 },
    );
  }
}
