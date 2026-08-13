"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminProductRecord } from "@/lib/adminProducts";

export default function ProductTable({ initialProducts }: { initialProducts: AdminProductRecord[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.title} ${p.category} ${p.color || ""}`.toLowerCase().includes(q));
  }, [products, query]);

  async function patch(id: string, values: Record<string, unknown>) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update product.");
      setProducts((current) => current.map((p) => (p.id === id ? { ...p, ...data.product } : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update product.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(product: AdminProductRecord) {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return;
    setBusy(product.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to delete product.");
      setProducts((current) => current.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="w-full rounded-full border border-brand-line bg-white px-5 py-3 text-sm outline-none focus:border-brand-primary sm:max-w-sm" />
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-brand-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-brand-line bg-brand-bg text-xs uppercase tracking-wide text-brand-muted">
              <tr><th className="px-5 py-4">Product</th><th className="px-4 py-4">Category</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4">Homepage</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {filtered.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.images[0] || "/samples/marigold-kurta.svg"} alt="" className="h-16 w-14 rounded-lg object-cover" /><div><p className="font-semibold text-brand-ink">{product.title}</p><p className="mt-1 text-xs text-brand-muted">/{product.slug}</p></div></div></td>
                  <td className="px-4 py-4 capitalize">{product.category}</td>
                  <td className="px-4 py-4">₹{product.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-4"><button disabled={busy === product.id} onClick={() => patch(product.id, { inStock: !product.in_stock })} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${product.in_stock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{product.in_stock ? "In stock" : "Out of stock"}</button></td>
                  <td className="px-4 py-4"><button disabled={busy === product.id} onClick={() => patch(product.id, { featured: !product.featured })} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${product.featured ? "bg-amber-50 text-amber-700" : "bg-brand-bg text-brand-muted"}`}>{product.featured ? "Featured" : "Not featured"}</button></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={`/product/${product.slug}`} target="_blank" className="rounded-full border border-brand-line px-3 py-2 text-xs font-semibold hover:border-brand-primary">View</Link><Link href={`/admin/products/${product.id}/edit`} className="rounded-full border border-brand-line px-3 py-2 text-xs font-semibold hover:border-brand-primary">Edit</Link><button disabled={busy === product.id} onClick={() => remove(product)} className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button></div></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-brand-muted">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
