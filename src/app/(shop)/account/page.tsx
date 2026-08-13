import type { Metadata } from "next";
import Link from "next/link";
import AccountProfile from "@/components/auth/AccountProfile";
import { isOwnerUser } from "@/lib/admin";
import { resolveSession } from "@/lib/supabase";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const session = await resolveSession();
  return (
    <>
      {session && isOwnerUser(session.user.id) && (
        <section className="container-x pt-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-brand-primary/30 bg-brand-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">Store owner</p><h2 className="mt-1 font-heading text-2xl">Manage your catalogue</h2><p className="mt-1 text-sm text-brand-muted">Add products, edit listings and update stock from your private admin area.</p></div>
            <Link href="/admin/products" className="btn-primary shrink-0">Open product manager</Link>
          </div>
        </section>
      )}
      <AccountProfile />
    </>
  );
}
