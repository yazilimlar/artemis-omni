import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  Download,
  Eye,
  FileCheck2,
  GitBranch,
  History,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { artemisPublicStructure, type PublicRecordState } from "@/data/artemisPublicStructure";

/**
 * The earlier "Evolution & Structure" system record, moved here unchanged from
 * app/evolution/page.tsx when /evolution became the Evolution Archive (ADR-018).
 * Its public JSON projection is still served at /api/public/artemis-structure.
 */

const stateLabels: Record<PublicRecordState, string> = {
  current: "Current",
  directional: "Directional",
  historical: "Historical",
};

function StateBadge({ state }: { state: PublicRecordState }) {
  return <Badge>{stateLabels[state]}</Badge>;
}

export function StructureRecord() {
  const record = artemisPublicStructure;

  return (
    <>
      <section className="border-b border-border/60 py-12">
        <Container>
          <p className="eyebrow">System structure record</p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{record.statement}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>Record {record.recordVersion}</Badge>
            <Badge>Reviewed {record.lastReviewed}</Badge>
            <Badge>Public-safe projection</Badge>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/api/public/artemis-structure"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm text-gold transition-colors hover:border-gold hover:bg-gold/10"
            >
              <Download className="h-4 w-4" aria-hidden />
              View public structure JSON
            </a>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              Departments Artemis serves
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="How to read this record"
            title="Structure without overstatement"
            description="The labels below separate verified present structure from intended direction and historical milestones. Artemis divisions are architectural and product domains; they are not automatically claims of separate legal entities, staffed business units, or production-ready products."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(Object.keys(record.interpretation) as PublicRecordState[]).map((state) => (
              <Card key={state} className="h-full">
                <StateBadge state={state} />
                <CardTitle className="mt-4 text-lg">{stateLabels[state]}</CardTitle>
                <CardDescription>{record.interpretation[state]}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Multi-division Artemis"
            title="One umbrella, several product domains"
            description="Shared platform capabilities support specialized divisions. Infrastructure and construction are the current flagship public focus, while Atlas, knowledge, finance, media, natural systems, and Labs create room for responsible long-term expansion."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {record.divisions.map((division) => (
              <Card key={division.id} className="flex h-full flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <StateBadge state={division.state} />
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                    {division.status}
                  </span>
                </div>
                <CardTitle className="mt-4 text-lg">{division.name}</CardTitle>
                <CardDescription>{division.mission}</CardDescription>
                <ul className="mt-5 space-y-2 border-t border-border/50 pt-4">
                  {division.examples.map((example) => (
                    <li key={example} className="text-xs leading-relaxed text-foreground/70">
                      • {example}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-navy-deep/20 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Control system"
            title="How Artemis changes without losing its memory"
            description="Architecture, product classification, implementation, verification, promotion, and documentation are separate steps. The process is designed to preserve useful work without allowing experiments or chat history to become accidental authority."
          />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {record.operatingLoop.map((item, index) => (
              <li key={item.step}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 font-mono text-xs text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <CardTitle className="text-base">{item.step}</CardTitle>
                  </div>
                  <CardDescription>{item.detail}</CardDescription>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Branch lifecycle"
            title="Branches are work states, not product identities"
            description="A branch can carry an experiment, testbed, product change, rescue, or governance decision. Product maturity is determined by evidence, public-safety review, and the product record—not by the age or name of a branch."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {record.branchLifecycle.map((stage) => (
              <Card key={stage.name} className="h-full">
                <div className="flex items-center justify-between gap-3">
                  <GitBranch className="h-5 w-5 text-gold" aria-hidden />
                  <StateBadge state={stage.state} />
                </div>
                <CardTitle className="mt-4 text-lg">{stage.name}</CardTitle>
                <CardDescription>{stage.purpose}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Traceability"
            title="Four records, four audiences"
            description="The public page is not the engineering source of truth. It is a controlled projection of that truth, designed for clarity, continuity, and confidence without publishing sensitive operations."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {record.recordLayers.map((layer, index) => {
              const icons = [FileCheck2, Eye, History, Layers3];
              const Icon = icons[index] ?? Boxes;
              return (
                <Card key={layer.name} className="h-full">
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                  <CardTitle className="mt-4 text-lg">{layer.name}</CardTitle>
                  <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-wider text-gold-soft">
                    {layer.audience}
                  </p>
                  <CardDescription>{layer.purpose}</CardDescription>
                  <p className="mt-4 border-t border-border/50 pt-4 text-xs leading-relaxed text-foreground/70">
                    <span className="text-gold">Source:</span> {layer.source}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Evolution"
            title="Milestones are retained, not rewritten"
            description="The record preserves how Artemis changed and why. Later decisions may supersede earlier structures, but the historical milestone remains visible with its date and classification."
          />
          <div className="mt-12 space-y-4">
            {record.milestones.map((milestone) => (
              <Card key={`${milestone.date}-${milestone.title}`}>
                <div className="grid gap-4 md:grid-cols-[9rem_1fr_auto] md:items-start">
                  <p className="font-mono text-xs uppercase tracking-wider text-gold">
                    {milestone.date}
                  </p>
                  <div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    <CardDescription>{milestone.detail}</CardDescription>
                  </div>
                  <StateBadge state={milestone.state} />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-navy-deep/20 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Publication boundary"
            title="Transparent where useful; private where necessary"
            description="The goal is durable public confidence, not indiscriminate disclosure. Artemis publishes structure, evidence labels, review principles, and verified milestones while withholding information whose release would harm clients, security, operations, or future flexibility."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Card>
              <BookOpenCheck className="h-5 w-5 text-gold" aria-hidden />
              <CardTitle className="mt-4 text-lg">Appropriate to publish</CardTitle>
              <ul className="mt-5 space-y-3">
                {record.publicationBoundary.publish.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <ShieldCheck className="h-5 w-5 text-gold" aria-hidden />
              <CardTitle className="mt-4 text-lg">Kept private or restricted</CardTitle>
              <ul className="mt-5 space-y-3">
                {record.publicationBoundary.withhold.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/75">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <Card className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="eyebrow">Continue exploring</p>
              <CardTitle className="mt-3 text-2xl">See the structure expressed through working public surfaces</CardTitle>
              <CardDescription className="max-w-3xl">
                Products show the supported portfolio, Labs show controlled experiments and testbeds, and Departments show the organizational functions Artemis currently serves. This evolution record explains how those surfaces are governed and revised.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gold">
                Products <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/labs" className="inline-flex items-center gap-2 text-sm text-gold">
                Labs <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/departments" className="inline-flex items-center gap-2 text-sm text-gold">
                Departments <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
