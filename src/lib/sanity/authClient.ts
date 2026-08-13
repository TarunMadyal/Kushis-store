import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export type CustomerAuthDocument = {
  _id: string;
  _type: "customerAuth";
  payload: string;
  createdAt: string;
};

export function getAuthSanityClient() {
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    throw new Error(
      "SANITY_API_TOKEN must be configured with write access before authentication can be used.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
