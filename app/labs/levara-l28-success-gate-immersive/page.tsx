import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "LEVARA L28 Success Gate Immersive",
  path: "/labs/levara-l28-success-gate-immersive",
  description:
    "Immersive LEVARA L28 v10 Success Gate experience with six deploy-anywhere environments, interactive 3D views, responsive five-year economics, bottleneck analysis, and the Marlboro Rainbow theme system.",
});

export default function LevaraL28SuccessGateImmersivePage() {
  return (
    <iframe
      title="LEVARA L28 Success Gate Immersive"
      src="/standalone/levara-l28-success-gate-immersive/index.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#fffaf4]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
