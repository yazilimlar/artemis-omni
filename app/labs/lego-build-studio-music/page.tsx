import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "LEGO Build Studio \u00b7 Music Edition",
  path: "/labs/lego-build-studio-music",
  description:
    "Standalone interactive LEGO build studio with a generative Web Audio music engine: 9 monuments animated brick-by-brick in Three.js across 10 palettes, with timeline scrubbing and a live BOM view. Published as an Artemis Labs module.",
});

export default function LegoBuildStudioMusicPage() {
  return (
    <iframe
      sandbox={labSandbox("lego-build-studio-music")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="LEGO Build Studio · by Grok · v5.0 Best"
      src="/standalone/lego-build-studio-music.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101513]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
