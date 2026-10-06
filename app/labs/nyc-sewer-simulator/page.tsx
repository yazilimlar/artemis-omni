import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "NYC Sewer Construction Intelligence Simulator",
  path: "/labs/nyc-sewer-simulator",
  description:
    "Standalone interactive v0.19 simulator for NYC sewer construction intelligence: 3D viewer, what-if controls, and printable reports. Published as an Artemis Labs module.",
});

export default function NycSewerSimulatorPage() {
  return (
    <iframe
      sandbox={labSandbox("nyc-sewer-simulator")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="NYC Sewer Construction Intelligence Simulator v0.19"
      src="/standalone/nyc-sewer-simulator-v0-19.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101713]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
