// Sanity project id for Khushi's Store. This is a public identifier (not a
// secret), so it's safe to keep here as the default. An env var still overrides
// it if one is ever set in the hosting settings.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "t01chzdf";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// The storefront uses Sanity only when a project id has been provided.
// Until then it renders built-in sample products so the site is never empty.
export const sanityConfigured = projectId.length > 0;
