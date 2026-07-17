export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// The storefront uses Sanity only when a project id has been provided.
// Until then it renders built-in sample products so the site is never empty.
export const sanityConfigured = projectId.length > 0;
