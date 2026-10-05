import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "LEGO Build Studio \u00b7 Artemis Edition",
  path: "/labs/lego-build-studio-artemis",
  description:
    "The Artemis edition of the LEGO build studio: 9 monuments animated brick-by-brick in Three.js with a generative Web Audio music engine, a Fourier-epicycles ARTEMIS inscription linking to artemis.agoraxai.com, a clean-view mode, and a translucent studio UI. Published as an Artemis Labs module.",
});

export default function LegoBuildStudioArtemisPage() {
  return (
    <iframe
      sandbox={labSandbox("lego-build-studio-artemis")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="LEGO Build Studio · Artemis Edition · v5.0"
      src="/standalone/lego-build-studio-artemis.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101513]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
