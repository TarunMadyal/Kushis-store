import type { Product } from "./types";

// Sample catalogue used automatically when Sanity is not yet configured,
// so the site looks alive from the very first preview. Once your friend
// starts adding real products in the /studio dashboard, these disappear
// and the real products take over.
//
// Placeholder photos are local SVGs so the preview never shows a broken image.
export const sampleProducts: Product[] = [
  {
    _id: "sample-1",
    title: "Marigold Cotton Kurta",
    slug: "marigold-cotton-kurta",
    category: "kurta",
    price: 1499,
    compareAtPrice: 1999,
    description:
      "A breezy hand-block cotton kurta in warm marigold, cut for easy all-day comfort.",
    details: [
      "Hand-block printed pure cotton",
      "Relaxed straight fit with side slits",
      "Three-quarter sleeves",
    ],
    fabric: "100% Cotton",
    color: "Marigold",
    sizes: ["S", "M", "L", "XL"],
    images: ["/samples/marigold-kurta.svg"],
    inStock: true,
    featured: true,
  },
  {
    _id: "sample-2",
    title: "Ivory Chikankari Kurta",
    slug: "ivory-chikankari-kurta",
    category: "kurta",
    price: 2299,
    description:
      "Delicate Lucknowi chikankari embroidery on soft ivory — an heirloom-worthy everyday piece.",
    details: [
      "Hand-embroidered chikankari",
      "Soft cotton-blend fabric",
      "Round neck with button placket",
    ],
    fabric: "Cotton Blend",
    color: "Ivory",
    sizes: ["S", "M", "L", "XL"],
    images: ["/samples/ivory-kurta.svg"],
    inStock: true,
    featured: true,
  },
  {
    _id: "sample-3",
    title: "Rosewood Silk Saree",
    slug: "rosewood-silk-saree",
    category: "saree",
    price: 4999,
    compareAtPrice: 6499,
    description:
      "A lustrous rosewood silk saree with a woven zari border — made for celebrations.",
    details: [
      "Art silk with zari border",
      "Includes unstitched blouse piece",
      "Length: 5.5m + 0.8m blouse",
    ],
    fabric: "Art Silk",
    color: "Rosewood",
    sizes: ["Free Size"],
    images: ["/samples/rosewood-saree.svg"],
    inStock: true,
    featured: true,
  },
  {
    _id: "sample-4",
    title: "Indigo Handloom Saree",
    slug: "indigo-handloom-saree",
    category: "saree",
    price: 3799,
    description:
      "Earthy indigo handloom cotton with a contrast pallu — light, breathable, and effortless.",
    details: [
      "Handloom cotton",
      "Natural indigo dye",
      "Includes matching blouse piece",
    ],
    fabric: "Handloom Cotton",
    color: "Indigo",
    sizes: ["Free Size"],
    images: ["/samples/indigo-saree.svg"],
    inStock: true,
    featured: false,
  },
  {
    _id: "sample-5",
    title: "Sage Green Anarkali Kurta",
    slug: "sage-green-anarkali-kurta",
    category: "kurta",
    price: 2799,
    description:
      "A flowing sage-green anarkali with subtle thread work — graceful movement in every step.",
    details: [
      "Georgette with inner lining",
      "Floor-length flared silhouette",
      "Concealed side zip",
    ],
    fabric: "Georgette",
    color: "Sage Green",
    sizes: ["S", "M", "L", "XL"],
    images: ["/samples/sage-anarkali.svg"],
    inStock: true,
    featured: false,
  },
  {
    _id: "sample-6",
    title: "Coral Bandhani Saree",
    slug: "coral-bandhani-saree",
    category: "saree",
    price: 3299,
    description:
      "Traditional coral bandhani tie-dye on soft chiffon — bright, festive, and feather-light.",
    details: [
      "Chiffon with bandhani print",
      "Includes blouse piece",
      "Dry clean recommended",
    ],
    fabric: "Chiffon",
    color: "Coral",
    sizes: ["Free Size"],
    images: ["/samples/coral-saree.svg"],
    inStock: false,
    featured: false,
  },
];
