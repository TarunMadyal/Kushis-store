"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

type User = { id: string; name: string; email: string };
type Profile = { fullName: string; phone: string };
type Address = {
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const emptyProfile: Profile = { fullName: "", phone: "" };
const emptyAddress: Address = {
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function AccountProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/auth/me", { cache: "no-store" });
      const meData = (await me.json().catch(() => ({}))) as { user?: User | null };
      if (!meData.user) {
        router.replace("/login");
        return;
      }
      setUser(meData.user);

      const [profileResponse, addressResponse] = await Promise.all([
        fetch("/api/profile", { cache: "no-store" }),
        fetch("/api/address", { cache: "no-store" }),
      ]);
      const profileData = await profileResponse.json().catch(() => ({}));
      const addressData = await addressResponse.json().catch(() => ({}));

      setProfile({
        fullName: profileData.profile?.fullName || meData.user.name || "",
        phone: profileData.profile?.phone || "",
      });
      if (addressData.address) setAddress({ ...emptyAddress, ...addressData.address });
      setLoading(false);
    }

    load().catch(() => setLoading(false));
  }, [router]);

  async function saveProfile() {
    setSavingProfile(true);
    setMessage("");
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Profile saved." : data.error || "Unable to save profile.");
    setSavingProfile(false);
  }

  async function saveAddress() {
    setSavingAddress(true);
    setMessage("");
    const response = await fetch("/api/address", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Delivery address saved." : data.error || "Unable to save address.");
    setSavingAddress(false);
  }

  if (loading) {
    return <div className="container-x py-20 text-center text-brand-muted">Loading your account…</div>;
  }

  if (!user) return null;

  return (
    <section className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-6 shadow-sm sm:p-9">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">My account</p>
          <h1 className="font-heading text-4xl text-brand-ink">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            Your email is {user.email}. Everything below is optional until you need it for delivery.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-6 sm:p-9">
          <h2 className="font-heading text-2xl text-brand-ink">Contact details</h2>
          <p className="mt-2 text-sm text-brand-muted">Save these once so checkout can fill them for you next time.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" value={profile.fullName} onChange={(fullName) => setProfile({ ...profile, fullName })} />
            <Field label="Phone / WhatsApp" value={profile.phone} onChange={(phone) => setProfile({ ...profile, phone })} />
          </div>
          <button type="button" className="btn-primary mt-6" onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving…" : "Save contact details"}
          </button>
        </div>

        <div className="rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-6 sm:p-9">
          <h2 className="font-heading text-2xl text-brand-ink">Default delivery address</h2>
          <p className="mt-2 text-sm text-brand-muted">
            You can leave this empty now. We&apos;ll ask for delivery details only when you place an order.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Recipient name" value={address.recipientName} onChange={(recipientName) => setAddress({ ...address, recipientName })} />
            <Field label="Phone" value={address.phone} onChange={(phone) => setAddress({ ...address, phone })} />
            <div className="sm:col-span-2"><Field label="Address line 1" value={address.line1} onChange={(line1) => setAddress({ ...address, line1 })} /></div>
            <div className="sm:col-span-2"><Field label="Address line 2 (optional)" value={address.line2} onChange={(line2) => setAddress({ ...address, line2 })} /></div>
            <Field label="City" value={address.city} onChange={(city) => setAddress({ ...address, city })} />
            <Field label="State" value={address.state} onChange={(state) => setAddress({ ...address, state })} />
            <Field label="PIN / Postal code" value={address.postalCode} onChange={(postalCode) => setAddress({ ...address, postalCode })} />
            <Field label="Country" value={address.country} onChange={(country) => setAddress({ ...address, country })} />
          </div>
          <button type="button" className="btn-primary mt-6" onClick={saveAddress} disabled={savingAddress}>
            {savingAddress ? "Saving…" : "Save delivery address"}
          </button>
        </div>

        {message && <p className="rounded-xl border border-brand-line bg-brand-surface px-4 py-3 text-sm text-brand-ink">{message}</p>}

        <div><LogoutButton /></div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-brand-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-brand-line bg-brand-bg px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-primary"
      />
    </label>
  );
}
