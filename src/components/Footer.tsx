import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-line bg-brand-surface">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-xl text-brand-ink">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-brand-muted">
            {site.tagline}.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            <li>
              <Link href="/shop" className="hover:text-brand-primary">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=kurta" className="hover:text-brand-primary">
                Kurtas
              </Link>
            </li>
            <li>
              <Link href="/shop?category=saree" className="hover:text-brand-primary">
                Sarees
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">Help</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            <li>
              <Link href="/about" className="hover:text-brand-primary">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-ink">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            <li>{site.contact.email}</li>
            <li>{site.contact.phone}</li>
            <li>
              <a
                href={site.contact.instagram}
                className="hover:text-brand-primary"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-brand-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}
