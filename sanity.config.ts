"use client";

// Configuration for the embedded Sanity Studio (the admin dashboard),
// available at /studio once NEXT_PUBLIC_SANITY_PROJECT_ID is set.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./src/sanity/schemaTypes";
import {
  apiVersion,
  dataset,
  projectId,
} from "./src/lib/sanity/env";

export default defineConfig({
  name: "kushis-store",
  title: "Kushi's Store — Admin",
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
