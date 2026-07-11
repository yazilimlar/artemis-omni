import {
  ArrowRight,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileSearch,
  Landmark,
  Layers3,
  PlugZap,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CivicBidWorkbench } from "@/components/labs/CivicBidWorkbench";
import { CivicBidLiveCockpit } from "@/components/labs/civicbid/CivicBidLiveCockpit";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  civicBidPipeline,
  civicBidProductPillars,
  civicBidRoles,
} from "@/data/civicBid";
import { getProofModules } from "@/data/proofLibrary";
import {
  civicBidSourceRegistry,
  civicBidSourceRegistrySummary,
  formatConnectorMethod,
  formatConnectorStatus,
  formatSourceConfidence,
} from "@/lib/civicbid/sourceRegistry";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "CivicBid Intelligence Bridge",
  path: "/labs/civicbid-intelligence-bridge",
  description:
    "A public Artemis CivicBid route that connects an official NYC solicitation source to transparent contractor triage, source-state controls, pursuit scenarios, compliance review, and executive action.",
});

const civicBidMetricStrip = [
  {
    label: "Live source",
    value: "NYC Current Solicitations",
    detail: "Official public Socrata records are normalized server-side with retrieval timestamps.",
  },
  {
    label: "Source states",
    value: "Live · sample · unavailable",
    detail: "Every response declares whether the source is official, synthetic fallback, or unavailable.",
  },
  {
    label: "Contractor scope",
    value: "Construction-first triage",
    detail: "The default queue filters for declared construction relevance; the full feed remains available.",
  },
  {
    label: "Decision method",
    value: "Deterministic scoring",
    detail: "Five published factors total 100%; scores support triage and never certify a bid decision.",
  },
  {
    label: "Controlling record",
    value: "Official agency documents",
    detail: "Notices, addenda, plans, specifications, eligibility, and submission rules remain controlling.",
  },
] as const;

const civicBidBoundaryChecks = [
  "Live, synthetic-fallback, and source-unavailable states are visibly separated.",
  "Raw upstream payloads, private records, credentials, and unrelated donor code are not published.",
  "The contractor relevance filter is heuristic, disclosed, and reversible through the all-procurement view.",
  "Scores support pursuit triage only; official agency notices and bid documents remain controlling.",
] as const;

const relatedProofs = getProofModules([
  "civicbid-intelligence-bridge",
  "utility-dual-story-cockpit",
  "utility-field-claims-command-workbench",
]);

function CivicBidTerrainVisual() {
  const lanes = [
    ["Official solicitations", "Open public records establish the current opportunity field."],
    ["Contractor relevance", "Declared construction signals separate pursuit candidates from the wider feed."],
    ["Requirements", "Bonding, insurance, prequalification, forms, and M/WBE rules require document review."],
    ["Pursuit room", "Fit score, action owner, confidence, limitation, and next move become reviewable."],
  ] as const;

  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            CivicBid · Opportunity Terrain
          </p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Public source truth becomes pursuit action
          </h2>
        </div>
        <Landmark className="h-6 w-6 text-gold-soft" aria-hidden />
      </div>

      <div className="mt-6 rounded-md border border-border/60 bg-background/30 p-4">
        <div className="grid gap-3">
          {lanes.map(([label, detail], index) => (
            <div
              key={label}
              className="grid min-w-0 grid-cols-[2.5rem_1fr] items-center gap-3"
            >
              <div className="flex h-9 items-center justify-center rounded-md border border-gold/25 bg-gold/10 font-mono text-[0.62rem] text-gold-soft">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="rounded-md border border-border/50 bg-navy-deep/35 p-3">
                <p className="text-sm font-semibold text-parchment">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        The diagram is explanatory. Live opportunities appear only in the governed cockpit below;
        raw upstream rows, private source paths, and certified bid instructions are not exposed.
      </p>
    </div>
  );
}

export default function CivicBidIntelligenceBridgePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-95" aria-hidden />
        <div
          className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.13]"
          aria-hidden
        />
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-20">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="public">Live official source</StatusBadge>
              <StatusBadge tone="synthetic">Explicit sample fallback</StatusBadge>
              <StatusBadge tone="private">Raw payload protected</StatusBadge>
              <span className="eyebrow">Artemis CivicBid Intelligence Bridge</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-tight text-parchment sm:text-5xl lg:text-6xl">
              Civic procurement intelligence, translated into bid-room action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              CivicBid connects an official NYC solicitation source to construction-focused
              opportunity triage, transparent scoring, explicit fallback states, compliance review,
              lifecycle watchlists, and executive pursuit decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#live-signal-forge" size="lg">
                Open Live CivicBid Cockpit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/for/contractors" variant="outline" size="lg">
                Contractor Pathway
              </Button>
              <Button href="/library/programs#civicbid-intelligence-bridge" variant="ghost" size="lg">
                Catalog Entry
              </Button>
            </div>
          </div>

          <CivicBidTerrainVisual />
        </Container>

        <Container className="pb-12">
          <div className="grid gap-3 md:grid-cols-5">
            {civicBidMetricStrip.map((metric) => (
              <div
                key={metric.label}
                className="min-w-0 rounded-md border border-border/60 bg-background/30 p-4"
              >
                <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-parchment">{metric.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Mixed-explicit public source posture">
            This route uses the official NYC Current Solicitations public API when reachable.
            A synthetic fallback is shown only with explicit sample labels, while strict
            live-only requests return an unavailable state rather than fabricated records.
            Every opportunity and score still requires review against the official agency record.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a certified bid calendar, award system, compliance decision, legal opinion, or agency system of record.",
              "Not a silent blend of live and sample records; the current source state is always declared.",
              "Not a public export of raw upstream fields, private records, credentials, or automated bid instructions.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Public Data Spine"
            title="Connector registry for Artemis Bid Atlas"
            description="The registry places the live official connector inside a broader, governed source map. Each source retains its connector method, access posture, confidence, and human-review priority."
          />

          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {[
              ["Registry sources", civicBidSourceRegistrySummary.total, "Public APIs, portals, and manual review links."],
              ["Public API", civicBidSourceRegistrySummary.publicApi, "Socrata JSON and XML POST connectors."],
              ["Manual review", civicBidSourceRegistrySummary.manualReview, "Official pages and deep links."],
              [
                "Login/platform",
                civicBidSourceRegistrySummary.loginOrCommercial,
                "No scraping; use deep links or user exports.",
              ],
            ].map(([label, value, detail]) => (
              <div
                key={label}
                className="rounded-md border border-border/60 bg-background/30 p-4"
              >
                <p className="font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-parchment">{value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-signal-soft/25 bg-signal-soft/10 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal-soft" aria-hidden />
              <p className="text-sm leading-relaxed text-foreground/86">
                Official portals and official bid documents remain the source of truth. CivicBid /
                Artemis Bid Atlas organizes, filters, summarizes, and monitors bid operations.
                AI-extracted or keyword-detected signals require human review before submission.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {civicBidSourceRegistry.map((source) => (
              <article
                key={source.id}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                      Priority {source.connector_priority} · {source.jurisdiction}
                    </p>
                    <h2 className="display-serif mt-2 text-xl text-parchment">{source.name}</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/35 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-muted-foreground">
                    <PlugZap className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                    {formatConnectorStatus(source.connector_status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-border/60 bg-background/30 p-3">
                    <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                      Connector method
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/86">
                      {formatConnectorMethod(source.connector_method)}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-background/30 p-3">
                    <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                      Confidence
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/86">
                      {formatSourceConfidence(source.source_confidence)}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-background/30 p-3">
                    <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                      API endpoint
                    </p>
                    <p className="mt-2 break-words font-mono text-[0.7rem] leading-relaxed text-foreground/86">
                      {source.api_url ?? "Manual / portal review"}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/60 bg-background/30 p-3">
                    <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                      Last checked
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/86">
                      {source.last_checked}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {source.notes}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-soft"
                  >
                    Source URL
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                  {source.api_url ? (
                    <a
                      href={source.api_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-signal-soft hover:text-signal"
                    >
                      API endpoint
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="live-cockpit" className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Live Official Cockpit"
            title="Rank current public opportunities for contractor review"
            description="The canonical CivicBid route now consumes the validated source-state API. Contractor view filters the official citywide feed for declared construction relevance, while all-procurement view preserves source completeness."
          />
          <div className="mt-10">
            <CivicBidLiveCockpit />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Deterministic Scenario Lab"
            title="Explore the broader pursuit operating modes"
            description="These scenario modes remain explicitly synthetic. They demonstrate how live opportunity discovery can connect to solicitation joins, compliance controls, subcontractor strategy, lifecycle watch, and executive review."
          />
          <div className="mt-10">
            <CivicBidWorkbench />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Source-to-Action Pipeline"
            title="Discovery becomes useful only when it reaches the bid room"
            description="The live public source establishes current opportunity terrain. The next product layers join official documents, requirements, partner intelligence, and accountable pursuit controls."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {civicBidPipeline.map((item) => (
              <article
                key={item.step}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {item.step}
                </p>
                <h2 className="mt-3 text-sm font-semibold text-parchment">{item.label}</h2>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Product System"
            title="Six CivicBid modules extend the live opportunity front door"
            description="The validated cockpit is the discovery layer. The wider product family adds matchmaker, lifecycle, compliance, data custody, and executive briefing capabilities."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {civicBidProductPillars.map((pillar, index) => {
              const Icon = [Search, Users, Bell, ShieldCheck, Database, ClipboardCheck][index];
              return (
                <article
                  key={pillar.title}
                  className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
                >
                  {Icon ? <Icon className="h-5 w-5 text-gold-soft" aria-hidden /> : null}
                  <h2 className="display-serif mt-4 text-xl text-parchment">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {pillar.signals.map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-border/60 bg-background/35 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Discipline Translation"
            title="Every pursuit owner reads the same source chain differently"
            description="CivicBid is useful only if public procurement records become the working language of business development, estimating, compliance, and executive review."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {civicBidRoles.map((item) => (
              <article
                key={item.role}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {item.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.dialect}
                </p>
                <p className="mt-4 rounded-md border border-signal-soft/20 bg-signal-soft/10 p-3 text-xs leading-relaxed text-signal-soft">
                  {item.question}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Publication QA"
            title="What is live, what is synthetic, and what remains protected"
            description="The public route keeps source state, relevance filtering, scoring limitations, and the official-record boundary visible."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {civicBidBoundaryChecks.map((check) => (
              <article
                key={check}
                className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden />
                <p className="mt-4 text-sm leading-relaxed text-emerald-50/85">{check}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Related Proof"
            title="Connect CivicBid to the contractor operating system"
            description="CivicBid handles the pursuit front door; Utility Bridge handles field-to-cash execution after the work is won."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {relatedProofs.map((module) => (
              <ProofCard key={module.slug} module={module} compact />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 text-center lg:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold-soft">
              <Building2 className="h-6 w-6" aria-hidden />
            </div>
            <p className="eyebrow mt-5">Private Pilot Gate</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Use CivicBid when the contractor team needs opportunity radar before execution control.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The right pilot extends the official public connector with document custody,
              human-reviewed compliance extraction, accountable pursuit ownership, and no silent
              procurement or CRM write-back.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact?module=CivicBid%20Intelligence%20Bridge" size="lg">
                Request a CivicBid Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge/dual-story" variant="outline" size="lg">
                Compare Utility Execution
              </Button>
              <Button href="/library/programs#civicbid-intelligence-bridge" variant="ghost" size="lg">
                Catalog Entry
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <Layers3 className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Native route
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <FileSearch className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Live official source
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <CalendarClock className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Human review required
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
