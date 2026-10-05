import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Time Atlas — Troy · Ilion, 600 BC (v2.1 · Dev & Test)",
  path: "/labs/developmentandtest/troy-time-atlas",
  noIndex: true,
  description:
    "Development preview of the Artemis Time Atlas: a runtime KML-driven vertical 3D diorama of Archaic Ilion (Troy, c. 600 BC) with story mode, scholar controls, animated scene life, and evidence-graded points of interest.",
});

export default function TroyTimeAtlasDevPage() {
  return (
    <iframe
      sandbox={labSandbox("troy-time-atlas-600bc")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis Time Atlas — Troy · Ilion, 600 BC (v2.1)"
      src="/standalone/troy-time-atlas-600bc.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#241a2e]"
      allow="fullscreen; clipboard-write; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
