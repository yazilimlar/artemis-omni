import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";

// page.tsx is a client component and cannot export metadata, so noindex lives here.
// DayOS is noindex_review in the product registry.
export const metadata: Metadata = createMetadata({
  title: "DayOS v0.9.8c — Scenario Overlay & Smart Controls",
  path: "/dayos-v098c",
  description: "Internal noindex review of the DayOS v0.9.8c scenario overlay and smart controls lens (synthetic fixtures).",
  noIndex: true,
});

export default function DayOSV098cLayout({ children }: { children: React.ReactNode }) {
  return children;
}
