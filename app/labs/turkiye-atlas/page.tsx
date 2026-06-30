import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "ARTEMIS Turkiye Atlas",
  path: "/labs/turkiye-atlas",
  description:
    "Standalone interactive Turkiye Atlas prototype published as an Artemis Labs module.",
});

export default function TurkiyeAtlasPage() {
  return (
    <iframe
      title="ARTEMIS Turkiye Atlas"
      src="/standalone/turkiye-atlas.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101713]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
