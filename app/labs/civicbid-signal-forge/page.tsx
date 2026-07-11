import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "The Bid Room v2.1",
  path: "/labs/civicbid-signal-forge",
  description:
    "A no-index review route for the Artemis CivicBid Bid Room v2.1 contractor workflow interface.",
  noIndex: true,
});

export default function CivicBidSignalForgePage() {
  return (
    <main className="min-h-screen bg-[#e9eae5] text-[#15202e]">
      <header className="border-b-2 border-[#15202e] bg-white">
        <div className="mx-auto flex max-w-[1260px] flex-wrap items-center gap-3 px-5 py-3">
          <a
            href="/labs/civicbid-intelligence-bridge"
            className="inline-flex items-center gap-2 rounded-sm border border-[#15202e] px-3 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-wide transition-colors hover:bg-[#15202e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            CivicBid bridge
          </a>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#596472]">
              CivicBid · No-index interface review
            </p>
            <p className="mt-1 text-sm font-semibold">
              The Bid Room v2.1 — exact donor-layout preview
            </p>
          </div>

          <a
            href="/civicbid/the-bid-room-v2-1.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-[#1d5fbf] px-3 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-wide text-[#1d5fbf] transition-colors hover:bg-[#1d5fbf] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
          >
            Open full screen
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </header>

      <section aria-labelledby="bid-room-review-title">
        <h1 id="bid-room-review-title" className="sr-only">
          The Bid Room v2.1 contractor workflow review
        </h1>
        <iframe
          src="/civicbid/the-bid-room-v2-1.html"
          title="The Bid Room v2.1 interactive contractor workflow"
          className="block h-[calc(100dvh-5rem)] min-h-[760px] w-full border-0 bg-[#e9eae5]"
          loading="eager"
          allow="clipboard-write"
        />
      </section>

      <aside className="border-t-2 border-[#15202e] bg-white">
        <div className="mx-auto flex max-w-[1260px] items-start gap-3 px-5 py-4 text-xs leading-relaxed text-[#596472]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a4d]" aria-hidden />
          <p>
            Review boundary: this interface reads public City Record data directly in the browser.
            The official notice, addenda, plans, specifications, eligibility rules, and submission
            system remain controlling. The production migration path is the governed same-origin
            CivicBid adapter and source-health contract.
          </p>
        </div>
      </aside>
    </main>
  );
}
