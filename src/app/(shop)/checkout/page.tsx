"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";

const RAZORPAY_ENABLED = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

type CheckoutForm = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
};

const emptyForm: CheckoutForm = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  notes: "",
};

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [signedIn, setSignedIn] = useState(false);
  const [saveForLater, setSaveForLater] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadSavedDetails() {
      const meResponse = await fetch("/api/auth/me", { cache: "no-store" });
      const meData = await meResponse.json().catch(() => ({}));
      if (!meData.user) {
        setLoadingDetails(false);
        return;
      }

      setSignedIn(true);
      const [profileResponse, addressResponse] = await Promise.all([
        fetch("/api/profile", { cache: "no-store" }),
        fetch("/api/address", { cache: "no-store" }),
      ]);
      const profileData = await profileResponse.json().catch(() => ({}));
      const addressData = await addressResponse.json().catch(() => ({}));
      const saved = addressData.address;

      setForm((current) => ({
        ...current,
        name: saved?.recipientName || profileData.profile?.fullName || meData.user.name || "",
        phone: saved?.phone || profileData.profile?.phone || "",
        line1: saved?.line1 || "",
        line2: saved?.line2 || "",
        city: saved?.city || "",
        state: saved?.state || "",
        postalCode: saved?.postalCode || "",
        country: saved?.country || "India",
      }));
      setLoadingDetails(false);
    }

    loadSavedDetails().catch(() => setLoadingDetails(false));
  }, []);

  if (count === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-4xl text-brand-ink">Nothing to check out</h1>
        <Link href="/shop" className="btn-primary mt-8">Browse the collection</Link>
      </div>
    );
  }

  const canSubmit =
    form.name.trim() &&
    form.phone.trim() &&
    form.line1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim();

  async function placeOrder() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    if (signedIn && saveForLater) {
      await Promise.allSettled([
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName: form.name, phone: form.phone }),
        }),
        fetch("/api/address", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientName: form.name,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          }),
        }),
      ]);
    }

    const lines = items.map(
      (item) =>
        `• ${item.title}${item.size ? ` (${item.size})` : ""} × ${item.qty} — ${formatPrice(item.price * item.qty)}`,
    );
    const address = [
      form.line1,
      form.line2,
      `${form.city}, ${form.state} ${form.postalCode}`,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");
    const message = [
      `Hi ${site.name}! I'd like to place an order:`,
      "",
      ...lines,
      "",
      `Total: ${formatPrice(subtotal)}`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Delivery address: ${address}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const number = site.contact.whatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
    setSubmitting(false);
  }

  return (
    <div className="container-x py-12">
      <h1 className="text-4xl text-brand-ink">Checkout</h1>
      <p className="mt-2 text-sm text-brand-muted">
        {loadingDetails
          ? "Checking for saved delivery details…"
          : signedIn
            ? "We filled in anything you've saved. You can change it for this order."
            : "Delivery details are only requested now because they're needed to place your order."}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            placeOrder();
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
            <Field label="Phone / WhatsApp" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          </div>
          <Field label="Address line 1" value={form.line1} onChange={(line1) => setForm({ ...form, line1 })} />
          <Field label="Address line 2 (optional)" value={form.line2} onChange={(line2) => setForm({ ...form, line2 })} optional />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
            <Field label="State" value={form.state} onChange={(state) => setForm({ ...form, state })} />
            <Field label="PIN / Postal code" value={form.postalCode} onChange={(postalCode) => setForm({ ...form, postalCode })} />
            <Field label="Country" value={form.country} onChange={(country) => setForm({ ...form, country })} />
          </div>
          <Field label="Order notes (optional)" value={form.notes} onChange={(notes) => setForm({ ...form, notes })} textarea optional />

          {signedIn && (
            <label className="flex items-start gap-3 rounded-xl border border-brand-line bg-brand-surface p-4 text-sm text-brand-ink">
              <input
                type="checkbox"
                checked={saveForLater}
                onChange={(event) => setSaveForLater(event.target.checked)}
                className="mt-0.5"
              />
              <span>Save these contact and delivery details to my account for faster checkout next time.</span>
            </label>
          )}

          <button type="submit" disabled={!canSubmit || submitting} className="btn-primary w-full">
            {submitting ? "Preparing order…" : "Place order via WhatsApp"}
          </button>

          {RAZORPAY_ENABLED ? (
            <button type="button" className="btn-outline w-full" onClick={() => alert("Razorpay integration pending activation.")}>
              Pay online with Razorpay
            </button>
          ) : (
            <p className="text-center text-xs text-brand-muted">
              Online card / UPI payment (Razorpay) will be enabled soon. For now, orders are confirmed over WhatsApp.
            </p>
          )}
        </form>

        <aside className="h-fit rounded-card border border-brand-line bg-brand-surface p-6">
          <h2 className="font-heading text-xl text-brand-ink">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span className="text-brand-muted">
                  {item.title}{item.size ? ` (${item.size})` : ""} × {item.qty}
                </span>
                <span className="text-brand-ink">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-line pt-4 text-base">
            <span className="font-medium text-brand-ink">Total</span>
            <span className="font-medium text-brand-ink">{formatPrice(subtotal)}</span>
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
  onChange: (value: string) => void;
  textarea?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-brand-ink">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={!optional}
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-brand-line bg-brand-surface px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-primary"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={!optional}
          className="mt-1.5 w-full rounded-lg border border-brand-line bg-brand-surface px-4 py-2.5 text-base text-brand-ink outline-none focus:border-brand-primary"
        />
      )}
    </label>
  );
}
