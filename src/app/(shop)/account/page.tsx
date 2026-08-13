import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My account",
};

export default async function AccountPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-brand-line bg-brand-surface p-6 shadow-sm sm:p-9">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">
          My account
        </p>
        <h1 className="font-heading text-4xl text-brand-ink">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-3 text-sm leading-6 text-brand-muted">
          You are signed in to Khushi&apos;s Store.
        </p>

        <div className="my-8 rounded-2xl border border-brand-line bg-brand-bg p-5">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-brand-muted">Name</dt>
              <dd className="mt-1 font-medium text-brand-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="text-brand-muted">Email</dt>
              <dd className="mt-1 font-medium text-brand-ink">{user.email}</dd>
            </div>
          </dl>
        </div>

        <LogoutButton />
      </div>
    </section>
  );
}
