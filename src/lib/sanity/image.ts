import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId, sanityConfigured } from "./env";

const builder = sanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: SanityImageSource): string {
  if (!builder) return "";
  return builder.image(source).auto("format").fit("max").width(1000).url();
}
