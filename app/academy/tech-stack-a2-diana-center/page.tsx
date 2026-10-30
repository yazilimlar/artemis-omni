import { ArrowLeft, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "ARTEMIS Tech Stack — Academy · A2 — Diana-Center Milestone (2026-10-30)",
  path: "/academy/tech-stack-a2-diana-center",
  description:
    "The frozen Diana-Center milestone of ARTEMIS Tech Stack A2 (2026-10-30, PR #271): the constellation re-engineered as one WebGL scene — Artemis Diana at the center, OctopusG on the closest orbit — preserved at a permanent address while the live A2 continues to evolve.",
  noIndex: true,
});

const contextItems = [
  {
    label: "Document",
    value: "TS-A2 · Diana-Center Milestone · frozen 2026-10-30 · PR #271",
  },
  {
    label: "Platform",
    value: "Live 5D · interactive 3D stack + constellation",
  },
  {
    label: "Evidence",
    value: "HVAC RC8.11 + Utility RC8.2 Powerhouses",
  },
] as const;

export default function TechStackA2DianaCenterPage() {
  return (
    <main className="min-h-screen bg-[#0b1526] text-[#e9edf3]">
      <header className="border-b border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 border border-[#8fa3c8] px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-[#e9edf3] transition-colors hover:bg-[#e9edf3] hover:text-[#0b1526] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a45c] focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Academy
            </Link>

            <div className="min-w-[220px] flex-1">
              <p className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#93a5c9]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Artemis · Academy · Tech Stack
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-[#e9edf3]">
                ARTEMIS Tech Stack — Academy · A2 — Diana-Center Milestone
              </p>
            </div>

            <a
              href="/academy/tech-stack-a2-diana-center.html"
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
          <h1 className="max-w-[22ch] text-3xl font-semibold leading-[1.08] sm:text-5xl">
            The technology stack, in motion.
          </h1>
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[#b9c4d9]">
            This page preserves the Diana-Center milestone of document TS-A2
            (frozen 2026-10-30, PR #271) at a permanent address, while the
            live A2 continues to evolve: the constellation re-engineered as
            one WebGL scene — Artemis Diana at the center, OctopusG on the
            closest orbit — with the six-layer Live 5D stack, the
            collaboration stage, the verified base case and the five bases
            on one live clock, in six views: Day, Dark, Executive, Matrix,
            Executive Light Blue and TTY.
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

      <section className="px-3 py-3 sm:px-5 sm:py-5" aria-labelledby="tech-stack-a2-diana-center-title">
        <div className="mx-auto max-w-[1500px] overflow-hidden border-2 border-[#22345a] bg-[#0e1c36] shadow-[0_18px_45px_rgba(3,8,20,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#22345a] bg-[#13264a] px-4 py-2 text-white">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c9a45c]" aria-hidden />
              <h2
                id="tech-stack-a2-diana-center-title"
                className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
              >
                ARTEMIS Tech Stack — Academy · A2 — Diana-Center Milestone
              </h2>
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#b9c4d9]">
              TS-A2 · Frozen milestone · 2026-10-30
            </span>
          </div>
          <iframe
            src="/academy/tech-stack-a2-diana-center.html"
            title="ARTEMIS Tech Stack — Academy, A2 Diana-Center Milestone, frozen 2026-10-30 (document TS-A2)"
            className="block h-[calc(100dvh-11rem)] min-h-[720px] w-full border-0 bg-[#0b1526]"
            loading="eager"
            allow="clipboard-write"
          />
        </div>
      </section>

      <aside className="border-t border-[#22345a] bg-[#0e1c36]">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="flex items-start gap-3 text-xs leading-relaxed text-[#b9c4d9]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a45c]" aria-hidden />
            <span>
              This route serves the frozen Diana-Center milestone document of
              2026-10-30 (PR #271); the live A2 at /academy/tech-stack-a2
              continues to evolve. TS-A2 is a technology and method statement.
              Project figures inside the document are representative
              demonstration values from the public Powerhouse demos — not
              sealed design, not official agency approval, and not payment
              certification.
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://artemis.agoraxai.com/labs/hvac-mechanical-intelligence-bridge"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a45c] px-5 py-2.5 text-sm font-semibold text-[#0b1526] transition hover:bg-[#d8ba74]"
            >
              HVAC Powerhouse
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="https://artemis.agoraxai.com/labs/utility-intelligence-bridge/3d-model"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#8fa3c8] px-5 py-2.5 text-sm font-semibold text-[#e9edf3] transition hover:bg-[#13264a]"
            >
              Utility Powerhouse
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </aside>
    </main>
  );
}
