// ─────────────────────────────────────────────────────────────
// Central place for all brand / shop details.
// Change the name, tagline, contact info, or social links here and
// they update everywhere across the site.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Kushi's Store",
  shortName: "Kushi's",
  tagline: "Handpicked kurtas & sarees for the modern woman",
  description:
    "Kushi's Store — a curated boutique of elegant kurtas and sarees, blending timeless Indian craft with everyday grace.",
  currency: "INR",
  currencySymbol: "₹",
  contact: {
    email: "Khushirjain2002@gmail.com",
    phone: "+91 63637 63956",
    whatsapp: "+91 63637 63956",
    instagram: "https://instagram.com/",
    address: "India",
  },
  // Free shipping threshold (in rupees). Set to 0 to disable the banner.
  freeShippingOver: 2999,
};

export type Site = typeof site;
