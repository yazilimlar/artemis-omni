import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "LEVARA L28 Financial Twin",
  path: "/labs/levara-l28-financial-twin",
  description:
    "Interactive LEVARA L28 deploy-anywhere product experience with a reconciled five-year financial model, success gates, bottleneck analysis, and Marlboro Rainbow theme.",
});

export default function LevaraL28FinancialTwinPage() {
  return (
    <iframe
      // Exempt from sandboxing: see data/standalone-labs.json (levara-l28-financial-twin).
      referrerPolicy="no-referrer"
      loading="lazy"
      title="LEVARA L28 Financial Twin"
      src="/standalone/levara-l28-financial-twin/runtime.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#fffaf4]"
      allow="fullscreen; clipboard-write"
      allowFullScreen
    />
  );
}
