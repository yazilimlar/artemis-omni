import type { Metadata } from "next";

// noindex until client-work status is resolved (ADR-008; registry: noindex_review).
// The page is a client component, so route metadata lives in this layout.
export const metadata: Metadata = {
  title: "Pınar Evleri — Artemis Omni",
  robots: { index: false, follow: false },
};

export default function PinarEvleriLayout({ children }: { children: React.ReactNode }) {
  return children;
}
