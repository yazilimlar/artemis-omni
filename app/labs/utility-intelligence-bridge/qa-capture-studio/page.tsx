import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "DEP Sewer Bridge \u2014 QA Capture Studio",
  path: "/labs/utility-intelligence-bridge/qa-capture-studio",
  description:
    "RC7 publication QA and capture studio for the DEP Sewer Utility Intelligence Bridge: Leaflet GIS cockpit with a printable screenshot deck. Published as an Artemis Labs module.",
});

export default function QaCaptureStudioPage() {
  return (
    <iframe
      sandbox={labSandbox("dep-bridge-rc7-qa")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="DEP Sewer Utility Intelligence Bridge \u2014 RC7 QA Capture Studio"
      src="/standalone/utility-intelligence-bridge/qa-capture-studio.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#101713]"
      allow="fullscreen; clipboard-write; geolocation"
      allowFullScreen
    />
  );
}
