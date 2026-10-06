import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "HVAC Mechanical Intelligence Bridge",
  path: "/labs/hvac-mechanical-intelligence-bridge",
  description:
    "Standalone parametric commercial-HVAC estimating and project-controls cockpit: ASHRAE/SMACNA/IMC standards lens, 3D building model, 15-activity estimate, schedule, EVM, cashflow, risk, field-claims story, and executive control room. Published as an Artemis Labs module.",
});

export default function HvacMechanicalIntelligenceBridgePage() {
  return (
    <iframe
      sandbox={labSandbox("hvac-mechanical-intelligence-bridge")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis HVAC Mechanical Intelligence Bridge — RC8.4"
      src="/standalone/hvac-mechanical-intelligence-bridge.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0b1622]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
