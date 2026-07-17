"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/format";

export default function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const sizes = product.sizes || [];
  const [size, setSize] = useState<string | undefined>(
    sizes.length === 1 ? sizes[0] : undefined
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  const needsSize = sizes.length > 1;
  const canBuy = product.inStock && (!needsSize || !!size);

  // On mobile, if a size is required but not chosen, scroll to the picker
  // instead of doing nothing.
  function handleStickyAdd() {
    if (product.inStock && needsSize && !size) {
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    handleAdd();
  }

  function buildItem() {
    return {
      id: `${product._id}${size ? `-${size}` : ""}`,
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
      size,
    };
  }

  function handleAdd() {
    if (!canBuy) return;
    add(buildItem(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (!canBuy) return;
    add(buildItem(), qty);
    router.push("/cart");
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl text-brand-ink">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-brand-muted line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      {sizes.length > 0 && (
        <div className="mt-6" ref={sizeRef}>
          <p className="text-sm font-medium text-brand-ink">
            Size {needsSize && !size && (
              <span className="text-brand-primary">— please select</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-11 rounded-full border px-4 py-2 text-sm transition ${
                  size === s
                    ? "border-brand-primary bg-brand-primary text-brand-primary-ink"
                    : "border-brand-line text-brand-ink hover:border-brand-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-brand-ink">Quantity</p>
        <div className="mt-2 inline-flex items-center rounded-full border border-brand-line">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-2 text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAdd}
          disabled={!canBuy}
          className="btn-outline flex-1"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!canBuy}
          className="btn-primary flex-1"
        >
          Buy now
        </button>
      </div>

      {!product.inStock && (
        <p className="mt-4 text-sm text-brand-primary">
          This piece is currently sold out.
        </p>
      )}

      {/* Sticky add-to-cart bar — mobile only, always within thumb's reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-brand-surface/95 backdrop-blur lg:hidden">
        <div
          className="container-x flex items-center gap-3 py-3"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex-none leading-tight">
            <p className="text-[11px] text-brand-muted">
              {!product.inStock
                ? "Sold out"
                : needsSize && !size
                ? "Select a size"
                : size
                ? `Size ${size}`
                : "In stock"}
            </p>
            <p className="text-lg text-brand-ink">{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={handleStickyAdd}
            disabled={!product.inStock}
            className="btn-primary flex-1"
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
