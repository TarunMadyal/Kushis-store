import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = "kushis_sb_access";
const REFRESH_COOKIE = "kushis_sb_refresh";
const ACCESS_MAX_AGE = 60 * 60;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
};

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: SupabaseAuthUser;
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, key };
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function supabaseAuthFetch(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
) {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  return fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function supabaseDataFetch(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
) {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${accessToken || key}`);

  return fetch(`${url}/rest/v1${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export function publicUser(user: SupabaseAuthUser): PublicUser {
  const rawName = user.user_metadata?.full_name;
  const name = typeof rawName === "string" && rawName.trim()
    ? rawName.trim()
    : user.email?.split("@")[0] || "Customer";

  return {
    id: user.id,
    name,
    email: user.email || "",
  };
}

export function setSessionCookies(response: NextResponse, session: AuthSession) {
  response.cookies.set(ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in || ACCESS_MAX_AGE,
  });
  response.cookies.set(REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
}

async function userFromAccessToken(accessToken: string) {
  const response = await supabaseAuthFetch("/user", { method: "GET" }, accessToken);
  if (!response.ok) return null;
  return (await response.json()) as SupabaseAuthUser;
}

async function refreshSession(refreshToken: string) {
  const response = await supabaseAuthFetch("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;
  return (await response.json()) as AuthSession;
}

export async function resolveSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken) {
    const user = await userFromAccessToken(accessToken);
    if (user) return { user, accessToken, refreshedSession: null as AuthSession | null };
  }

  if (!refreshToken) return null;

  const refreshedSession = await refreshSession(refreshToken);
  if (!refreshedSession?.access_token) return null;

  const user =
    refreshedSession.user || (await userFromAccessToken(refreshedSession.access_token));
  if (!user) return null;

  return {
    user,
    accessToken: refreshedSession.access_token,
    refreshedSession,
  };
}

export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value || null;
}
