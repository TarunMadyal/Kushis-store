import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import type { Category } from "@/lib/types";

export const metadata = { title: "Shop" };

const filters: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "kurta", label: "Kurtas" },
  { value: "saree", label: "Sarees" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category ?? "all";
  const all = await getAllProducts();
  const products =
    active === "all" ? all : all.filter((p) => p.category === active);

  return (
    <div className="container-x py-12">
      <header className="text-center">
        <h1 className="text-4xl text-brand-ink">The Collection</h1>
        <p className="mt-2 text-brand-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"} to love
        </p>
      </header>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {filters.map((f) => {
          const isActive =
            (f.value === "all" && active === "all") || f.value === active;
          const href =
            f.value === "all" ? "/shop" : `/shop?category=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`chip ${
                isActive
                  ? "border-brand-primary bg-brand-primary text-brand-primary-ink"
                  : ""
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-brand-muted">
          No products here yet — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
