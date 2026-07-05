import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Atlas Handcrafted Guru Selection v00",
  path: "/labs/artemis-atlas-handcrafted-guru-selection-v00",
  description:
    "A mutant Artemis Atlas lab with curated handcrafted map plates, a game-like route engine, guide switching, route sorting, undo, and a repeatable asset pipeline.",
});

export default function ArtemisAtlasHandcraftedGuruSelectionV00Page() {
  return (
    <iframe
      title="Artemis Atlas Handcrafted Guru Selection v00"
      src="/standalone/artemis-atlas-handcrafted-guru-selection-v00.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#070c0f]"
      allow="fullscreen; clipboard-write; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
