import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-brand-surface">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted">
            No image
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-brand-primary-ink">
            {discount}% off
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-ink/80 px-3 py-1 text-xs text-brand-bg">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-heading text-lg leading-snug text-brand-ink">
          {product.title}
        </h3>
        {product.fabric && (
          <p className="text-xs uppercase tracking-wide text-brand-muted">
            {product.fabric}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-brand-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice &&
            product.compareAtPrice > product.price && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}
