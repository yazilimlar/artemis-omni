import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "ArtLoop Agents Office · The Estimation Pipeline",
  path: "/labs/artloop-agents-office",
  description:
    "Inside ArtLoop: eight senior seats work one project from intake to proposal around the ArtLoop core, orchestrated by ARTEMIS Construction Intelligence with ArtLeveler, ArtPlex and OctopusG. A public tour of a system in private operation; this page publishes no project data.",
});

export default function ArtLoopAgentsOfficePage() {
  return (
    <iframe
      sandbox={labSandbox("artloop-agents-office")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="ArtLoop Agents Office · The Estimation Pipeline"
      src="/standalone/artloop-agents-office.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0b1315]"
      allow="fullscreen"
      allowFullScreen
    />
  );
}
