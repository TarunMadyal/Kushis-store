"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

export default function CartPage() {
  const { items, subtotal, setQty, remove, count } = useCart();

  if (count === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl text-brand-ink">Your cart is empty</h1>
        <p className="mt-3 text-brand-muted">
          Let&apos;s find something beautiful for you.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Continue shopping
        </Link>
      </div>
    );
  }

  const shipping =
    site.freeShippingOver > 0 && subtotal >= site.freeShippingOver ? 0 : null;

  return (
    <div className="container-x py-12">
      <h1 className="text-4xl text-brand-ink">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-brand-line">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5">
                <div className="relative h-28 w-24 flex-none overflow-hidden rounded-lg bg-brand-surface">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-heading text-lg text-brand-ink hover:text-brand-primary"
                    >
                      {item.title}
                    </Link>
                    <span className="text-brand-ink">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                  {item.size && (
                    <p className="text-sm text-brand-muted">Size: {item.size}</p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-full border border-brand-line">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="px-3 py-1.5 text-lg"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="px-3 py-1.5 text-lg"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-sm text-brand-muted underline underline-offset-4 hover:text-brand-primary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-card border border-brand-line bg-brand-surface p-6">
          <h2 className="font-heading text-xl text-brand-ink">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-muted">Subtotal</dt>
              <dd className="text-brand-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">Shipping</dt>
              <dd className="text-brand-ink">
                {shipping === 0 ? "Free" : "Calculated at checkout"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-brand-line pt-3 text-base">
              <dt className="font-medium text-brand-ink">Total</dt>
              <dd className="font-medium text-brand-ink">
                {formatPrice(subtotal)}
              </dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-brand-muted underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
