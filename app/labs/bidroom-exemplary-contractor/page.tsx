import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";
import BidRoomExemplaryClient from "./BidRoomExemplaryClient";

export const metadata = createMetadata({
  title: "BidRoom for Exemplary Contractor — Artemis Omni",
  path: "/labs/bidroom-exemplary-contractor",
  description:
    "A specialty-contractor pursuit cockpit for core drilling, concrete demolition, waterproofing, jet grouting, and foundation pile installation opportunities.",
});

export default function BidRoomExemplaryContractorPage() {
  return (
    <main className="min-h-screen bg-[#e9eae5] text-[#15202e]">
      <header className="border-b-2 border-[#15202e] bg-white">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center gap-3 px-5 py-3">
          <Link
            href="/labs/civicbid-signal-forge"
            className="inline-flex items-center gap-2 rounded-sm border border-[#15202e] px-3 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-wide transition-colors hover:bg-[#15202e] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            CivicBid
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#596472]">
              Artemis · Specialty Contractor Pursuit Cockpit
            </p>
            <p className="mt-1 text-sm font-semibold">BidRoom for Exemplary Contractor</p>
          </div>
          <a
            href="https://a856-cityrecord.nyc.gov/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-[#1d5fbf] px-3 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-wide text-[#1d5fbf] transition-colors hover:bg-[#1d5fbf] hover:text-white"
          >
            Official City Record
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </header>

      <BidRoomExemplaryClient />

      <aside className="border-t-2 border-[#15202e] bg-white">
        <div className="mx-auto flex max-w-[1380px] items-start gap-3 px-5 py-4 text-xs leading-relaxed text-[#596472]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a4d]" aria-hidden />
          <p>
            Public-safe decision support only. Official notices, addenda, plans, specifications,
            prequalification requirements, insurance, bonding, prevailing-wage obligations, and the
            designated submission portal remain controlling. Opportunity examples shown here are
            representative pursuit records until governed live-source adapters are enabled.
          </p>
        </div>
      </aside>
    </main>
  );
}
