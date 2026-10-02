import { ArrowLeft, ArrowRight, ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "The Bid Room v2.1",
  path: "/labs/civicbid-signal-forge",
  description:
    "A no-index review route for the Artemis CivicBid Bid Room v2.1 contractor workflow interface.",
  noIndex: true,
});

const contextItems = [
  {
    label: "Interface",
    value: "Preserved donor preview",
  },
  {
    label: "Review status",
    value: "No-index · reference only",
  },
  {
    label: "Controlling record",
    value: "Official agency sources",
  },
] as const;

export default function CivicBidSignalForgePage() {
  return (
    <main className="min-h-screen bg-[#dfe2dc] text-[#15202e]">
      <header className="border-b-2 border-[#15202e] bg-[#f8f8f4]">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/labs/civicbid-intelligence-bridge"
              className="inline-flex items-center gap-2 border border-[#15202e] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide transition-colors hover:bg-[#15202e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              CivicBid bridge
            </Link>

            <div className="min-w-[220px] flex-1">
              <p className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#596472]">
                <FlaskConical className="h-3.5 w-3.5" aria-hidden />
                CivicBid interface review
              </p>
              <h1 className="mt-1 text-base font-black tracking-tight">The Bid Room v2.1</h1>
            </div>

            <nav className="flex flex-wrap items-center gap-2" aria-label="CivicBid review actions">
              <Link
                href="/products/bidroom/switchboard"
                className="inline-flex items-center gap-2 border border-[#596472] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#26342d] transition-colors hover:bg-[#15202e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
              >
                Switchboard
              </Link>
              <Link
                href="/products/bidroom/live"
                className="inline-flex items-center gap-2 border border-[#1f6f4a] bg-[#eef8f1] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#155235] transition-colors hover:bg-[#1f6f4a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
              >
                BidRoom Live <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <a
                href="/civicbid/the-bid-room-v2-1.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-[#1d5fbf] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#1d5fbf] transition-colors hover:bg-[#1d5fbf] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5fbf] focus-visible:ring-offset-2"
              >
                Open full screen <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="border-b border-[#9ca59e] bg-white" aria-label="Review context">
        <div className="mx-auto grid max-w-[1500px] divide-y divide-[#c9cec9] px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {contextItems.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-3 py-3 sm:px-4 first:pl-0">
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#6a746e]">{label}</span>
              <span className="text-xs font-semibold text-[#26342d]">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-3 py-3 sm:px-5 sm:py-5" aria-labelledby="bid-room-review-title">
        <div className="mx-auto max-w-[1500px] overflow-hidden border-2 border-[#15202e] bg-[#e9eae5] shadow-[0_18px_45px_rgba(21,32,46,0.18)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#15202e] bg-[#15202e] px-4 py-2 text-white">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#ddb04e]" aria-hidden />
              <h2 id="bid-room-review-title" className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]">
                Preserved contractor workflow
              </h2>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#cbd4dd]">
              Embedded artifact · unchanged
            </span>
          </div>
          <iframe
            src="/civicbid/the-bid-room-v2-1.html"
            title="The Bid Room v2.1 interactive contractor workflow"
            className="block h-[calc(100dvh-11rem)] min-h-[720px] w-full border-0 bg-[#e9eae5]"
            loading="eager"
            allow="clipboard-write"
          />
        </div>
      </section>

      <aside className="border-t-2 border-[#15202e] bg-[#f8f8f4]">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3 text-xs leading-relaxed text-[#4f5d55]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a4d]" aria-hidden />
            <p>
              Review boundary: official notices, addenda, plans, specifications, eligibility rules,
              and submission systems remain controlling. This route preserves the interface for
              review and does not convert it into an official procurement record.
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}
