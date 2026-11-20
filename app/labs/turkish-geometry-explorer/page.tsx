import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Girih — Turkish Geometry Explorer",
  path: "/labs/turkish-geometry-explorer",
  description:
    "An interactive explorer of Seljuk and Ottoman girih star patterns drawn line by line with Hankin's polygons-in-contact method: 10 tilings including Penrose and a radial rosette, construction mode, synthesized Web Audio deep-house and zen bells, and PNG and video export. Published as an Artemis Labs module.",
});

export default function TurkishGeometryExplorerPage() {
  return (
    <iframe
      sandbox={labSandbox("turkish-geometry-explorer")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Girih — Turkish Geometry Explorer"
      src="/standalone/turkish-geometry-explorer.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#14161b]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
