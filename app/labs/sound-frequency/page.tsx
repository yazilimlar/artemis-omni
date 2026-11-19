import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Frequency Sound Animation App",
  path: "/labs/sound-frequency",
  description:
    "A frequency sound animation playground: 8 modes — Zen, Futuristic, Scientific, Experimental, Instrumental, Gothic, Professional and Friendly — each with its own animated visualisation and generative Web Audio sound character, across an 8-colour palette. Published as an Artemis Labs module.",
});

export default function SoundFrequencyPage() {
  return (
    <iframe
      sandbox={labSandbox("sound-frequency")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Frequency Sound Animation App"
      src="/standalone/sound-frequency.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0b0b10]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
