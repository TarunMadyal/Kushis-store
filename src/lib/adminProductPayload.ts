type ProductInput = Record<string, unknown>;

type Result =
  | { data: Record<string, unknown>; error: null }
  | { data: null; error: string };

const categories = new Set(["kurta", "saree", "other"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function strings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseProductPayload(input: unknown, partial = false): Result {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { data: null, error: "Invalid product data." };
  }

  const body = input as ProductInput;
  const out: Record<string, unknown> = {};
  const has = (key: string) => Object.prototype.hasOwnProperty.call(body, key);
  const required = (key: string) => !partial || has(key);

  if (required("title")) {
    const value = text(body.title);
    if (value.length < 2 || value.length > 120)
      return { data: null, error: "Product name must be 2–120 characters." };
    out.title = value;
  }

  if (required("slug")) {
    const value = text(body.slug).toLowerCase();
    if (!slugPattern.test(value) || value.length > 96)
      return { data: null, error: "Please use a valid product web address." };
    out.slug = value;
  }

  if (required("category")) {
    const value = text(body.category);
    if (!categories.has(value)) return { data: null, error: "Choose a valid category." };
    out.category = value;
  }

  if (required("price")) {
    const value = Number(body.price);
    if (!Number.isFinite(value) || value < 0)
      return { data: null, error: "Enter a valid selling price." };
    out.price = value;
  }

  if (has("compareAtPrice")) {
    const raw = body.compareAtPrice;
    if (raw === null || raw === "" || raw === undefined) {
      out.compare_at_price = null;
    } else {
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0)
        return { data: null, error: "Enter a valid original price." };
      out.compare_at_price = value;
    }
  } else if (!partial) {
    out.compare_at_price = null;
  }

  if (required("description")) {
    const value = text(body.description);
    if (value.length < 5 || value.length > 2000)
      return { data: null, error: "Add a short product description." };
    out.description = value;
  }

  if (has("details") || !partial) out.details = strings(body.details);
  if (has("sizes") || !partial) out.sizes = strings(body.sizes);

  if (has("images") || !partial) {
    const value = strings(body.images);
    if (!value.length) return { data: null, error: "Add at least one product photo." };
    if (value.length > 12) return { data: null, error: "Use at most 12 product photos." };
    out.images = value;
  }

  if (has("fabric") || !partial) out.fabric = text(body.fabric) || null;
  if (has("color") || !partial) out.color = text(body.color) || null;

  if (has("inStock") || !partial) out.in_stock = Boolean(body.inStock);
  if (has("featured") || !partial) out.featured = Boolean(body.featured);

  return { data: out, error: null };
}
