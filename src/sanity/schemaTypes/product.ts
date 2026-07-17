import { defineField, defineType } from "sanity";

// This defines the "Add Product" form your friend sees in the /studio
// dashboard: every field below becomes an input she fills in.
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Product name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (auto)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
      description: "Click 'Generate' to create this from the product name.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Kurta", value: "kurta" },
          { title: "Saree", value: "saree" },
          { title: "Other", value: "other" },
        ],
        layout: "radio",
      },
      initialValue: "kurta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      validation: (r) => r.min(1).error("Add at least one photo."),
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Original price (₹, optional)",
      type: "number",
      description: "Shows a struck-through 'was' price to indicate a discount.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "details",
      title: "Details (bullet points)",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. fabric care, fit notes, dimensions.",
    }),
    defineField({ name: "fabric", title: "Fabric", type: "string" }),
    defineField({ name: "color", title: "Colour", type: "string" }),
    defineField({
      name: "sizes",
      title: "Available sizes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "inStock",
      title: "In stock?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage?",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "images.0" },
  },
});
