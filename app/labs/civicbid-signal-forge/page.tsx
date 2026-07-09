import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "CivicBid Signal Forge",
  path: "/labs/civicbid-signal-forge",
  description:
    "A public-safe CivicBid cockpit that turns NYC-region procurement fragments into source-labeled bid-room action, readiness scoring, source health, and compliance-friction review.",
});

const sampleSignals = [
  {
    signal: "DDC construction opportunity",
    agency: "NYC Design and Construction",
    category: "Heavy civil / infrastructure",
    dueWindow: "14 days",
    source: "NYC Current Solicitations",
    readiness: 82,
    confidence: 91,
    nextAction: "Review PASSPort documents",
    reason:
      "High urgency because the sample due window is under two weeks; strong source confidence because the signal is modeled after an official NYC solicitation feed; compliance remains human-reviewed.",
    friction: ["Bonding", "Addenda", "PASSPort boundary"],
  },
  {
    signal: "DEP repair and resilience package",
    agency: "NYC Environmental Protection",
    category: "Construction services",
    dueWindow: "21 days",
    source: "City Record Online",
    readiness: 74,
    confidence: 86,
    nextAction: "Check PLA / M/WBE language",
    reason:
      "Medium-high readiness because the notice is source-labeled and time-sensitive, but labor, insurance, and participation requirements still require bid-team review.",
    friction: ["M/WBE", "Insurance", "Pre-bid meeting"],
  },
  {
    signal: "Parks reconstruction watch item",
    agency: "NYC Parks",
    category: "Sitework / reconstruction",
    dueWindow: "30 days",
    source: "NYC Open Data / agency page",
    readiness: 69,
    confidence: 84,
    nextAction: "Confirm pre-bid meeting",
    reason:
      "Useful market signal, but readiness is capped until plan/spec custody, pre-bid notes, and addenda status are verified from the official source.",
    friction: ["Site visit", "Plan/spec custody", "Question deadline"],
  },
  {
    signal: "MTA C&D opportunity monitor",
    agency: "MTA Construction & Development",
    category: "Transit infrastructure",
    dueWindow: "Watch only",
    source: "MTA opportunity page",
    readiness: 63,
    confidence: 78,
    nextAction: "Track official bid documents",
    reason:
      "Strong strategic fit for heavy civil teams, but this remains a watch signal until official documents, submission mode, and procurement timing are confirmed.",
    friction: ["Manual review", "Bid docs", "Certificate compliance"],
  },
] as const;

const sourceHealth = [
  {
    connector: "NYC Current Solicitations",
    method: "Socrata JSON",
    status: "Sample healthy",
    records: "42 sample",
    confidence: "Official public dataset",
    failureMode: "None in sample mode",
  },
  {
    connector: "City Record Online",
    method: "Socrata JSON",
    status: "Sample healthy",
    records: "18 sample",
    confidence: "Official public dataset",
    failureMode: "None in sample mode",
  },
  {
    connector: "Checkbook NYC Contracts API",
    method: "XML POST",
    status: "Partial / awards context",
    records: "5 sample",
    confidence: "Official API",
    failureMode: "Schema normalization before live use",
  },
  {
    connector: "PASSPort Public / Procurement Navigator",
    method: "Deep link manual review",
    status: "Manual only",
    records: "N/A",
    confidence: "Official portal boundary",
    failureMode: "No login scraping; official download/respond flow governs",
  },
] as const;

const readinessFormula = [
  ["Due-date urgency", 30],
  ["Document availability", 25],
  ["Source confidence", 20],
  ["Construction fit", 15],
  ["Compliance clarity", 10],
] as const;

const queue = [
  {
    lane: "Ready to review",
    score: "80+",
    description: "Official-source signal, near-term deadline, and enough document context to enter pursuit review.",
  },
  {
    lane: "Needs document check",
    score: "65–79",
    description: "Promising opportunity, but plan/spec custody, addenda, or submission details still require human validation.",
  },
  {
    lane: "Watch only",
    score: "<65",
    description: "Strategic terrain signal, rebid indicator, or agency pattern that should not consume estimating resources yet.",
  },
] as const;

const lifecycleSignals = [
  "Awards / incumbent pattern",
  "Contract end or future-start date",
  "Remaining value / change-order heat",
  "Rebid watch and outreach timing",
] as const;

function scoreTone(score: number) {
  if (score >= 80) return "border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
  if (score >= 70) return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  return "border-sky-300/35 bg-sky-400/10 text-sky-100";
}

function ScorePill({ score }: { score: number }) {
  return (
    <span className={`inline-flex min-w-14 justify-center rounded-full border px-2.5 py-1 font-mono text-xs ${scoreTone(score)}`}>
      {score}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-soft">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-foreground/70">{description}</p>
    </div>
  );
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled
      className="rounded-full border border-silver/20 bg-silver/5 px-3 py-1.5 text-xs text-foreground/60"
      title="Public demo action only. A private pilot would wire this to the pursuit workflow."
    >
      {children}
    </button>
  );
}

export default function CivicBidSignalForgePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_32rem)] py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="test">Labs experiment</StatusBadge>
              <StatusBadge tone="synthetic">Sample cockpit</StatusBadge>
              <StatusBadge tone="public">Public-safe data</StatusBadge>
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              NYC public procurement signals, translated into bid-room action.
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/75 md:text-xl">
              CivicBid Signal Forge turns public procurement fragments into a controlled pursuit queue for contractors. It monitors official public sources where APIs exist, deep-links to official portals where human review is required, and ranks opportunities by urgency, document readiness, compliance friction, and source confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact">Request a Pilot</Button>
              <Button href="/labs/civicbid-intelligence-bridge" variant="outline">
                See Intelligence Bridge
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border/70 py-8">
        <Container>
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50/90">
            <strong className="text-amber-100">Sample demonstration — not a certified bid feed.</strong> Official portals remain the authoritative record. Signal Forge is a decision-support layer only, not legal advice, compliance certification, or a substitute for PASSPort, agency portals, bid documents, estimator judgment, or counsel review. No logins are scraped and no credentials are used.
          </div>
        </Container>
      </section>

      <section id="signal-radar" className="py-16 lg:py-20">
        <Container>
          <SectionTitle
            eyebrow="Signal Radar"
            title="A visible cockpit instead of a spinner"
            description="The public page should always show a deterministic, source-labeled view. If live connectors are unavailable, the cockpit falls back to clearly labeled representative data rather than a dead loading state."
          />

          <div className="mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-2xl shadow-black/20">
            <div className="grid grid-cols-8 border-b border-border/70 bg-muted/30 px-4 py-3 font-mono text-[0.65rem] uppercase tracking-wider text-foreground/55 max-lg:hidden">
              <span className="col-span-2">Signal</span>
              <span>Agency</span>
              <span>Due</span>
              <span>Source</span>
              <span>Ready</span>
              <span>Trust</span>
              <span>Next action</span>
            </div>
            <div className="divide-y divide-border/60">
              {sampleSignals.map((item) => (
                <article key={item.signal} className="grid gap-4 px-4 py-5 lg:grid-cols-8 lg:items-start">
                  <div className="lg:col-span-2">
                    <h3 className="font-semibold text-foreground">{item.signal}</h3>
                    <p className="mt-2 text-sm text-foreground/60">{item.category}</p>
                  </div>
                  <p className="text-sm text-foreground/75">{item.agency}</p>
                  <p className="font-mono text-sm text-gold-soft">{item.dueWindow}</p>
                  <p className="text-sm text-foreground/70">{item.source}</p>
                  <ScorePill score={item.readiness} />
                  <ScorePill score={item.confidence} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.nextAction}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.friction.map((tag) => (
                        <span key={tag} className="rounded-full border border-silver/20 bg-silver/5 px-2 py-1 text-[0.68rem] text-foreground/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="lg:col-span-8 rounded-2xl border border-border/60 bg-background/45 p-4 text-sm leading-6 text-foreground/65">
                    <strong className="text-foreground">Why this score:</strong> {item.reason}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="trust-matrix" className="border-y border-border/70 bg-muted/20 py-16 lg:py-20">
        <Container>
          <SectionTitle
            eyebrow="Trust Matrix"
            title="Source health and connector boundaries are part of the product"
            description="Government contractors need to know whether a signal came from an official API, a public portal, a deep link, a manual review path, or a sample fallback. This makes the system auditable instead of mysterious."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {sourceHealth.map((source) => (
              <article key={source.connector} className="rounded-3xl border border-border/70 bg-card/60 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{source.connector}</h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-foreground/50">{source.method}</p>
                  </div>
                  <StatusBadge tone={source.status.includes("Partial") ? "sanitize" : source.status.includes("Manual") ? "reference" : "public"}>
                    {source.status}
                  </StatusBadge>
                </div>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-foreground/45">Records</dt>
                    <dd className="mt-1 text-foreground/80">{source.records}</dd>
                  </div>
                  <div>
                    <dt className="text-foreground/45">Confidence</dt>
                    <dd className="mt-1 text-foreground/80">{source.confidence}</dd>
                  </div>
                  <div>
                    <dt className="text-foreground/45">Limit</dt>
                    <dd className="mt-1 text-foreground/80">{source.failureMode}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="readiness-queue" className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionTitle
                eyebrow="Readiness Queue"
                title="Expose the scoring formula before asking teams to trust it"
                description="The score is not a black-box answer. It is a review index that tells business development, estimating, compliance, and executives where to focus next."
              />
              <div className="mt-8 rounded-3xl border border-border/70 bg-card/60 p-6">
                <p className="font-mono text-sm text-gold-soft">Readiness =</p>
                <div className="mt-5 space-y-4">
                  {readinessFormula.map(([label, pct]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground/75">{label}</span>
                        <span className="font-mono text-foreground/55">{pct}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-gold" style={{ width: `${pct * 2}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {queue.map((lane) => (
                <article key={lane.lane} className="rounded-3xl border border-border/70 bg-card/60 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-foreground">{lane.lane}</h3>
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-xs text-gold-soft">
                      {lane.score}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground/65">{lane.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="friction-map" className="border-y border-border/70 bg-muted/20 py-16 lg:py-20">
        <Container>
          <SectionTitle
            eyebrow="Friction Map"
            title="Show what can disqualify a bid before estimating time is wasted"
            description="The friction layer converts raw notice details into human-reviewed pursuit checks: M/WBE, PLA, bonding, insurance, pre-bid meetings, site visits, addenda, forms, and submission packaging."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["M/WBE / participation", "Bonding / insurance", "Pre-bid / site visit", "Addenda / Q&A deadline", "Plan/spec custody", "PASSPort submission mode", "Prequalification", "Executive go/no-go"].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-card/60 p-5 text-sm text-foreground/75">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="lifecycle-watch" className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <SectionTitle
              eyebrow="Lifecycle Watch"
              title="The upstream pursuit layer connects to the Artemis execution bridge"
              description="Signal Forge should sit before cost, field production, forecast, and cashflow control. It finds the work, frames the pursuit risk, and hands the winning opportunity into the contractor operating system."
            />
            <div className="rounded-3xl border border-border/70 bg-card/60 p-6">
              <h3 className="font-semibold text-foreground">Lifecycle signals to monitor next</h3>
              <ol className="mt-5 space-y-4">
                {lifecycleSignals.map((item, index) => (
                  <li key={item} className="flex gap-4 text-sm leading-6 text-foreground/70">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 font-mono text-xs text-gold-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/70 py-16 lg:py-20">
        <Container>
          <div className="rounded-3xl border border-gold/30 bg-gold/10 p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-soft">Private Pilot Gate</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Start with 3 agencies, 5 connectors, 25 watchlist opportunities, and a weekly pursuit briefing.</h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-foreground/70">
                  The first pilot should wire approved public-source connectors, official deep links, document custody, human-reviewed compliance extraction, and no silent procurement or CRM write-back.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <ActionButton>Add to pursuit queue</ActionButton>
                  <ActionButton>Generate checklist</ActionButton>
                  <ActionButton>Watch addenda</ActionButton>
                  <ActionButton>Export briefing</ActionButton>
                </div>
              </div>
              <Button href="/contact" size="lg">Request CivicBid Pilot</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
