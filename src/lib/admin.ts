import { redirect } from "next/navigation";
import { resolveSession } from "@/lib/supabase";

// Supabase user ID for the current Khushi's Store owner account.
// This is an identifier, not a password or secret. Database RLS uses the same ID.
export const OWNER_USER_ID = "af03f4ac-5343-4778-b6fa-fe7a8f41c302";

export function isOwnerUser(userId?: string | null) {
  return userId === OWNER_USER_ID;
}

export async function requireOwnerPage() {
  const session = await resolveSession();
  if (!session) redirect("/login");
  if (!isOwnerUser(session.user.id)) redirect("/");
  return session;
}

export async function getOwnerApiSession() {
  const session = await resolveSession();
  if (!session || !isOwnerUser(session.user.id)) return null;
  return session;
}
