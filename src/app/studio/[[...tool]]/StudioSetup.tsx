import Link from "next/link";

// Shown at /studio before Sanity is connected, with the exact steps to
// switch on the real admin dashboard.
export default function StudioSetup() {
  return (
    <div className="min-h-screen bg-brand-bg px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-heading text-sm uppercase tracking-[0.3em] text-brand-muted">
          Kushi&apos;s Store
        </p>
        <h1 className="mt-3 font-heading text-3xl text-brand-ink">
          Admin dashboard — one quick setup step
        </h1>
        <p className="mt-4 text-brand-muted">
          The product dashboard runs on a free tool called{" "}
          <strong className="text-brand-ink">Sanity</strong>. Connect it once and
          you&apos;ll be able to add products, upload photos, and set prices from
          right here.
        </p>

        <ol className="mt-8 space-y-4 text-brand-ink">
          {[
            "Create a free account at sanity.io and start a new project.",
            "Copy the Project ID it gives you.",
            "Add it to the site's settings as NEXT_PUBLIC_SANITY_PROJECT_ID and redeploy.",
            "Come back to this page — the full dashboard will load here.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-brand-primary-ink">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-brand-muted">
          Full step-by-step instructions are in the project&apos;s{" "}
          <code className="rounded bg-brand-surface px-1.5 py-0.5">
            SETUP.md
          </code>{" "}
          file. Until this is connected, the shop shows sample products so you can
          preview the design.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-medium text-brand-primary underline underline-offset-4"
        >
          ← Back to the shop
        </Link>
      </div>
    </div>
  );
}
