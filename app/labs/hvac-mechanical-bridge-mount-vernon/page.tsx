import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "HVAC Mechanical Bridge · Mount Vernon Retrofit",
  path: "/labs/hvac-mechanical-bridge-mount-vernon",
  description:
    "Standalone parametric HVAC cockpit on the RC8.4 engine, built as a 60,000 SF occupied office retrofit in Mount Vernon, NY: ductwork by weight, hydronic and refrigerant piping, equipment quantities, TAB and commissioning, schedule, EVM, cashflow, and risk. Published as an Artemis Labs module.",
});

export default function HvacMechanicalBridgeMountVernonPage() {
  return (
    <iframe
      sandbox={labSandbox("hvac-mechanical-bridge-mount-vernon")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Artemis HVAC Mechanical Intelligence Bridge — Mount Vernon Retrofit"
      src="/standalone/hvac-mechanical-bridge-mount-vernon.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#eef3f9]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
