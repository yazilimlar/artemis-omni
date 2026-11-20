import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "Girih 3D — Turkish Geometry Explorer",
  path: "/labs/turkish-geometry-explorer-3d",
  description:
    "The 3D upgrade of the Turkish Geometry Explorer: Seljuk and Ottoman girih star patterns built with Hankin's polygons-in-contact method, extruded into raised carved tiles with glowing star inlay under an orbiting perspective camera, with the same synthesized Web Audio deep-house and zen bells, and PNG and video export. Published as an Artemis Labs module.",
});

export default function TurkishGeometryExplorer3DPage() {
  return (
    <iframe
      sandbox={labSandbox("turkish-geometry-explorer-3d")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="Girih 3D — Turkish Geometry Explorer"
      src="/standalone/turkish-geometry-explorer-3d.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#14161b]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
