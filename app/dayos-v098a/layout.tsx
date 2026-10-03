import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

// page.tsx is a client component and cannot export metadata, so noindex lives here.
// DayOS is noindex_review in the product registry.
export const metadata: Metadata = createMetadata({
  title: "DayOS v0.9.8a — Spatial Intelligence",
  path: "/dayos-v098a",
  description: "Internal noindex review of the DayOS v0.9.8a spatial intelligence lens (synthetic fixtures).",
  noIndex: true,
});

export default function DayOSV098aLayout({ children }: { children: React.ReactNode }) {
  return children;
}
