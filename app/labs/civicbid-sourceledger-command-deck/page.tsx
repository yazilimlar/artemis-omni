import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "CivicBid SourceLedger Command Deck",
  path: "/labs/civicbid-sourceledger-command-deck",
  description:
    "NYC public procurement signals, source-checked and translated into bid-room action. Public-safe sample cockpit with a source ledger, explainable readiness scoring, friction mapping, and human-reviewed next actions.",
});

/* ------------------------------------------------------------------ */
/* Section data — all sample, public-safe, deterministic               */
/* ------------------------------------------------------------------ */

const CRITIQUE_POINTS = [
  "The original page had a strong concept and compliance posture.",
  "The visible cockpit proof was insufficient.",
  "The “Scanning public bid signals…” state weakened credibility.",
  "The page needed deterministic sample fallback data.",
  "The source-health layer needed to be more visible.",
  "The readiness score needed explainability.",
  "The page needed bid-room actions, not just intelligence.",
  "Signal Forge and Intelligence Bridge needed clearer separation.",
  "External reviews included useful themes, but unsupported claims were excluded by design.",
];

const SOURCE_LEDGER = [
  {
    name: "NYC Current Solicitations",
    method: "Socrata JSON / official public dataset",
    role: "Opportunity discovery",
    mode: "Sample representative row",
    confidence: "Official public source pattern",
    boundary: "Verify official notice and documents",
  },
  {
    name: "City Record Online",
    method: "Socrata JSON / public notices",
    role: "Notice monitoring",
    mode: "Sample representative row",
    confidence: "Official public notice pattern",
    boundary: "Confirm final solicitation package",
  },
  {
    name: "Checkbook NYC Contracts API",
    method: "XML POST / public contract and award context",
    role: "Lifecycle and incumbent/award context",
    mode: "Partial sample context",
    confidence: "Official financial/contracts dataset",
    boundary: "Normalize schema before production use",
  },
  {
    name: "PASSPort / Procurement Navigator",
    method: "Official portal deep link / manual review",
    role: "Bid documents and submission path",
    mode: "Manual boundary",
    confidence: "Authoritative portal",
    boundary: "No login scraping; no automated submission",
  },
];

const RADAR_ROWS = [
  {
    signal: "DDC infrastructure opportunity",
    agency: "NYC Design and Construction",
    category: "Heavy civil / infrastructure",
    dueWindow: "14 days",
    source: "NYC Current Solicitations",
    readiness: 82,
    confidence: 91,
    friction: ["Bonding", "Addenda", "PASSPort review"],
    nextAction: "Review official PASSPort documents",
    why: "Urgent, official-source pattern; documents and compliance still require human validation.",
  },
  {
    signal: "DEP resilience repair package",
    agency: "NYC Environmental Protection",
    category: "Construction services",
    dueWindow: "21 days",
    source: "City Record Online",
    readiness: 74,
    confidence: 86,
    friction: ["M/WBE", "Insurance", "Pre-bid meeting"],
    nextAction: "Check participation and insurance language",
    why: "Strong source basis but compliance requirements need review.",
  },
  {
    signal: "Parks reconstruction watch item",
    agency: "NYC Parks",
    category: "Sitework / reconstruction",
    dueWindow: "30 days",
    source: "NYC Open Data / agency page",
    readiness: 69,
    confidence: 84,
    friction: ["Site visit", "Plan/spec custody", "Q&A deadline"],
    nextAction: "Confirm pre-bid meeting and document package",
    why: "Useful pursuit candidate but not fully ready until documents are confirmed.",
  },
  {
    signal: "MTA C&D monitor",
    agency: "MTA Construction & Development",
    category: "Transit infrastructure",
    dueWindow: "Watch only",
    source: "MTA opportunity page",
    readiness: 63,
    confidence: 78,
    friction: ["Manual review", "Bid docs", "Prequalification"],
    nextAction: "Track official bid document release",
    why: "Strategic market signal, but not ready for estimating commitment.",
  },
];

const READINESS_WEIGHTS = [
  { weight: "30%", label: "Due-date urgency" },
  { weight: "25%", label: "Document availability" },
  { weight: "20%", label: "Source confidence" },
  { weight: "15%", label: "Construction fit" },
  { weight: "10%", label: "Compliance clarity" },
];

const FRICTION_CHECKS = [
  "M/WBE / participation",
  "PLA / labor terms",
  "Bonding",
  "Insurance",
  "Pre-bid meeting",
  "Site visit",
  "Addenda",
  "Q&A deadline",
  "Plan/spec custody",
  "PASSPort submission mode",
  "Prequalification",
  "Executive go/no-go",
];

const BID_ROOM_ACTIONS = [
  "Add to Pursuit Queue",
  "Assign Bid Captain",
  "Generate Compliance Checklist",
  "Watch Addenda",
  "Export Weekly Briefing",
  "Open Official Source",
];

const LIFECYCLE_STAGES = [
  { stage: "Opportunity discovery", detail: "Public signals surfaced from the source ledger" },
  { stage: "Document custody", detail: "Official plans, specs, and addenda tracked in one place" },
  { stage: "Compliance review", detail: "Friction checks reviewed by humans, not automation" },
  { stage: "Bid decision", detail: "Executive go/no-go with readiness context" },
  { stage: "Award / lifecycle monitoring", detail: "Award and contract context from public records" },
  { stage: "Transition to execution controls", detail: "Handoff into Artemis project intelligence" },
  { stage: "Cost, forecast, cashflow, risk", detail: "Downstream Artemis execution tracking" },
];

const VERSION_COMPARE = [
  {
    name: "CivicBid Intelligence Bridge",
    href: "/labs/civicbid-intelligence-bridge",
    points: ["Architecture and methodology", "Connector registry", "Production-ready narrative"],
  },
  {
    name: "CivicBid Signal Forge",
    href: "/labs/civicbid-signal-forge",
    points: ["Experimental signal cockpit", "First visible radar concept", "Needed stronger proof"],
  },
  {
    name: "CivicBid SourceLedger Command Deck",
    href: "/labs/civicbid-sourceledger-command-deck",
    points: [
      "Upgraded source-ledger cockpit",
      "Deterministic sample fallback",
      "Scoring explainability",
      "Bid-room action layer",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers (server-safe)                          */
/* ------------------------------------------------------------------ */

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
        {kicker}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
    </div>
  );
}

function ScorePill({ value, label }: { value: number; label: string }) {
  const tone =
    value >= 80
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      : value >= 70
        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
        : "bg-amber-500/10 text-amber-300 border-amber-500/30";
  return (
    <div className={`rounded-lg border px-2.5 py-1 text-center ${tone}`}>
      <p className="text-base font-bold leading-none">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CivicBidSourceLedgerCommandDeckPage() {
  return (
    <>
      {/* 1 · Hero */}
      <PageHero
        eyebrow="Labs · CivicBid Experiment"
        title="CivicBid SourceLedger Command Deck"
        description="NYC public procurement signals, source-checked and translated into bid-room action. An experimental CivicBid cockpit that converts public procurement fragments into a controlled pursuit queue — every signal carries its source ledger entry, an explainable readiness score, a compliance friction profile, and a human-reviewed next action."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Labs experiment</Badge>
          <Badge>Source-ledger cockpit</Badge>
          <Badge>Public-safe sample data</Badge>
          <Badge>Human review required</Badge>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button href="/contact" size="sm">
            Request CivicBid Pilot
          </Button>
          <Button href="/labs/civicbid-signal-forge" size="sm" variant="outline">
            Compare Signal Forge
          </Button>
          <Link
            href="/labs/civicbid-intelligence-bridge"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
          >
            See Intelligence Bridge
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Labs
          </Link>
        </div>
      </PageHero>

      <section className="py-12 lg:py-16">
        <Container>
          {/* Solid dark cockpit shell — same convention as Signal Forge:
              the deck keeps its instrument palette in both site themes. */}
          <div className="space-y-12 rounded-3xl bg-[#0a1020] p-4 ring-1 ring-slate-800 sm:p-8">
            {/* 2 · Public-safe disclaimer */}
            <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 px-5 py-4">
              <p className="text-xs leading-relaxed text-amber-300/90">
                <strong className="text-amber-300">Official portals remain authoritative.</strong>{" "}
                SourceLedger Command Deck is decision support only. It is not legal advice,
                compliance certification, a bid-submission system, or a substitute for PASSPort,
                agency portals, bid documents, estimator judgment, counsel review, or contracting
                officer instructions. No logins are scraped, no credentials are used, and sample
                data is not a certified bid feed.
              </p>
            </div>

            {/* 3 · Version memorial */}
            <div>
              <SectionHeading kicker="Version memorial" title="Why this version exists" />
              <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
                This version responds to review comments on the earlier Signal Forge page. The
                upgrade replaces passive scanning language with a deterministic cockpit, makes
                source health visible, exposes readiness scoring, and adds bid-room actions. It
                preserves the compliance boundary: official sources govern, humans review, and
                public demo data remains labeled.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CRITIQUE_POINTS.map((point, index) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800/70 bg-slate-950 px-3 py-2.5"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-emerald-400/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[11px] leading-snug text-slate-400">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 · Source Ledger */}
            <div>
              <SectionHeading kicker="Source ledger" title="Every signal carries its source" />
              <div className="grid gap-3 md:grid-cols-2">
                {SOURCE_LEDGER.map((source) => (
                  <div
                    key={source.name}
                    className="rounded-xl border border-slate-800/80 bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-200">{source.name}</h3>
                      <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        {source.mode}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-1.5 text-[11px]">
                      <div className="flex gap-2">
                        <dt className="w-32 shrink-0 uppercase tracking-wider text-slate-600">
                          Method
                        </dt>
                        <dd className="text-slate-400">{source.method}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-32 shrink-0 uppercase tracking-wider text-slate-600">
                          Role in cockpit
                        </dt>
                        <dd className="text-slate-400">{source.role}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-32 shrink-0 uppercase tracking-wider text-slate-600">
                          Confidence basis
                        </dt>
                        <dd className="text-slate-400">{source.confidence}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-32 shrink-0 uppercase tracking-wider text-slate-600">
                          Review boundary
                        </dt>
                        <dd className="font-medium text-amber-300/90">{source.boundary}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 · Signal Radar */}
            <div>
              <SectionHeading kicker="Signal radar" title="Sample pursuit queue" />
              <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-950/10 px-4 py-2.5">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  ● Sample mode
                </span>
                <span className="text-xs text-slate-400">
                  {RADAR_ROWS.length} representative signals · deterministic sample data
                </span>
                <span className="ml-auto text-[10px] text-slate-500">
                  Not a certified live bid feed
                </span>
              </div>
              <div className="space-y-3">
                {RADAR_ROWS.map((row) => (
                  <div
                    key={row.signal}
                    className="rounded-xl border border-slate-800/80 bg-slate-950 p-4 transition-all hover:border-slate-600"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-200">{row.signal}</h3>
                        <p className="mt-0.5 text-xs text-slate-400">{row.agency}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                          <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                            {row.category}
                          </span>
                          <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                            Due window: <span className="text-slate-300">{row.dueWindow}</span>
                          </span>
                          <span className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5">
                            Source: <span className="text-slate-300">{row.source}</span>
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {row.friction.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-rose-500/25 bg-rose-950/20 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-rose-300/90"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <ScorePill value={row.readiness} label="Readiness" />
                        <ScorePill value={row.confidence} label="Confidence" />
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 border-t border-slate-800/50 pt-3 sm:grid-cols-2">
                      <p className="text-[11px] text-slate-400">
                        <span className="font-semibold uppercase tracking-wider text-emerald-400/80">
                          Next bid-room action:{" "}
                        </span>
                        {row.nextAction}
                      </p>
                      <p className="text-[11px] italic text-slate-500">
                        <span className="font-semibold not-italic uppercase tracking-wider text-slate-500">
                          Why this score:{" "}
                        </span>
                        {row.why}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6 · Readiness score explainer */}
            <div>
              <SectionHeading kicker="Explainability" title="How the readiness score is built" />
              <div className="grid gap-2 sm:grid-cols-5">
                {READINESS_WEIGHTS.map((component) => (
                  <div
                    key={component.label}
                    className="rounded-lg border border-slate-800/80 bg-slate-950 px-3 py-3 text-center"
                  >
                    <p className="text-lg font-bold text-emerald-300">{component.weight}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
                      {component.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] text-slate-500">
                Readiness = 30% due-date urgency + 25% document availability + 20% source
                confidence + 15% construction fit + 10% compliance clarity
              </p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-amber-300/80">
                The score is not an award prediction. It is a pursuit-readiness index used to
                decide what deserves human review next.
              </p>
            </div>

            {/* 7 · Friction Map */}
            <div>
              <SectionHeading kicker="Friction map" title="Procurement friction checks" />
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {FRICTION_CHECKS.map((check) => (
                  <div
                    key={check}
                    className="flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-950 px-3 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <p className="text-[11px] font-medium text-slate-300">{check}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Each check is a human-review gate, not an automated pass/fail. The deck flags known
                friction patterns; pursuit due diligence stays with the bid team.
              </p>
            </div>

            {/* 8 · Bid-room actions */}
            <div>
              <SectionHeading kicker="Bid-room actions" title="From intelligence to action" />
              <div className="flex flex-wrap gap-2">
                {BID_ROOM_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    disabled
                    title="Demo action — illustrative only"
                    className="cursor-not-allowed rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-400 opacity-70"
                  >
                    {action}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Demo actions are illustrative. A private pilot would wire these to approved
                workflows and human review gates.
              </p>
            </div>

            {/* 9 · Lifecycle Watch */}
            <div>
              <SectionHeading
                kicker="Lifecycle watch"
                title="Upstream pursuit, downstream Artemis"
              />
              <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-300">
                SourceLedger Command Deck covers the upstream pursuit path. After bid decision and
                award, the workflow hands off to Artemis execution controls.
              </p>
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {LIFECYCLE_STAGES.map((item, index) => (
                  <li
                    key={item.stage}
                    className="rounded-xl border border-slate-800/80 bg-slate-950 p-3"
                  >
                    <p className="font-mono text-[10px] text-emerald-400/70">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-200">{item.stage}</p>
                    <p className="mt-1 text-[10px] leading-snug text-slate-500">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* 10 · Compare versions */}
            <div>
              <SectionHeading kicker="Version lineage" title="Three CivicBid layers, compared" />
              <div className="grid gap-3 lg:grid-cols-3">
                {VERSION_COMPARE.map((version, index) => (
                  <div
                    key={version.name}
                    className={`rounded-xl border p-4 ${
                      index === 2
                        ? "border-emerald-500/40 bg-emerald-950/10"
                        : "border-slate-800/80 bg-slate-950"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-slate-200">{version.name}</h3>
                    <ul className="mt-2 space-y-1">
                      {version.points.map((point) => (
                        <li key={point} className="text-[11px] text-slate-400">
                          • {point}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={version.href}
                      className="mt-3 inline-block text-[11px] text-cyan-400 hover:text-cyan-300"
                    >
                      {index === 2 ? "You are here" : "Open →"}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* 11 · Pilot CTA */}
            <div className="rounded-2xl border border-gold/30 bg-slate-950 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                Pilot scope
              </p>
              <p className="mt-2 text-base font-semibold text-slate-100">
                Start with 3 agencies, 5 connectors, 25 watchlist opportunities, and a weekly
                pursuit briefing.
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-400">
                The first pilot should validate source access, document custody, scoring weights,
                compliance extraction, and human review workflow before any production claims are
                made.
              </p>
              <div className="mt-4">
                <Button href="/contact" size="sm">
                  Request CivicBid Pilot
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
