export type Category = "kurta" | "saree" | "other";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: Category;
  price: number;
  // Optional "was" price to show a strike-through discount.
  compareAtPrice?: number;
  description: string;
  // Longer rich details shown on the product page.
  details?: string[];
  fabric?: string;
  color?: string;
  sizes?: string[];
  images: string[];
  inStock: boolean;
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  kurta: "Kurtas",
  saree: "Sarees",
  other: "More",
};
