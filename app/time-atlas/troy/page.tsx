import type { Metadata } from "next";
import { TroyAtlasClient } from "@/components/time-atlas/TroyAtlasClient";

export const metadata: Metadata = {
  title: "Time Atlas — Troy · Ilion, 600 BC",
  description:
    "A cinematic, scroll-driven 3D diorama of Troy / Ilion around 600 BC — citadel, lower town, Scamander plain, harbor and strait — with evidence-graded points of interest and thematic overlays.",
};

export default function TroyTimeAtlasPage() {
  return <TroyAtlasClient />;
}
