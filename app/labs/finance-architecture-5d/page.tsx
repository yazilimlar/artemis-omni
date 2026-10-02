import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "5D Finance Architecture — Tax Lab (Preview)",
  path: "/labs/finance-architecture-5d",
  description:
    "Preview variant of the Finance Architecture: color-grouped control slicers matched to their 3D shapes, stepped-pyramid tax brackets, and an orbiting payment satellite — building toward a 4D timeline and 5D scenario comparison.",
});

export default function FinanceArchitecture5DPage() {
  return (
    <iframe
      sandbox={labSandbox("finance-architecture-5d")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="5D Finance Architecture — Tax Lab"
      src="/standalone/finance-architecture-5d.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#050813]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
