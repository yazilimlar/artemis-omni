import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Go / No-Go — Demo A1-26",
  path: "/demo/go-no-go-a1-26-muse",
  description:
    "Demo A1-26 of the Artemis Go/No-Go bid decision registry: five decision gates, three live estimating pursuits at intake, an append-only hash-chained atomic log, and timer-only time tracking. Read-only snapshot; the master registry is private.",
  noIndex: true,
});

const contextItems = [
  {
    label: "Document",
    value: "WDF-EST-REG-A1 · A1 TEST 001 · Demo snapshot",
  },
  {
    label: "Decision model",
    value: "Gates 0–4 · hard stops veto · scores never average away a veto",
  },
  {
    label: "Log",
    value: "Append-only · dual ET/UTC stamps · SHA-256 hash chain · chain VALID over 7 entries",
  },
] as const;

export default function GoNoGoA126DemoPage() {
  return (
    <main className="min-h-screen bg-[#0b1526] text-[#e9edf3]">
      <header className="border-b border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 border border-[#8fa3c8] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#e9edf3] transition-colors hover:bg-[#e9edf3] hover:text-[#0b1526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Demo Center
            </Link>

            <div className="min-w-[220px] flex-1">
              <p className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Artemis · Demo · Go / No-Go
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-[#e9edf3]">
                Go / No-Go — Demo A1-26 · by Muse (OctopusG)
              </p>
            </div>

            <a
              href="/demo/go-no-go-a1-26-muse.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#c9a45c] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#c9a45c] transition-colors hover:bg-[#c9a45c] hover:text-[#0b1526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2"
            >
              Open full screen <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-[#22345a]">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
          <h1 className="max-w-[24ch] text-3xl font-semibold leading-[1.08] sm:text-5xl">
            Bid decisions on evidence, not opinion.
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[#b9c4d9]">
            Demo A1-26 is the read-only public snapshot of the A1 TEST 001
            estimating registry: three mechanical pursuits at intake, a
            five-gate Go/No-Go model, eight tracked data requests, and an
            atomic log whose every entry is time-stamped in ET and UTC and
            hash-chained to the one before it. Entries are made only in the
            private master registry; nothing entered here is saved.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {contextItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#22345a] bg-[#0e1c36] p-4"
              >
                <dt className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-medium leading-snug text-[#e9edf3]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="px-3 py-3 sm:px-5 sm:py-5" aria-labelledby="go-no-go-a1-title">
        <div className="mx-auto max-w-[1500px] overflow-hidden border-2 border-[#22345a] bg-[#0e1c36] shadow-[0_18px_45px_rgba(3,8,20,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#22345a] bg-[#13264a] px-4 py-2 text-white">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c9a45c]" aria-hidden />
              <h2
                id="go-no-go-a1-title"
                className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
              >
                WDF Estimating Registry — A1 TEST 001 · Team View
              </h2>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#b9c4d9]">
              Demo A1-26 · Embedded snapshot · unchanged
            </span>
          </div>
          <iframe
            src="/demo/go-no-go-a1-26-muse.html"
            title="Go/No-Go Demo A1-26 — WDF Estimating Registry A1 TEST 001, read-only team view"
            className="block h-[calc(100dvh-11rem)] min-h-[720px] w-full border-0 bg-[#0b1526]"
            loading="eager"
            allow="clipboard-write"
          />
        </div>
      </section>

      <aside className="border-t border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
          <p className="flex items-start gap-3 text-xs leading-relaxed text-[#b9c4d9]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a45c]" aria-hidden />
            <span>
              TEST — NOT FOR BID. This demo contains only the registry data
              stated by its owner on 2026-10-29. No drawings, pricing,
              payroll, financial or bonding data is included, and no bid
              decision has been recorded. Unverified fields read UNKNOWN by
              design.
            </span>
          </p>
        </div>
      </aside>
    </main>
  );
}
