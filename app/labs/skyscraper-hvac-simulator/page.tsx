import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Skyscraper HVAC Simulator \u00b7 3D / 4D",
  path: "/labs/skyscraper-hvac-simulator",
  description:
    "A live engineering model of a generic 48-story tower: weather and occupancy drive psychrometrics, coil and chiller loads, pipe friction, pump heads and cooling-tower performance \u2014 across a 2D cutaway, an interactive 3D model, an illustrative 4D logistics layer, and full drawing-to-model traceability. Published as an Artemis Labs module.",
});

export default function SkyscraperHvacSimulatorPage() {
  return (
    <iframe
      sandbox={labSandbox("skyscraper-hvac-simulator")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis Skyscraper HVAC Simulator \u2014 3D / 4D"
      src="/standalone/skyscraper-hvac-simulator.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#e8edf0]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
