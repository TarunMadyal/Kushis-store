import { NextResponse } from "next/server";
import { getOwnerApiSession } from "@/lib/admin";
import { parseProductPayload } from "@/lib/adminProductPayload";
import { supabaseDataFetch } from "@/lib/supabase";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const { id } = await params;
  const response = await supabaseDataFetch(`/products?select=*&id=eq.${encodeURIComponent(id)}&limit=1`, {}, session.accessToken);
  const data = await response.json().catch(() => []);
  if (!response.ok) return NextResponse.json({ error: "Unable to load product." }, { status: response.status });
  if (!Array.isArray(data) || !data[0]) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product: data[0] });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const { id } = await params;
  const parsed = parseProductPayload(await request.json().catch(() => null), true);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error || "Invalid product data." }, { status: 400 });
  }
  if (!Object.keys(parsed.data).length) return NextResponse.json({ error: "No changes supplied." }, { status: 400 });

  const response = await supabaseDataFetch(`/products?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...parsed.data, updated_at: new Date().toISOString() }),
  }, session.accessToken);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return NextResponse.json({ error: "Unable to update product." }, { status: response.status });
  const product = Array.isArray(data) ? data[0] : data;
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const { id } = await params;
  const response = await supabaseDataFetch(`/products?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" }, session.accessToken);
  if (!response.ok) return NextResponse.json({ error: "Unable to delete product." }, { status: response.status });
  return NextResponse.json({ ok: true });
}
