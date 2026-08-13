import StockManager from "@/components/admin/StockManager";
import { requireOwnerPage } from "@/lib/admin";
import { fetchAdminProducts } from "@/lib/adminProducts";

export default async function StockPage() {
  const session = await requireOwnerPage();
  const products = await fetchAdminProducts(session.accessToken);
  return <div className="space-y-7"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Inventory</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">Stock management</h1><p className="mt-2 text-sm text-brand-muted">Quickly mark products in or out of stock without opening the full edit form.</p></div><StockManager initialProducts={products} /></div>;
}
