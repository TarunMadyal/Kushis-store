import ProductTable from "@/components/admin/ProductTable";
import { requireOwnerPage } from "@/lib/admin";
import { fetchAdminProducts } from "@/lib/adminProducts";

export default async function AdminProductsPage() {
  const session = await requireOwnerPage();
  const products = await fetchAdminProducts(session.accessToken);
  const inStock = products.filter((p) => p.in_stock).length;
  const featured = products.filter((p) => p.featured).length;

  return (
    <div className="space-y-7">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Catalogue</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">Products</h1><p className="mt-2 text-sm text-brand-muted">Add, edit, publish, feature and remove products from your storefront.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">Products</p><p className="mt-2 font-heading text-4xl">{products.length}</p></div>
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">In stock</p><p className="mt-2 font-heading text-4xl">{inStock}</p></div>
        <div className="rounded-2xl border border-brand-line bg-brand-surface p-5"><p className="text-xs uppercase tracking-wider text-brand-muted">Featured</p><p className="mt-2 font-heading text-4xl">{featured}</p></div>
      </div>
      <ProductTable initialProducts={products} />
    </div>
  );
}
