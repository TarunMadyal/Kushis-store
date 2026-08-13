# Khushi's Store

A boutique e-commerce storefront for women's kurtas and sarees, built with
Next.js (App Router) and TypeScript. Supabase now powers authentication,
customer data, delivery addresses and the product catalogue.

> **New here / non-technical?** Read **[SETUP.md](./SETUP.md)** for the deployment
> and store-management checklist.

## Tech

- **Next.js 15** (App Router)
- **Tailwind CSS** with CSS-variable design tokens (`src/app/globals.css`)
- **Supabase Auth** for email/password customer accounts
- **Supabase Postgres** for customer profiles, delivery addresses and products
- **Supabase Storage-ready** `product-images` bucket for product photography
- Row Level Security so customers can only access their own profile/address rows
- Client-side cart (React context + `localStorage`)
- Checkout via WhatsApp today; **Razorpay** integration point ready for later

## Customer experience

Signup intentionally stays lightweight:

1. Name
2. Email
3. Password

Phone and address are **not** requested during signup or login. Customers can
save them later in **My Account**, or enter them only when checkout actually
needs delivery details. Signed-in customers get saved details pre-filled at
checkout and can choose whether to save changes for next time.

## Supabase setup

The application expects:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use a modern `sb_publishable_...` key. There is no service-role/secret key in
the storefront and no custom password storage.

Apply the SQL in:

```text
supabase/migrations/001_customer_platform.sql
```

That migration creates:

- `profiles` — optional customer name/phone data
- `addresses` — customer-owned delivery addresses
- `products` — the public catalogue
- RLS policies and Data API grants
- a public `product-images` Storage bucket
- starter catalogue rows matching the current sample products

Products are publicly readable, while profile/address rows are restricted to
the authenticated owner with Row Level Security.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

The storefront still renders the built-in sample catalogue if Supabase is not
configured or temporarily unavailable.

```bash
npm run build
npm start
```

## Project layout

```text
src/
  app/
    (shop)/
      page.tsx
      shop/
      product/[slug]/
      cart/
      checkout/        # asks for delivery data only when needed
      login/, signup/
      account/         # optional contact + saved address management
    api/
      auth/            # Supabase signup/login/logout/current user
      profile/         # authenticated profile read/update
      address/         # authenticated default address read/update
  components/
    auth/
      AuthForm.tsx
      AuthActions.tsx
      AccountProfile.tsx
  lib/
    supabase.ts        # Supabase Auth/Data REST integration + secure cookies
    products.ts        # Supabase catalogue with sample fallback
    sampleProducts.ts
    site.ts
supabase/
  migrations/
    001_customer_platform.sql
```

## Product management

For now, products can be managed from the Supabase Dashboard using the
`products` table and `product-images` Storage bucket. Product `images` is an
array of image URLs. This replaces the previous Sanity-backed runtime data
flow.

## Customising the look

- Brand text/contact: `src/lib/site.ts`
- Colours/fonts/radius: the `:root` token block in `src/app/globals.css`
