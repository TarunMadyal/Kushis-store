import { client } from "./sanity/client";
import { urlForImage } from "./sanity/image";
import { sanityConfigured } from "./sanity/env";
import { sampleProducts } from "./sampleProducts";
import type { Category, Product } from "./types";

// Single source of truth for reading products. It pulls from Sanity when the
// CMS is configured, and otherwise returns the built-in sample catalogue so
// the storefront always has something to show.

const PRODUCT_QUERY = `*[_type == "product"] | order(_createdAt desc){
  "_id": _id,
  title,
  "slug": slug.current,
  category,
  price,
  compareAtPrice,
  description,
  details,
  fabric,
  color,
  sizes,
  "images": images[]{...},
  inStock,
  featured
}`;

type SanityProduct = Omit<Product, "images"> & { images?: unknown[] };

function mapSanityProduct(p: SanityProduct): Product {
  return {
    ...p,
    images: (p.images || [])
      .map((img) => urlForImage(img as never))
      .filter(Boolean),
  };
}

// Simple in-request cache to avoid refetching within a single render pass.
export async function getAllProducts(): Promise<Product[]> {
  if (sanityConfigured && client) {
    try {
      const data = (await client.fetch(PRODUCT_QUERY, {}, {
        next: { revalidate: 60 },
      })) as SanityProduct[];
      if (data && data.length > 0) return data.map(mapSanityProduct);
    } catch (err) {
      console.error("Sanity fetch failed, falling back to samples:", err);
    }
  }
  return sampleProducts;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProductsByCategory(
  category?: Category
): Promise<Product[]> {
  const all = await getAllProducts();
  if (!category) return all;
  return all.filter((p) => p.category === category);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, limit);
}
