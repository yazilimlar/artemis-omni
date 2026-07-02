import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "George Aegean Quest",
  path: "/labs/george-aegean-quest",
  description:
    "iPhone-first Artemis Atlas game starring George with a geography-aware Aegean board, reorderable route stops, shortest/fastest sorting, undo, character switching, and a Troy Time Atlas KML layer.",
});

export default function GeorgeAegeanQuestPage() {
  return (
    <iframe
      title="George Aegean Quest - Artemis Atlas iPhone Game"
      src="/standalone/george-aegean-quest.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#071016]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
