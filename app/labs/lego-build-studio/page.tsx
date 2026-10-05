import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "LEGO Build Studio",
  path: "/labs/lego-build-studio",
  description:
    "Standalone interactive LEGO build studio: 9 monuments animated brick-by-brick in Three.js across 10 palettes, with timeline scrubbing, a live BOM view, and day/night orbit presentation. Published as an Artemis Labs module.",
});

export default function LegoBuildStudioPage() {
  return (
    <iframe
      sandbox={labSandbox("lego-build-studio")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="LEGO Build Studio — 9 Monuments · 10 Palettes"
      src="/standalone/lego-build-studio.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101513]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
