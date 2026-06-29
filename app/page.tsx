import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AudienceCard } from "@/components/showcase/AudienceCard";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { ValueChainStrip } from "@/components/showcase/ValueChainStrip";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { createMetadata } from "@/lib/seo/metadata";
import { companyPositioning } from "@/lib/artemis/positioning";
import { getFeaturedAudiences } from "@/data/audiences";
import { getProofModules, homepageProofSlugs } from "@/data/proofLibrary";

export const metadata = createMetadata({
  path: "/",
  description:
    "Artemis turns project fundamentals into AI-enabled execution with an executive-grade bridge across design, geometry, quantities, schedule, field production, cost, revenue, forecast, cashflow, risk, and action.",
});

const proofPreview = getProofModules(homepageProofSlugs);
const audiencePreview = getFeaturedAudiences();

const implementationPhases = [
  {
    phase: "Phase 01",
    title: "Find the decision loop",
    description:
      "Start with the operating decision that changes cost, schedule, cash, quality, or risk.",
    bullets: ["Executive sponsor", "Workflow owner", "Decision cadence"],
  },
  {
    phase: "Phase 02",
    title: "Connect the evidence",
    description:
      "Map the sources, formulas, documents, models, and human review points that make the decision trustworthy.",
    bullets: ["Systems of record", "Assumptions", "Review gates"],
  },
  {
    phase: "Phase 03",
    title: "Build the controlled proof",
    description:
      "Prototype with synthetic or approved data, then prove the operating value before deeper integration.",
    bullets: ["Public-safe demo", "Private pilot", "Adoption metrics"],
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.16]" aria-hidden />
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="test">Executive test mode</StatusBadge>
              <span className="eyebrow">Artemis · AI Implementation</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-[1.05] text-parchment sm:text-5xl lg:text-6xl">
              Turn project fundamentals into AI-enabled execution.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-gold-soft">
              AI is not the strategy. Implementation is the strategy.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Artemis builds the bridge from design and field reality to executive action:
              source-labeled, human-reviewed, cash-aware operating systems for teams that
              need more than disconnected AI tools.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/labs" variant="outline" size="lg">
                Explore Proof Library
              </Button>
              <Button href="/for/executives" variant="ghost" size="lg">
                Audience Pathways
              </Button>
            </div>
          </div>

          <SystemDiagramCard
            title="The Artemis execution bridge"
            description="A lightweight executive model for connecting operating fundamentals to reviewable AI-enabled outputs."
            decision="Which project or workflow signal requires action before it becomes margin, cashflow, or delivery risk?"
            nodes={[
              { label: "Sources", detail: "Design, documents, models, systems", tone: "source" },
              { label: "Logic", detail: "Quantities, formulas, forecast rules", tone: "logic" },
              { label: "Review", detail: "Human gates, assumptions, exceptions", tone: "review" },
              { label: "Action", detail: "Executive decision and next owner", tone: "output" },
            ]}
            outcome="A trusted operating picture with clear confidence, limits, and next action."
          />
        </Container>
        <div className="meander-divider" aria-hidden />
      </section>

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Artemis Bridge"
            title="From project fundamentals to executive action"
            description={`${companyPositioning.beachheadOneLiner} The value chain is deliberately explicit because each handoff is where forecasts, cashflow, and trust usually break.`}
          />
          <div className="mt-10">
            <ValueChainStrip />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Library Preview"
            title="Executive proof, without publishing raw demos"
            description="Labs now works as a public-safe proof library: narrative pages, status badges, system diagrams, and boundary language first; raw private HTML demos stay out of public routes."
            actions={
              <Button href="/labs" variant="outline">
                Open Labs
              </Button>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {proofPreview.map((module) => (
              <ProofCard key={module.slug} module={module} compact />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Audience Pathways"
            title="Generated landing pages for the people who have to implement"
            description="Each pathway reframes the same Artemis operating logic for a different buyer, operator, reviewer, or learner."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {audiencePreview.map((audience) => (
              <AudienceCard key={audience.slug} audience={audience} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Implementation"
            title="The first sprint makes the operating argument visible"
            description="Artemis is positioned as a disciplined implementation system: decide what improves, connect the evidence, prove it safely, then pilot with governance."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {implementationPhases.map((phase) => (
              <ImplementationPhaseCard key={phase.phase} {...phase} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <WhatItIsNotBox
            items={[
              "Not a claim that raw private demos, client workbenches, or project-specific HTML are published.",
              "Not an unmanaged AI chatbot layer placed on top of broken workflows.",
              "Not an autonomous replacement for PMs, engineers, finance leaders, field teams, or reviewers.",
            ]}
          />
          <ConfidenceNote title="Public boundary">
            This sprint keeps public pages in test mode. Showcase pages use executive narrative,
            generic proof structure, diagrams, and clear limitations. Private workbench material
            remains private until it is rebuilt with synthetic or approved data.
          </ConfidenceNote>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-deep/60 p-10 text-center lg:p-16">
            <div
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_hsl(41_64%_56%/0.14),transparent_60%)]"
              aria-hidden
            />
            <p className="eyebrow">Pilot CTA</p>
            <h2 className="display-serif mx-auto mt-4 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Bring one high-value workflow into Artemis test mode
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start with one decision loop, one evidence chain, and one controlled proof.
              Artemis turns that into a pilot-ready implementation path.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge" variant="outline" size="lg">
                View Utility Proof
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
