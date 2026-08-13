import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { requireOwnerPage } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "Store Admin", template: "%s | Khushi's Store Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireOwnerPage();
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-brand-line bg-brand-surface">
        <div className="container-x flex min-h-20 flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><Link href="/admin/products" className="font-heading text-2xl text-brand-ink">Khushi's Store Admin</Link><p className="mt-1 text-xs text-brand-muted">Signed in as {session.user.email}</p></div>
          <Link href="/" className="btn-outline">View store ↗</Link>
        </div>
        <nav className="container-x flex gap-1 overflow-x-auto pb-3">
          <Link href="/admin/products" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-bg">Products</Link>
          <Link href="/admin/products/new" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-bg">Add product</Link>
          <Link href="/admin/stock" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-brand-bg">Stock</Link>
        </nav>
      </header>
      <main className="container-x py-8 sm:py-12">{children}</main>
    </div>
  );
}
