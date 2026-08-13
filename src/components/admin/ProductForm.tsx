"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { AdminProductRecord } from "@/lib/adminProducts";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

type Props = { product?: AdminProductRecord | null };

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const editing = Boolean(product);
  const [title, setTitle] = useState(product?.title || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [category, setCategory] = useState(product?.category || "kurta");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price?.toString() || "",
  );
  const [description, setDescription] = useState(product?.description || "");
  const [details, setDetails] = useState((product?.details || []).join("\n"));
  const [fabric, setFabric] = useState(product?.fabric || "");
  const [color, setColor] = useState(product?.color || "");
  const [sizes, setSizes] = useState((product?.sizes || []).join(", "));
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const field =
    "mt-2 w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-primary";

  function changeTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      Array.from(files).forEach((file) => form.append("files", file));
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to upload photos.");
      setImages((current) => [...current, ...(data.urls || [])].slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload photos.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title,
      slug,
      category,
      price,
      compareAtPrice,
      description,
      details: details.split("\n").map((v) => v.trim()).filter(Boolean),
      fabric,
      color,
      sizes: sizes.split(",").map((v) => v.trim()).filter(Boolean),
      images,
      inStock,
      featured,
    };

    try {
      const response = await fetch(
        editing ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save product.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6 rounded-2xl border border-brand-line bg-brand-surface p-5 sm:p-7">
          <div>
            <label className="text-sm font-semibold text-brand-ink">Product name</label>
            <input value={title} onChange={(e) => changeTitle(e.target.value)} className={field} required />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink">Web address</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={field}
              required
            />
            <p className="mt-2 text-xs text-brand-muted">Generated automatically from the product name. You can still edit it.</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink">Category</label>
            <div className="mt-3 flex flex-wrap gap-3">
              {(["kurta", "saree", "other"] as const).map((value) => (
                <label key={value} className={`cursor-pointer rounded-full border px-4 py-2 text-sm capitalize ${category === value ? "border-brand-primary bg-brand-primary text-white" : "border-brand-line"}`}>
                  <input type="radio" className="sr-only" value={value} checked={category === value} onChange={() => setCategory(value)} />
                  {value}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-brand-ink">Selling price (₹)</label>
              <input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className={field} required />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-ink">Original price (₹, optional)</label>
              <input type="number" min="0" step="1" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className={field} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink">Short description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={field} required />
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink">Details / bullet points</label>
            <textarea rows={5} value={details} onChange={(e) => setDetails(e.target.value)} className={field} placeholder={"Hand-block printed cotton\nRelaxed straight fit\nDry clean recommended"} />
            <p className="mt-2 text-xs text-brand-muted">Put each bullet point on a new line.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-brand-ink">Fabric</label>
              <input value={fabric} onChange={(e) => setFabric(e.target.value)} className={field} />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-ink">Colour</label>
              <input value={color} onChange={(e) => setColor(e.target.value)} className={field} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-ink">Available sizes</label>
            <input value={sizes} onChange={(e) => setSizes(e.target.value)} className={field} placeholder="S, M, L, XL" />
            <p className="mt-2 text-xs text-brand-muted">Separate sizes with commas.</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-brand-line bg-brand-surface p-5">
            <h2 className="font-heading text-2xl text-brand-ink">Product photos</h2>
            <p className="mt-1 text-sm text-brand-muted">Upload up to 12 JPG, PNG or WebP images.</p>
            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-brand-primary px-4 py-7 text-center text-sm font-semibold text-brand-primary hover:bg-brand-bg">
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => uploadFiles(e.target.files)} disabled={uploading || images.length >= 12} />
              {uploading ? "Uploading photos…" : "+ Upload photos"}
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-brand-line bg-brand-bg">
                  <img src={url} alt={`Product photo ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                  <button type="button" onClick={() => setImages((current) => current.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-red-600 shadow">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-brand-line bg-brand-surface p-5">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="mt-1 h-4 w-4" />
              <span><strong className="block text-sm text-brand-ink">In stock</strong><span className="text-xs text-brand-muted">Customers can see that this item is available.</span></span>
            </label>
            <label className="flex items-start gap-3 border-t border-brand-line pt-4">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="mt-1 h-4 w-4" />
              <span><strong className="block text-sm text-brand-ink">Feature on homepage</strong><span className="text-xs text-brand-muted">Highlights this product in the featured collection.</span></span>
            </label>
          </div>
        </aside>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-primary min-w-40">{saving ? "Saving…" : editing ? "Save changes" : "Publish product"}</button>
        <Link href="/admin/products" className="btn-outline">Cancel</Link>
      </div>
    </form>
  );
}
