"use client";

import { useMemo, useState } from "react";
import type { AdminProductRecord } from "@/lib/adminProducts";

export default function StockManager({ initialProducts }: { initialProducts: AdminProductRecord[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products;
  }, [products, query]);

  const inStockCount = products.filter((p) => p.in_stock).length;

  async function setStock(product: AdminProductRecord, inStock: boolean) {
    setBusy(product.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to update stock.");
      setProducts((current) => current.map((p) => (p.id === product.id ? { ...p, in_stock: inStock } : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update stock.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">Total products</p><p className="mt-2 font-heading text-4xl">{products.length}</p></div>
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">In stock</p><p className="mt-2 font-heading text-4xl text-green-700">{inStockCount}</p></div>
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">Out of stock</p><p className="mt-2 font-heading text-4xl text-red-700">{products.length - inStockCount}</p></div>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a product…" className="w-full rounded-full border border-brand-line bg-white px-5 py-3 text-sm outline-none focus:border-brand-primary sm:max-w-sm" />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-3">
        {filtered.map((product) => (
          <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-brand-line bg-brand-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4"><img src={product.images[0] || "/samples/marigold-kurta.svg"} alt="" className="h-16 w-14 rounded-lg object-cover" /><div><p className="font-semibold text-brand-ink">{product.title}</p><p className="mt-1 text-xs capitalize text-brand-muted">{product.category}</p></div></div>
            <div className="flex gap-2"><button disabled={busy === product.id || product.in_stock} onClick={() => setStock(product, true)} className={`rounded-full px-4 py-2 text-sm font-semibold ${product.in_stock ? "bg-green-100 text-green-800" : "border border-brand-line"}`}>In stock</button><button disabled={busy === product.id || !product.in_stock} onClick={() => setStock(product, false)} className={`rounded-full px-4 py-2 text-sm font-semibold ${!product.in_stock ? "bg-red-100 text-red-800" : "border border-brand-line"}`}>Out of stock</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
