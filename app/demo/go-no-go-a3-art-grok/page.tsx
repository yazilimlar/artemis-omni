import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Go / No-Go — Desk A3",
  path: "/demo/go-no-go-a3-art-grok",
  description:
    "A3 desk on the A1 TEST 001 estimating registry. The gates run, the session chain verifies in the browser, and nothing here writes the private master. Test — not for bid.",
  noIndex: true,
});

export default function GoNoGoA3Page() {
  return (
    <main className="min-h-screen bg-[#0b1526] text-[#e9edf3]">
      <header className="border-b border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 border border-[#8fa3c8] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#e9edf3]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Demo Center
          </Link>
          <div className="min-w-[220px] flex-1">
            <p className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Artemis · Demo · Go / No-Go · A3
            </p>
            <p className="mt-1 text-sm font-semibold">Go / No-Go Desk — A3</p>
          </div>
          <a
            href="/demo/go-no-go-a3-art-grok.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#c9a45c] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#c9a45c]"
          >
            Open full screen <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </header>
      <section className="px-3 py-3 sm:px-5">
        <div className="mx-auto max-w-[1500px] overflow-hidden border-2 border-[#22345a] bg-[#0e1c36]">
          <iframe
            src="/demo/go-no-go-a3-art-grok.html"
            title="Go/No-Go Desk A3 — WDF Estimating Registry A1 TEST 001"
            className="block h-[calc(100dvh-8rem)] min-h-[720px] w-full border-0 bg-[#f3f0e8]"
          />
        </div>
      </section>
      <aside className="border-t border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
          <p className="flex items-start gap-3 text-xs leading-relaxed text-[#b9c4d9]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a45c]" aria-hidden />
            <span>
              TEST — NOT FOR BID. The desk runs the A1 rules in the browser. It does not write the
              private master, and it does not turn an UNKNOWN into a fact.
            </span>
          </p>
        </div>
      </aside>
    </main>
  );
}
