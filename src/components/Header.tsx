"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "./cart/CartContext";

const nav = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=kurta", label: "Kurtas" },
  { href: "/shop?category=saree", label: "Sarees" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-brand-surface/90 backdrop-blur">
      {site.freeShippingOver > 0 && (
        <div className="bg-brand-ink text-center text-xs tracking-wide text-brand-bg">
          <p className="py-2">
            Free shipping on orders over {site.currencySymbol}
            {site.freeShippingOver.toLocaleString("en-IN")}
          </p>
        </div>
      )}

      <div className="container-x flex items-center justify-between py-4">
        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon />
        </button>

        <Link href="/" className="flex flex-col items-center md:items-start">
          <span className="font-heading text-2xl leading-none text-brand-ink">
            {site.name}
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.25em] text-brand-muted md:block">
            Kurtas &amp; Sarees
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-brand-ink transition hover:text-brand-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-brand-ink"
          aria-label="Cart"
        >
          <BagIcon />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-semibold text-brand-primary-ink">
              {count}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <nav className="border-t border-brand-line bg-brand-surface md:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-brand-line px-5 py-3 text-sm text-brand-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
