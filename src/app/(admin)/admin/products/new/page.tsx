import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return <div className="space-y-7"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Catalogue</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">Add product</h1><p className="mt-2 text-sm text-brand-muted">The same product fields you used in Sanity, now managed directly in your store.</p></div><ProductForm /></div>;
}
