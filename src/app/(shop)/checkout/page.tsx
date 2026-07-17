"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

// Razorpay is not wired up yet (keys come later). Until then, checkout places
// the order over WhatsApp — a common, reliable flow for small Indian boutiques.
// When you're ready, the "Pay online" path can be switched on by adding the
// Razorpay keys and enabling the payment button (see SETUP.md).
const RAZORPAY_ENABLED = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  if (count === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl text-brand-ink">Nothing to check out</h1>
        <Link href="/shop" className="btn-primary mt-8">
          Browse the collection
        </Link>
      </div>
    );
  }

  const canSubmit = form.name.trim() && form.phone.trim() && form.address.trim();

  function orderViaWhatsApp() {
    const lines = items.map(
      (i) =>
        `• ${i.title}${i.size ? ` (${i.size})` : ""} × ${i.qty} — ${formatPrice(
          i.price * i.qty
        )}`
    );
    const message = [
      `Hi ${site.name}! I'd like to place an order:`,
      "",
      ...lines,
      "",
      `Total: ${formatPrice(subtotal)}`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const number = site.contact.whatsapp.replace(/[^0-9]/g, "");
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <div className="container-x py-12">
      <h1 className="text-4xl text-brand-ink">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Details form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            orderViaWhatsApp();
          }}
          className="space-y-5"
        >
          <Field
            label="Full name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Phone / WhatsApp"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field
            label="Delivery address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
            textarea
          />
          <Field
            label="Order notes (optional)"
            value={form.notes}
            onChange={(v) => setForm({ ...form, notes: v })}
            textarea
            optional
          />

          <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
            Place order via WhatsApp
          </button>

          {RAZORPAY_ENABLED ? (
            <button
              type="button"
              className="btn-outline w-full"
              onClick={() => alert("Razorpay integration pending activation.")}
            >
              Pay online with Razorpay
            </button>
          ) : (
            <p className="text-center text-xs text-brand-muted">
              Online card / UPI payment (Razorpay) will be enabled soon. For now,
              orders are confirmed over WhatsApp.
            </p>
          )}
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-card border border-brand-line bg-brand-surface p-6">
          <h2 className="font-heading text-xl text-brand-ink">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span className="text-brand-muted">
                  {i.title}
                  {i.size ? ` (${i.size})` : ""} × {i.qty}
                </span>
                <span className="text-brand-ink">
                  {formatPrice(i.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-line pt-4 text-base">
            <span className="font-medium text-brand-ink">Total</span>
            <span className="font-medium text-brand-ink">
              {formatPrice(subtotal)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-brand-ink">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={!optional}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-brand-line bg-brand-surface px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-primary"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={!optional}
          className="mt-1.5 w-full rounded-lg border border-brand-line bg-brand-surface px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-primary"
        />
      )}
    </label>
  );
}
