import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import Gallery from "@/components/product/Gallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_LABELS } from "@/lib/types";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="container-x py-10">
      <nav className="text-sm text-brand-muted">
        <Link href="/shop" className="hover:text-brand-primary">
          Shop
        </Link>{" "}
        /{" "}
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-brand-primary"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>{" "}
        / <span className="text-brand-ink">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Gallery images={product.images} title={product.title} />

        <div>
          <h1 className="text-4xl text-brand-ink">{product.title}</h1>
          {product.color && (
            <p className="mt-2 text-sm uppercase tracking-wide text-brand-muted">
              {product.color}
              {product.fabric ? ` · ${product.fabric}` : ""}
            </p>
          )}

          <p className="mt-5 text-brand-muted">{product.description}</p>

          <ProductPurchase product={product} />

          {product.details && product.details.length > 0 && (
            <div className="mt-10 border-t border-brand-line pt-6">
              <h2 className="font-heading text-xl text-brand-ink">Details</h2>
              <ul className="mt-3 space-y-2 text-sm text-brand-muted">
                {product.details.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-brand-primary">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl text-brand-ink">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
