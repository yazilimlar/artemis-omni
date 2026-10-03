import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

// page.tsx is a client component and cannot export metadata, so noindex lives here.
// DayOS is noindex_review in the product registry.
export const metadata: Metadata = createMetadata({
  title: "DayOS v0.9.8b — Telemetry & Critical Timing",
  path: "/dayos-v098b",
  description: "Internal noindex review of the DayOS v0.9.8b telemetry and critical timing lens (synthetic fixtures, live weather).",
  noIndex: true,
});

export default function DayOSV098bLayout({ children }: { children: React.ReactNode }) {
  return children;
}
