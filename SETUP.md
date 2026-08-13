# Khushi's Store — Setup & Owner's Guide

This store now uses **Supabase** instead of Sanity for customer accounts, saved delivery details, and the product catalogue.

## 1. Supabase setup

Create a Supabase project and add these environment variables in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=<project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<sb_publishable_... key>
```

Apply the database setup in:

```text
supabase/migrations/001_customer_platform.sql
```

It creates:

- `profiles` for optional customer contact details
- `addresses` for saved delivery addresses
- `products` for the shop catalogue
- secure Row Level Security policies
- a public `product-images` Storage bucket
- starter products matching the current sample catalogue

No service-role key or custom password secret is required by the storefront.

## 2. Customer accounts

Signup asks only for:

- Full name
- Email
- Password

Phone number and address are deliberately **not** requested at signup or login.
Customers can save them later under **My Account**, or simply enter them when
checkout actually needs delivery information.

When a signed-in customer checks out, any saved contact/address data is filled in
automatically. They can edit it for that order and choose whether to save the
updated details for next time.

## 3. Managing products

Open the Supabase Dashboard and use the **Table Editor → products** table.
Each product supports:

- `title`
- `slug`
- `category` (`kurta`, `saree`, `other`)
- `price`
- `compare_at_price`
- `description`
- `details` (text array)
- `fabric`
- `color`
- `sizes` (text array)
- `images` (text array of image URLs)
- `in_stock`
- `featured`

For product photos, upload files to **Storage → product-images** and place the
public image URLs in the product's `images` array.

The storefront falls back to built-in sample products if Supabase is unavailable,
so the site never becomes empty during setup.

## 4. Going live on Vercel

1. Connect the GitHub repository to Vercel.
2. Add the two Supabase variables under **Settings → Environment Variables**.
3. Enable them for **Production**, **Preview**, and **Development** as needed.
4. Redeploy after changing environment variables.
5. Test `/signup`, `/login`, `/account`, `/shop`, and `/checkout`.

To run locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## 5. Domain setup

In **Vercel → Settings → Domains**, add the domain. Then copy the DNS records
Vercel provides into GoDaddy's DNS manager. Vercel will provision HTTPS
automatically after the records resolve.

## 6. Razorpay payments

Checkout currently sends the confirmed order through WhatsApp. When Razorpay is
ready, add:

```text
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

The existing checkout page already contains the online-payment integration point.

## 7. Changing the brand/design

- Shop name, tagline, contact details and shipping banner: `src/lib/site.ts`
- Colours, fonts and shape tokens: `src/app/globals.css`
