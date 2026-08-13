import { NextResponse } from "next/server";
import { getOwnerApiSession } from "@/lib/admin";
import { parseProductPayload } from "@/lib/adminProductPayload";
import { supabaseDataFetch } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const response = await supabaseDataFetch("/products?select=*&order=updated_at.desc,created_at.desc", {}, session.accessToken);
  const data = await response.json().catch(() => []);
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const parsed = parseProductPayload(await request.json().catch(() => null));
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error || "Invalid product data." }, { status: 400 });
  }

  const response = await supabaseDataFetch("/products", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(parsed.data),
  }, session.accessToken);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const text = JSON.stringify(data).toLowerCase();
    return NextResponse.json({ error: text.includes("slug") ? "That web address is already used by another product." : "Unable to create product." }, { status: response.status });
  }
  return NextResponse.json({ product: Array.isArray(data) ? data[0] : data }, { status: 201 });
}
