import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Read straight from the API (not the CDN) so newly published products
      // show up without waiting for CDN propagation.
      useCdn: false,
    })
  : null;
