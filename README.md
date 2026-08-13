# Khushi's Store

A boutique e-commerce storefront for women's kurtas and sarees, built with
Next.js (App Router) and TypeScript. Products are managed through an embedded
Sanity CMS dashboard, with a warm, easily-retunable design system.

> **New here / non-technical?** Read **[SETUP.md](./SETUP.md)** — it explains how
> to add products, go live, connect a domain, and turn on payments in plain
> language.

## Tech

- **Next.js 15** (App Router, server components)
- **Tailwind CSS** with CSS-variable design tokens (`src/app/globals.css`)
- **Sanity** embedded Studio at `/studio` for product management
- Customer signup/login with encrypted Sanity records and HTTP-only sessions
- Client-side cart (React context + `localStorage`)
- Checkout via WhatsApp today; **Razorpay** integration point ready for later

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

The storefront renders built-in **sample products** until Sanity is configured,
so it works out of the box. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` (see
`.env.example`) to switch to real, CMS-managed products.

Customer signup/login also needs two **server-only** environment variables:

- `SANITY_API_TOKEN` — a Sanity token with permission to read/create customer auth documents.
- `AUTH_SECRET` — a stable random secret of at least 32 characters. Do not rotate it without migrating existing customer records because it encrypts stored credentials and signs sessions.

For example, generate a strong auth secret with:

```bash
openssl rand -base64 48
```

Never prefix either secret with `NEXT_PUBLIC_`.

```bash
npm run build    # production build
npm start        # serve the production build
```

## Project layout

```
src/
  app/
    (shop)/            # storefront (header + footer + cart chrome)
      page.tsx         # home
      shop/            # product listing + category filter
      product/[slug]/  # product detail
      cart/            # cart
      checkout/        # checkout (WhatsApp order; Razorpay-ready)
      login/, signup/  # customer authentication screens
      account/         # signed-in customer account page
      about/, contact/
    api/auth/           # signup, login, logout, current-session endpoints
    studio/[[...tool]] # embedded Sanity admin dashboard
  components/          # Header, Footer, ProductCard, auth, cart, product UI
  lib/
    auth.ts            # password hashing, encryption, signed sessions
    site.ts            # brand config — name, tagline, contact (single source)
    products.ts        # data layer: Sanity when configured, else sample data
    sampleProducts.ts  # built-in preview catalogue
    sanity/            # storefront + server-only auth clients, image builder, env
  sanity/schemaTypes/  # product schema (the "Add product" form)
sanity.config.ts       # Sanity Studio config
```

## Customising the look

- Brand text / contact: `src/lib/site.ts`
- Colours, fonts, radius: the `:root` token block in `src/app/globals.css`
