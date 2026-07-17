# Khushi's Store — Setup & Owner's Guide

This guide is written to be followed step-by-step, no coding required for the
day-to-day parts. It covers:

1. [How adding products works (photos, names, prices, descriptions)](#1-adding-products)
2. [Getting the shop live on the internet](#2-going-live-deploying)
3. [Connecting your GoDaddy domain](#3-connecting-your-godaddy-domain)
4. [Turning on Razorpay payments](#4-turning-on-razorpay-payments)
5. [Changing the shop name, colours, and look](#5-changing-the-name-colours--look)

Until you finish step 1, the shop shows a few **sample products** automatically
so you can preview the design. They disappear the moment real products are added.

---

## 1. Adding products

Products are managed through a free, friendly dashboard called **Sanity**. Your
friend logs in, clicks **"Add product,"** drags in photos, types the name,
price, and description, and hits **Publish** — it appears on the site right away.
No code, ever.

The dashboard lives right inside the website at the address **`/studio`**
(for example `khushisstore.com/studio`).

### One-time setup (about 10 minutes)

1. Go to **[sanity.io](https://www.sanity.io/)** and create a free account.
2. Create a **new project** (any name, e.g. "Khushi's Store"). Choose the
   **"Production"** dataset when asked.
3. On the project's **API / settings** page, copy the **Project ID**
   (a short code like `abc123xy`).
4. Add it to the website's settings as an environment variable:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xy
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   (In Vercel — see step 2 — this is **Settings → Environment Variables**.)
5. Still on sanity.io, open **API → CORS origins** and add your website address
   (e.g. `https://khushisstore.com`) so the dashboard can save changes.
6. Redeploy the site. Now visit `yoursite.com/studio` — the real dashboard loads.

### The everyday routine (what your friend does)

1. Go to `yoursite.com/studio` and log in.
2. Click **Product → Create new**.
3. Fill in the form:
   - **Product name** (e.g. "Marigold Cotton Kurta")
   - **Web address** — click *Generate* (it fills itself from the name)
   - **Category** — Kurta, Saree, or Other
   - **Photos** — drag and drop one or more images
   - **Price (₹)** — and optionally an **Original price** to show a discount
   - **Short description**, **Details** (bullet points), **Fabric**,
     **Colour**, **Sizes**
   - **In stock?** and **Feature on homepage?** toggles
4. Click **Publish**. Done — it's on the site.

To edit or remove a product later, open it in the dashboard, change it, and
Publish again (or use the menu to delete).

---

## 2. Going live (deploying)

The easiest and free way to host this site is **[Vercel](https://vercel.com/)**
(made by the same team as the framework this site uses).

1. Push this project to a GitHub repository (already done if you're reading this
   in GitHub).
2. Sign in to Vercel with GitHub and click **"Add New → Project."**
3. Pick this repository and click **Deploy**. That's it — you get a live URL like
   `kushis-store.vercel.app`.
4. Add the environment variables from step 1 (and step 4) under
   **Settings → Environment Variables**, then redeploy.

### To run it on your own computer (optional, for previewing)

```bash
npm install
npm run dev
```
Then open <http://localhost:3000>.

---

## 3. Connecting your GoDaddy domain

Once the site is on Vercel and you've bought a domain from GoDaddy:

1. In **Vercel → your project → Settings → Domains**, type your domain
   (e.g. `khushisstore.com`) and click **Add**.
2. Vercel shows you the DNS records to set. Usually:
   - An **A record** pointing `@` to Vercel's IP, **and/or**
   - A **CNAME record** pointing `www` to `cname.vercel-dns.com`.
3. Log in to **GoDaddy → your domain → DNS → Manage DNS**, and add/replace those
   records exactly as Vercel shows them.
4. Wait a little while (usually minutes, up to a few hours) for it to connect.
   Vercel will show a green checkmark when it's live, with HTTPS set up
   automatically.

---

## 4. Turning on Razorpay payments

The checkout works today by sending the order over **WhatsApp** — a simple,
reliable way to start taking orders immediately. When you're ready to accept
online card/UPI payments:

1. Create an account at **[razorpay.com](https://razorpay.com/)** and complete
   their KYC/business verification.
2. From **Razorpay Dashboard → Settings → API Keys**, generate keys and copy the
   **Key ID** and **Key Secret**.
3. Add them to the website's environment variables:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
   ```
4. Tell me (or your developer) to switch on the payment button — the checkout
   page already has the integration point marked and ready. This final wiring
   (creating the order + verifying the payment) is a short, well-defined task.

---

## 5. Changing the name, colours & look

Everything is built so the look can be retuned quickly — perfect for matching a
specific design (like a Pinterest board or a screenshot).

- **Shop name, tagline, contact details, Instagram, shipping banner:**
  edit **`src/lib/site.ts`**. Change them once and they update across the whole
  site (header, footer, page titles, etc.).
- **Colours, fonts, corner roundness:** edit the design tokens at the top of
  **`src/app/globals.css`** (the `:root { ... }` block). For example, change
  `--color-primary` to switch the button/accent colour everywhere.

When you send the final design reference, most of the restyle happens by editing
just those two files.
