import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getOwnerApiSession } from "@/lib/admin";
import { supabasePublicStorageUrl, supabaseStorageFetch } from "@/lib/supabase";

export const runtime = "nodejs";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getOwnerApiSession();
  if (!session) return NextResponse.json({ error: "Owner access required." }, { status: 403 });

  const form = await request.formData();
  const files = form.getAll("files").filter((value): value is File => value instanceof File);
  if (!files.length) return NextResponse.json({ error: "Choose at least one photo." }, { status: 400 });
  if (files.length > 8) return NextResponse.json({ error: "Upload at most 8 photos at a time." }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    if (!allowed.has(file.type)) return NextResponse.json({ error: "Photos must be JPG, PNG or WebP." }, { status: 400 });
    if (file.size > maxBytes) return NextResponse.json({ error: "Each photo must be 6 MB or smaller." }, { status: 400 });
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${session.user.id}/${Date.now()}-${randomUUID()}.${ext}`;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const response = await supabaseStorageFetch(`/object/product-images/${encodedPath}`, {
      method: "POST",
      headers: { "Content-Type": file.type, "x-upsert": "false" },
      body: Buffer.from(await file.arrayBuffer()),
    }, session.accessToken);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error("Product image upload failed", data);
      return NextResponse.json({ error: "A photo could not be uploaded. Please try again." }, { status: response.status });
    }
    urls.push(supabasePublicStorageUrl("product-images", path));
  }
  return NextResponse.json({ urls });
}
