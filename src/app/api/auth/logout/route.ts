import { NextResponse } from "next/server";
import {
  clearSessionCookies,
  getAccessTokenFromCookies,
  supabaseAuthFetch,
} from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST() {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (accessToken) {
      await supabaseAuthFetch("/logout", { method: "POST" }, accessToken).catch(
        () => null,
      );
    }
  } finally {
    const response = NextResponse.json({ success: true });
    clearSessionCookies(response);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
}
