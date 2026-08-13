import { sampleProducts } from "./sampleProducts";
import { isSupabaseConfigured, supabaseDataFetch } from "./supabase";
import type { Category, Product } from "./types";

type SupabaseProduct = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  price: number | string;
  compare_at_price?: number | string | null;
  description: string;
  details?: string[] | null;
  fabric?: string | null;
  color?: string | null;
  sizes?: string[] | null;
  images?: string[] | null;
  in_stock: boolean;
  featured?: boolean | null;
};

function mapProduct(row: SupabaseProduct): Product {
  return {
    _id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price == null ? undefined : Number(row.compare_at_price),
    description: row.description,
    details: row.details || undefined,
    fabric: row.fabric || undefined,
    color: row.color || undefined,
    sizes: row.sizes || undefined,
    images: row.images || [],
    inStock: row.in_stock,
    featured: Boolean(row.featured),
  };
}

// Supabase is now the primary product catalogue. The built-in catalogue remains
// as a safe preview fallback if Supabase is not configured or temporarily down.
export async function getAllProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const response = await supabaseDataFetch(
        "/products?select=id,title,slug,category,price,compare_at_price,description,details,fabric,color,sizes,images,in_stock,featured&order=created_at.desc",
      );
      const rows = (await response.json().catch(() => [])) as SupabaseProduct[];
      if (response.ok && Array.isArray(rows) && rows.length > 0) {
        return rows.map(mapProduct);
      }
      if (!response.ok) console.error("Supabase product fetch failed", rows);
    } catch (error) {
      console.error("Supabase product fetch failed, using samples:", error);
    }
  }

  return sampleProducts;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((product) => product.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProductsByCategory(
  category?: Category,
): Promise<Product[]> {
  const all = await getAllProducts();
  if (!category) return all;
  return all.filter((product) => product.category === category);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((product) => product.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getAllProducts();
  return all
    .filter(
      (candidate) =>
        candidate.slug !== product.slug && candidate.category === product.category,
    )
    .slice(0, limit);
}
