import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "HVAC Planning Studio · 2D / 3D",
  path: "/labs/hvac-intel-v01-georgeg",
  description: "Illustrative HVAC tower and AHU-to-zone sample, with integrated 2D and 3D views, quantities, planning estimates, and JSON export. Not certified engineering design.",
});
export default function HvacPlanningStudioPage() {
  return <iframe sandbox={labSandbox("hvac-intel-v01-georgeg")} referrerPolicy="no-referrer" loading="lazy"
    title="HVAC Planning Studio — illustrative 2D and 3D systems"
    src="/standalone/hvac-intel-v01-georgeg/index.html"
    style={{ position: "fixed", inset: 0, zIndex: 60, height: "100dvh", width: "100vw", border: 0, background: "#e8edf0" }}
    allow="fullscreen" allowFullScreen />;
}
