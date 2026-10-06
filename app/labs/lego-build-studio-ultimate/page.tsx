import { createMetadata } from "@/lib/seo/metadata";
import StudioLanding from "./StudioLanding";

export const metadata = createMetadata({
  title: "LEGO Build Studio · Ultimate Edition",
  path: "/labs/lego-build-studio-ultimate",
  description:
    "The ultimate edition of the LEGO build studio: 10 world monuments animated brick-by-brick in Three.js — a Fourier-series crane fleet, 9 generative Web Audio music modes, 10 color modes, a live bill of materials, and a Fourier-drawn ARTEMIS inscription. An Artemis Labs interactive demo.",
});

export default function LegoBuildStudioUltimatePage() {
  return <StudioLanding />;
}
