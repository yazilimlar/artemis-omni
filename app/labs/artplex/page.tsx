import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "ArtPlex \u00b7 Estimation Platform",
  path: "/labs/artplex",
  description:
    "ArtPlex is the ARTEMIS Construction Intelligence estimation platform for bid pursuits, portfolio oversight, evidence-based estimating coordination, review gates, and proposals. In private operation; access by invitation. This public page publishes no project data.",
  noIndex: true,
});

export default function ArtPlexPage() {
  return (
    <iframe
      sandbox={labSandbox("artplex")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="ArtPlex \u00b7 Estimation Platform"
      src="/standalone/artplex.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0B1F3B]"
      allow="fullscreen"
      allowFullScreen
    />
  );
}
