import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireOwnerPage } from "@/lib/admin";
import { fetchAdminProduct } from "@/lib/adminProducts";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireOwnerPage();
  const product = await fetchAdminProduct(id, session.accessToken);
  if (!product) notFound();
  return <div className="space-y-7"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Catalogue</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">Edit product</h1><p className="mt-2 text-sm text-brand-muted">Update photos, pricing, product information and availability.</p></div><ProductForm product={product} /></div>;
}
