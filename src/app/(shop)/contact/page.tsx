import { site } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const whatsapp = site.contact.whatsapp.replace(/[^0-9]/g, "");
  return (
    <div className="container-x max-w-2xl py-16">
      <p className="font-heading text-sm uppercase tracking-[0.3em] text-brand-accent">
        We&apos;d love to hear from you
      </p>
      <h1 className="mt-3 text-4xl text-brand-ink">Contact us</h1>
      <p className="mt-4 text-brand-muted">
        Questions about a product, sizing, or your order? Reach out any time —
        we&apos;re happy to help.
      </p>

      <div className="mt-8 space-y-4">
        <ContactRow label="Email" value={site.contact.email} href={`mailto:${site.contact.email}`} />
        <ContactRow label="Phone" value={site.contact.phone} href={`tel:${site.contact.phone.replace(/\s/g, "")}`} />
        <ContactRow label="WhatsApp" value={site.contact.whatsapp} href={`https://wa.me/${whatsapp}`} />
        <ContactRow label="Instagram" value="@kushisstore" href={site.contact.instagram} />
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-card border border-brand-line bg-brand-surface px-5 py-4 transition hover:border-brand-primary"
    >
      <span className="text-sm uppercase tracking-wide text-brand-muted">
        {label}
      </span>
      <span className="text-brand-ink">{value}</span>
    </a>
  );
}
