import { supabaseDataFetch } from "@/lib/supabase";

export type AdminProductRecord = {
  id: string;
  title: string;
  slug: string;
  category: "kurta" | "saree" | "other";
  price: number;
  compare_at_price: number | null;
  description: string;
  details: string[];
  fabric: string | null;
  color: string | null;
  sizes: string[];
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
};

const select =
  "id,title,slug,category,price,compare_at_price,description,details,fabric,color,sizes,images,in_stock,featured,created_at,updated_at";

function normalize(row: AdminProductRecord): AdminProductRecord {
  return {
    ...row,
    price: Number(row.price),
    compare_at_price:
      row.compare_at_price == null ? null : Number(row.compare_at_price),
    details: row.details || [],
    sizes: row.sizes || [],
    images: row.images || [],
    featured: Boolean(row.featured),
    in_stock: Boolean(row.in_stock),
  };
}

export async function fetchAdminProducts(accessToken: string) {
  const response = await supabaseDataFetch(
    `/products?select=${select}&order=updated_at.desc,created_at.desc`,
    {},
    accessToken,
  );
  const data = await response.json().catch(() => []);
  if (!response.ok || !Array.isArray(data)) {
    throw new Error("Unable to load products.");
  }
  return (data as AdminProductRecord[]).map(normalize);
}

export async function fetchAdminProduct(id: string, accessToken: string) {
  const response = await supabaseDataFetch(
    `/products?select=${select}&id=eq.${encodeURIComponent(id)}&limit=1`,
    {},
    accessToken,
  );
  const data = await response.json().catch(() => []);
  if (!response.ok || !Array.isArray(data) || !data[0]) return null;
  return normalize(data[0] as AdminProductRecord);
}
