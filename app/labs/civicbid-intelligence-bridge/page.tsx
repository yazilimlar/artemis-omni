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
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CivicBidWorkbench } from "@/components/labs/CivicBidWorkbench";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import {
  civicBidBoundaryChecks,
  civicBidMetricStrip,
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
    "A public-safe Artemis CivicBid route that turns public procurement award/status intelligence into contractor opportunity radar, solicitation joins, compliance review, lifecycle watch, and executive pursuit action.",
});

const relatedProofs = getProofModules([
  "civicbid-intelligence-bridge",
  "utility-dual-story-cockpit",
  "utility-field-claims-command-workbench",
]);

function CivicBidTerrainVisual() {
  const lanes = [
    ["Awards / status", "Public fragments identify terrain, not final bid action."],
    ["Solicitations", "Due dates, addenda, pre-bid meetings, and plan/spec files."],
    ["Requirements", "Bonding, insurance, prequalification, forms, and M/WBE rules."],
    ["Pursuit room", "Fit score, action owner, confidence, limitation, and next move."],
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
            Procurement fragments become pursuit action
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
        This is a rebuilt diagram concept. It does not include raw RC1 payload rows, vendor lists,
        contract identifiers, exact ledger values, private source paths, or live bid-deadline data.
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
              <StatusBadge tone="synthetic">RC1 public-safe rebuild</StatusBadge>
              <StatusBadge tone="private">Raw payload protected</StatusBadge>
              <span className="eyebrow">Artemis CivicBid Intelligence Bridge</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-tight text-parchment sm:text-5xl lg:text-6xl">
              Civic procurement intelligence, translated into bid-room action.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              CivicBid upgrades the attached RC1 concept into a public Artemis product route:
              public award/status fragments become market terrain, solicitation joins, compliance
              checklists, subcontractor maps, lifecycle watchlists, and executive pursuit decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#civicbid-workbench" size="lg">
                Open CivicBid Cockpit
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
          <ConfidenceNote title="Public-safe RC1 posture">
            This route publishes the CivicBid product story as a native Artemis page with
            representative indices and deterministic interactions. It does not publish the
            attached HTML, embedded record payload, vendor table, contract IDs, EPINs, row-level
            amounts, private source paths, or a live procurement feed.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a live bid calendar, award system, compliance decision, legal advice, or certified procurement record.",
              "Not an iframe around the single-file RC1 cockpit.",
              "Not a public export of row-level agency, vendor, contract, payment, or status records.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Public Data Spine"
            title="Connector registry for Artemis Bid Atlas"
            description="This layer makes the next CivicBid build concrete without turning the public page into a live bid system. Sources are classified by connector method, public/API posture, confidence, and manual-review priority."
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
                Artemis Bid Atlas organizes, summarizes, and monitors bid operations. AI-extracted
                checklists require human review before submission.
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
            eyebrow="Live Cockpit"
            title="Run the CivicBid pursuit intelligence modes"
            description="The enhanced route focuses on the strongest product move from RC1: move from public market terrain into a bid-room operating system with due dates, addenda, requirements, partner maps, and executive review."
          />
          <div className="mt-10">
            <CivicBidWorkbench />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Source-to-Action Pipeline"
            title="The right next join is solicitations, not more raw table publishing"
            description="RC1 already proves market intelligence value. The public route makes the next product step explicit: join live bid data and documents, then route it through reviewable pursuit controls."
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

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Product System"
            title="Six CivicBid modules that turn RC1 into a contractor product"
            description="The attached cockpit points to a full product family: radar, matchmaker, lifecycle monitor, compliance copilot, data lake, and briefing engine."
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

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Discipline Translation"
            title="Every pursuit owner reads the same source chain differently"
            description="CivicBid is useful only if public procurement fragments become the working language of business development, estimating, compliance, and executive review."
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

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Publication QA"
            title="What changed for the public route and what stayed protected"
            description="These checks are visible because CivicBid must make the public/private boundary as clear as the product promise."
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

      <section className="border-y border-border/60 py-16 lg:py-20">
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

      <section className="py-16 lg:py-24">
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
              The right pilot starts with approved public-source connectors, live solicitation
              joins, document custody, human-reviewed compliance extraction, and no silent
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
                Solicitation join next
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <CalendarClock className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Not a live deadline feed
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
