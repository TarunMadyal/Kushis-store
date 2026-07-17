import type { Metadata, Viewport } from "next";
import { sanityConfigured } from "@/lib/sanity/env";
import StudioClient from "./StudioClient";
import StudioSetup from "./StudioSetup";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Khushi's Store — Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!sanityConfigured) return <StudioSetup />;
  return <StudioClient />;
}
