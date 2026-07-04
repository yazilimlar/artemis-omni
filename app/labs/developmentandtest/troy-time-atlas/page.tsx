import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Time Atlas — Troy · Ilion, 600 BC (v2 · Dev & Test)",
  path: "/labs/developmentandtest/troy-time-atlas",
  description:
    "Development preview of the Artemis Time Atlas: a scroll-driven vertical 3D diorama of Archaic Ilion (Troy, c. 600 BC) with KML-georeferenced geography — citadel walls, lower town, the Scamander, Sigeion and Rhoeteion harbours — and evidence-graded points of interest.",
});

export default function TroyTimeAtlasDevPage() {
  return (
    <iframe
      title="Artemis Time Atlas — Troy · Ilion, 600 BC (v2)"
      src="/standalone/troy-time-atlas-600bc.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#241a2e]"
      allow="fullscreen; clipboard-write; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
