"use client";

import { useEffect, useState } from "react";

type ProfileData = {
  user?: { name?: string; email?: string };
  profile?: { full_name?: string | null; phone?: string | null } | null;
  address?: {
    label?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
};

const emptyForm = {
  fullName: "",
  phone: "",
  label: "Home",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CustomerProfileForm() {
  const [form, setForm] = useState(emptyForm);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/account/profile", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = "/login";
          return null;
        }
        return (await response.json()) as ProfileData;
      })
      .then((data) => {
        if (!data) return;
        setEmail(data.user?.email || "");
        setForm({
          fullName: data.profile?.full_name || data.user?.name || "",
          phone: data.profile?.phone || "",
          label: data.address?.label || "Home",
          line1: data.address?.line1 || "",
          line2: data.address?.line2 || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postal_code || "",
          country: data.address?.country || "India",
        });
      })
      .catch(() => setError("Unable to load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save your details.");
      setMessage("Your details have been saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your details.");
    } finally {
      setSaving(false);
    }
  }

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return <p className="text-sm text-brand-muted">Loading your account…</p>;
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none focus:border-brand-primary";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-brand-ink">Personal details</h2>
        <p className="mt-1 text-sm text-brand-muted">
          These are optional and help us make checkout faster later.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-brand-ink">Email</span>
            <input value={email} disabled className={`${fieldClass} opacity-70`} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">Full name</span>
            <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">Phone / WhatsApp</span>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={fieldClass} />
          </label>
        </div>
      </div>

      <div className="border-t border-brand-line pt-8">
        <h2 className="font-heading text-2xl text-brand-ink">Saved delivery address</h2>
        <p className="mt-1 text-sm text-brand-muted">
          You can leave this blank now and enter it only when you place an order.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">Label</span>
            <input value={form.label} onChange={(e) => update("label", e.target.value)} className={fieldClass} placeholder="Home" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-brand-ink">Address line 1</span>
            <input value={form.line1} onChange={(e) => update("line1", e.target.value)} className={fieldClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-brand-ink">Address line 2</span>
            <input value={form.line2} onChange={(e) => update("line2", e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">City</span>
            <input value={form.city} onChange={(e) => update("city", e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">State</span>
            <input value={form.state} onChange={(e) => update("state", e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">PIN code</span>
            <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-brand-ink">Country</span>
            <input value={form.country} onChange={(e) => update("country", e.target.value)} className={fieldClass} />
          </label>
        </div>
      </div>

      {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="button" onClick={save} disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Save details"}
      </button>
    </div>
  );
}
