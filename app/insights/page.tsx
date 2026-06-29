import {
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  FileText,
  Network,
  PenLine,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  claimControlGates,
  contractReasoningModes,
  insightAudiences,
  insightFormats,
  insightPipeline,
  insightTopics,
  learningSources,
  presentationAssignments,
} from "@/data/insightEngine";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "AI Insight & Publication Engine",
  path: "/insights",
  description:
    "A public-safe Artemis publication system for turning field knowledge, controls data, caveats, and AI review into articles, visuals, and implementation lessons.",
});

const heroStats = [
  ["8", "source domains"],
  ["6", "audience lanes"],
  ["6", "article formats"],
  ["1", "review gate"],
];

function InsightSystemDiagram() {
  const nodes = [
    { label: "Field Signals", x: 34, y: 92 },
    { label: "Controls Logs", x: 34, y: 166 },
    { label: "AI Review Board", x: 210, y: 128 },
    { label: "Human Editor", x: 382, y: 92 },
    { label: "Visual Kit", x: 382, y: 166 },
    { label: "Public Insight", x: 560, y: 128 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-navy-deep/65 p-5 shadow-panel">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-[0.08]" aria-hidden="true" />
      <svg
        viewBox="0 0 690 250"
        role="img"
        aria-label="Insight publication engine diagram"
        className="relative min-h-[260px] w-full"
      >
        <defs>
          <linearGradient id="insightLine" x1="0" x2="1">
            <stop offset="0" stopColor="#00CFFF" stopOpacity="0.28" />
            <stop offset="0.52" stopColor="#F2D06B" stopOpacity="0.72" />
            <stop offset="1" stopColor="#00CFFF" stopOpacity="0.42" />
          </linearGradient>
          <filter id="insightGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M138 96 C180 96 174 128 214 128 M138 170 C180 170 174 128 214 128 M306 128 C338 128 346 94 382 94 M306 128 C338 128 346 168 382 168 M474 94 C506 94 512 128 560 128 M474 168 C506 168 512 128 560 128"
          stroke="url(#insightLine)"
          strokeWidth="3"
          fill="none"
          filter="url(#insightGlow)"
        />
        {nodes.map((node, index) => (
          <g key={node.label}>
            <rect
              x={node.x}
              y={node.y - 28}
              width="112"
              height="56"
              rx="10"
              fill={index === nodes.length - 1 ? "#DDB04E" : "#0A1326"}
              fillOpacity={index === nodes.length - 1 ? "0.24" : "0.86"}
              stroke={index === nodes.length - 1 ? "#F2D06B" : "#2B6F8F"}
            />
            <text
              x={node.x + 56}
              y={node.y + 4}
              textAnchor="middle"
              fill={index === nodes.length - 1 ? "#F6E7B8" : "#D8D8D8"}
              fontSize="11"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
        <text
          x="345"
          y="224"
          textAnchor="middle"
          fill="#8EA6B8"
          fontSize="12"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          sanitize {">"} interpret {">"} visualize {">"} review {">"} publish
        </text>
      </svg>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights Engine"
        title="Turn project experience into public intelligence."
        description="Artemis can convert field knowledge, controls data, caveats, safety lessons, payment logic, procurement exposure, and AI review into public-safe articles, visuals, tutorials, and implementation playbooks."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="public">Public-safe publishing</StatusBadge>
          <StatusBadge tone="sanitize">Human reviewed</StatusBadge>
          <StatusBadge tone="synthetic">Synthetic examples</StatusBadge>
        </div>
        <div className="mt-7 flex flex-wrap gap-4">
          <Button href="/library/programs" size="lg">
            Open Source Catalog
          </Button>
          <Button href="/academy" variant="outline" size="lg">
            Academy Articles
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <ConfidenceNote title="Publishing doctrine">
            AI is the drafting and review accelerator. Artemis still requires a human editor,
            source boundary check, caveat review, and public-safe rewrite before anything becomes
            an article, visual, or tutorial.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not automatic publication of private project records.",
              "Not legal, accounting, safety, or claims advice.",
              "Not a claim that AI replaces professional judgment or contract review.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">Publication System</p>
            <h2 className="display-serif mt-3 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
              From messy operating facts to useful public knowledge
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The goal is not content volume. The goal is to turn unseen problems into
              understandable patterns: what happened, what it means, what to watch next,
              which caveats matter, and how teams can implement better controls.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {heroStats.map(([value, label]) => (
                <div key={label} className="border-l border-gold/35 pl-4">
                  <p className="display-serif text-3xl text-gold-soft">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <InsightSystemDiagram />
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Pipeline"
            title="The automation path stays gated by review"
            description="Each article or visual moves through the same operating sequence. The workflow can later become software automation, but the public site already shows the editorial logic."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {insightPipeline.map((stage, index) => (
              <article
                key={stage.title}
                className="rounded-2xl border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-signal-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-gold/25 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                    {stage.artifact}
                  </span>
                </div>
                <h3 className="display-serif mt-4 text-xl text-parchment">{stage.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {stage.summary}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Contract Reasoning"
            title="Deductive, inductive, and abductive controls for contractual action"
            description="Artemis can present the delay and claim workflow as a contract evidence system: the agreement defines the duties, the records reveal patterns, and AI-supported hypotheses are tested before any action is authorized."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {contractReasoningModes.map((mode) => (
              <article
                key={mode.title}
                className="rounded-2xl border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <div className="flex items-center gap-3">
                  <PenLine className="h-5 w-5 text-gold-soft" />
                  <h3 className="display-serif text-xl text-parchment">{mode.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {mode.method}
                </p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-signal-soft">
                      Contract Use
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {mode.contractUse}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/30 p-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-gold-soft">
                      Multi-Model Role
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {mode.aiRole}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-gold/25 bg-navy-deep/55 p-6 shadow-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Control Valve</p>
                <h3 className="display-serif mt-2 text-2xl text-parchment">
                  Timely rights, responsibilities, and evidence checks
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  The presentation story should show Artemis as a disciplined control valve:
                  no claim action, notice, payment position, or public article moves forward
                  until contract basis, responsibility, evidence, impact, and human review
                  have been checked.
                </p>
              </div>
              <StatusBadge tone="sanitize">Reviewed before action</StatusBadge>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {claimControlGates.map((gate) => (
                <article
                  key={gate.title}
                  className="rounded-xl border border-border/60 bg-background/30 p-4"
                >
                  <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                    {gate.output}
                  </p>
                  <h4 className="mt-2 font-semibold text-parchment">{gate.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {gate.checks}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Source Topics"
            title="What Artemis can turn into public insight"
            description="These domains produce the raw material: the facts, caveats, decisions, and implementation lessons that become articles and visuals after sanitization."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {insightTopics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-2xl border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-signal-soft" />
                  <h3 className="display-serif text-xl text-parchment">{topic.title}</h3>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Signal", topic.signal],
                    ["Article Angle", topic.articleAngle],
                    ["Visual", topic.visual],
                  ].map(([label, value]) => (
                    <div key={label} className="border-l border-border/70 pl-4">
                      <p className="font-mono text-[0.6rem] uppercase tracking-wider text-signal-soft">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Article Formats"
            title="Repeatable formats for writing, visuals, and interactive ideas"
            description="The format library lets Artemis publish consistently across executive updates, practical tutorials, AI prompt lessons, and cinematic system stories."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {insightFormats.map((format) => (
              <article
                key={format.title}
                className="rounded-2xl border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <div className="flex items-center justify-between gap-4">
                  <FileText className="h-5 w-5 text-gold-soft" />
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                    {format.cadence}
                  </span>
                </div>
                <h3 className="display-serif mt-4 text-xl text-parchment">{format.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {format.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {format.checks.map((check) => (
                    <li key={check} className="flex gap-2 text-sm text-muted-foreground">
                      <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal-soft" />
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Audience Semantics"
            title="The same insight translated by role"
            description="The article engine should teach different readers without fragmenting the underlying logic. One source pattern can become executive, financial, field, technical, and training content."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {insightAudiences.map((audience) => (
              <article
                key={audience.group}
                className="rounded-2xl border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <BookOpenText className="h-5 w-5 text-signal-soft" />
                <h3 className="display-serif mt-4 text-xl text-parchment">{audience.group}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {audience.learns}
                </p>
                <p className="mt-5 border-t border-border/60 pt-4 text-sm leading-relaxed text-gold-soft">
                  {audience.outcome}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Presentation Assignments</p>
            <h2 className="display-serif mt-3 text-balance text-3xl leading-tight text-parchment sm:text-4xl">
              Assign attached systems under revised public-safe names
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Attached dashboards and tutorials can become presentation material when they
              are renamed, sanitized, and used for method explanation instead of raw record
              publication. The public site should show the operating logic, not the private file.
            </p>
          </div>
          <div className="grid gap-4">
            {presentationAssignments.map((assignment) => (
              <article
                key={assignment.title}
                className="rounded-2xl border border-border/70 bg-background/35 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={assignment.tone}>{assignment.status}</StatusBadge>
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                    Source: {assignment.title}
                  </span>
                </div>
                <h3 className="display-serif mt-4 text-xl text-parchment">
                  {assignment.pseudoName}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {assignment.sourcePattern}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gold-soft">
                  {assignment.presentationUse}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {assignment.publicRule}
                </p>
              </article>
            ))}
            {learningSources.map((source) => (
              <article
                key={source.title}
                className="rounded-2xl border border-border/70 bg-background/35 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={source.tone}>{source.status}</StatusBadge>
                  <Sparkles className="h-4 w-4 text-gold-soft" />
                </div>
                <h3 className="display-serif mt-4 text-xl text-parchment">{source.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {source.pattern}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gold-soft">
                  {source.publishRule}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 shadow-panel lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="eyebrow">Pilot CTA</p>
                <h2 className="display-serif mt-3 max-w-3xl text-balance text-3xl text-parchment sm:text-4xl">
                  Build a public-safe article pipeline from one real operating problem
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Start with one topic, one audience, one source register, one visual language,
                  and one review gate. Then turn the method into repeatable publishing.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button href="/contact" size="lg">
                  Request a Pilot
                </Button>
                <Button href="/library/programs" variant="outline" size="lg">
                  Source Catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
