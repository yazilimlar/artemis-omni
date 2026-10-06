import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Sewer Utility Intelligence Bridge",
  path: "/labs/sewer-utility-intelligence-bridge",
  description:
    "Standalone parametric sewer-utility estimating and project-controls cockpit: DEP standards lens, 3D trench/pipe/manhole model with GIS corridor context, 15-activity estimate, schedule, EVM, cashflow, risk, field-claims story, and executive control room. Published as an Artemis Labs module.",
});

export default function SewerUtilityIntelligenceBridgePage() {
  return (
    <iframe
      sandbox={labSandbox("sewer-utility-intelligence-bridge")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis DEP Sewer Utility Intelligence Bridge — RC8.4"
      src="/standalone/sewer-utility-intelligence-bridge.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0b1622]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
