import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "ArtLoop \u00b7 The Estimation Pipeline",
  path: "/labs/artloop",
  description:
    "ArtLoop is the single-project estimation pipeline of ARTEMIS Construction Intelligence: intake, takeoff, priced basis, figure governance, and proposal in one governed loop. In private operation; access by invitation. This public page publishes no project data.",
  noIndex: true,
});

export default function ArtLoopPage() {
  return (
    <iframe
      sandbox={labSandbox("artloop")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="ArtLoop \u00b7 The Estimation Pipeline"
      src="/standalone/artloop.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#f7f5ef]"
      allow="fullscreen"
      allowFullScreen
    />
  );
}
