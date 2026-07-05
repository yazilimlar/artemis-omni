import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Time Atlas — Troy · Ilion, 600 BC",
  path: "/labs/troy-time-atlas",
  description:
    "Public Artemis Time Atlas lab: a KML-driven, scroll-guided 3D diorama of Archaic Ilion with evidence-graded POIs, story mode, scholar controls, animated scene life, and downloadable Google Earth source data.",
});

export default function TroyTimeAtlasPage() {
  return (
    <iframe
      title="Artemis Time Atlas — Troy · Ilion, 600 BC"
      src="/standalone/troy-time-atlas-600bc.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#241a2e]"
      allow="fullscreen; clipboard-write; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
