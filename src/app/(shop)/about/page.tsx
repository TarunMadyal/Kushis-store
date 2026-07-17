import { site } from "@/lib/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="font-heading text-sm uppercase tracking-[0.3em] text-brand-accent">
        Our story
      </p>
      <h1 className="mt-3 text-4xl text-brand-ink">About {site.name}</h1>

      <div className="mt-6 space-y-5 text-brand-muted">
        <p>
          {site.name} began with a simple love for beautiful, wearable Indian
          clothing. We curate kurtas and sarees that feel as good as they look —
          pieces made to be worn again and again, from quiet mornings to bright
          celebrations.
        </p>
        <p>
          Every item is handpicked for its fabric, fit, and finish. We work with
          artisans and small makers to bring you thoughtful craft at honest
          prices, celebrating the colour and texture of Indian textiles.
        </p>
        <p>
          Thank you for being here. We hope you find something that makes you
          feel wonderful.
        </p>
      </div>
    </div>
  );
}
