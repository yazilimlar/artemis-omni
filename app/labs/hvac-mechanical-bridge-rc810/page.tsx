import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "HVAC Mechanical Intelligence Bridge",
  path: "/labs/hvac-mechanical-bridge-rc810",
  description:
    "Standalone parametric commercial-HVAC estimating and project-controls cockpit: Cost Heat Map treemap, 15-activity estimate, NYC union labor engine, schedule delay register, EVM, cashflow, Monte Carlo risk, generative sound studio, and executive control room. Published as an Artemis Labs module.",
});

export default function HvacMechanicalBridgeRc810Page() {
  return (
    <iframe
      sandbox={labSandbox("hvac-mechanical-bridge-rc810")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis HVAC Mechanical Intelligence Bridge — RC8.10"
      src="/standalone/hvac-mechanical-bridge-rc810.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0b1622]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
