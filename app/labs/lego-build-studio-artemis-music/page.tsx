import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "LEGO Build Studio \u00b7 Artemis Music Edition",
  path: "/labs/lego-build-studio-artemis-music",
  description:
    "The Artemis music edition of the LEGO build studio: 10 world monuments animated brick-by-brick in Three.js with a 9-mode generative Web Audio music engine, a Fourier-epicycles ARTEMIS inscription linking to artemis.agoraxai.com, and a clean-view presentation mode. Published as an Artemis Labs module.",
});

export default function LegoBuildStudioArtemisMusicPage() {
  return (
    <iframe
      sandbox={labSandbox("lego-build-studio-artemis-music")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="LEGO Build Studio · ARTEMIS · v5.0"
      src="/standalone/lego-build-studio-artemis-music.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101513]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
