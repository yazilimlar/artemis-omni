import { createMetadata } from "@/lib/seo/metadata";
import { labSandbox } from "@/lib/standalone-labs";

export const metadata = createMetadata({
  title: "AttemptBook \u00b7 AI Operations Intelligence",
  path: "/labs/ai-operations-intelligence",
  description:
    "AttemptBook, the AI unit-economics ledger specification by ARTEMIS (Great Order LLC): every billed AI attempt accounted, provenance-classified, and reconciled. Coming soon \u2014 the standard is adopted and the R0.1 modules are in design and testing. This public page carries no operating data.",
  noIndex: true,
});

export default function AiOperationsIntelligencePage() {
  return (
    <>
    <iframe
      sandbox={labSandbox("ai-operations-intelligence")}
      referrerPolicy="no-referrer"
      loading="lazy"
      title="AttemptBook \u2014 AI Unit-Economics Ledger \u00b7 Coming Soon"
      src="/standalone/ai-operations-intelligence.html"
      className="fixed inset-0 z-[60] h-dvh w-screen border-0 bg-[#0B1F3B]"
      allow="fullscreen"
      allowFullScreen
    />
    <a href="/standalone/attemptbook-how-it-works.html" className="fixed bottom-5 right-5 z-[70] rounded-full border border-[#D4A017] bg-[#0B1F3B] px-5 py-3 text-sm font-semibold text-[#F5F1E6] shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A017]">Explore how it works ↗</a>
    </>
  );
}
