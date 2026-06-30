import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "1040 Finance Architecture",
  path: "/labs/tax-architecture-2026",
  description:
    "Standalone 3D tax parametric model published as an Artemis Labs prototype.",
});

export default function TaxArchitecture2026Page() {
  return (
    <iframe
      title="1040 Finance Architecture - True 3D Tax Parametric Model 2026"
      src="/standalone/tax-architecture-2026.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#050813]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
