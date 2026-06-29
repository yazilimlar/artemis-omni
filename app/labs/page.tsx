import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { BlueprintFluxDiagram } from "@/components/showcase/BlueprintFluxDiagram";
import { CinematicStoryPanel } from "@/components/showcase/CinematicStoryPanel";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { GeodesicRenderCard } from "@/components/showcase/GeodesicRenderCard";
import { LiveDashboardCard } from "@/components/showcase/LiveDashboardCard";
import { OrganizationArchitectureDiagram } from "@/components/showcase/OrganizationArchitectureDiagram";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { ValueChainStrip } from "@/components/showcase/ValueChainStrip";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { proofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Labs Proof Library",
  path: "/labs",
  description:
    "Artemis Labs is an executive proof library for public-safe narratives, synthetic showcases, system diagrams, and private-demo boundaries.",
});

export default function LabsPage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Executive Proof Library"
        title="Proof that Artemis is an implementation system, not a chatbot wrapper."
        description="Labs organizes the strongest Artemis proof paths into public-safe narrative pages, status-labeled cards, diagram systems, and clear private-demo boundaries."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="test">Test mode</StatusBadge>
          <StatusBadge tone="synthetic">Synthetic where live</StatusBadge>
          <StatusBadge tone="private">Private demos protected</StatusBadge>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Public-safe publishing rule">
            These pages do not embed raw HTML workbenches, private project files, maps,
            coordinates, client identifiers, or unreviewed demos. Public pages use executive
            narrative, generic proof structure, synthetic examples, and explicit limitations.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a public archive of private demo assets.",
              "Not a claim that every reference is migration-ready.",
              "Not a replacement for human review, project controls judgment, or engineering approval.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Visual Proof Engine"
            title="Cinematic proof without raw demo embedding"
            description="The new visual layer borrows the safe direction from the attached references: living dashboards, flux diagrams, geodesic renders, and story scenes rebuilt as public-safe SVG/CSS components."
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <LiveDashboardCard variant="flux" />
            <GeodesicRenderCard />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <CinematicStoryPanel
              title="The proof library should move like an executive demo"
              summary="The motion system points to the decision chain, not to spectacle. Every animated surface is tied to source, logic, review, output, and limitation."
              scenes={[
                {
                  label: "Frame 01",
                  title: "Signal enters",
                  body: "A field, model, finance, or governance signal enters the operating chain.",
                },
                {
                  label: "Frame 02",
                  title: "Logic applies",
                  body: "Quantities, schedule rules, forecast assumptions, and cashflow logic turn it into a reviewable issue.",
                },
                {
                  label: "Frame 03",
                  title: "Action exits",
                  body: "The executive view shows confidence, limitation, owner, and next step.",
                },
              ]}
            />
            <BlueprintFluxDiagram />
          </div>
          <div className="mt-5">
            <OrganizationArchitectureDiagram
              mode="labs"
              title="Client organization architecture"
              subtitle="Labs proof gets more credible when every module can be placed inside a client operating system: inputs, governance, workflow, evidence, review, output, and action."
              organizationName="Public-Safe Client Blueprint"
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Cards"
            title="The first public proof library"
            description="Each card names the executive decision, the connected signals, the expected outcomes, and the publishing boundary."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {proofModules.map((module) => (
              <ProofCard key={module.slug} module={module} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Bridge Logic"
            title="Every proof path resolves into the same executive chain"
            description="The proof library is useful because it keeps returning to the operating chain: what connects, what logic applies, who reviews it, and what action follows."
          />
          <div className="mt-10">
            <ValueChainStrip />
          </div>
          <div className="mt-10">
            <SystemDiagramCard
              title="Six-question proof standard"
              description="A Labs proof is not finished until it answers the questions an executive or reviewer will ask."
              decision="What decision improves, and who owns the next action?"
              nodes={[
                { label: "Connected data", detail: "Sources and systems of record", tone: "source" },
                { label: "Applied logic", detail: "Formula, mapping, model, or rule", tone: "logic" },
                { label: "Human review", detail: "Gate, exception, or approval point", tone: "review" },
                { label: "Trusted output", detail: "Forecast, register, score, or action", tone: "output" },
              ]}
              outcome="A proof card with confidence level, limitation language, and a pilot path."
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 text-center lg:p-12">
            <p className="eyebrow">Pilot Program</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Convert one proof path into a controlled pilot
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Select a decision loop, connect the evidence, define review gates, and test the
              Artemis operating model on synthetic or approved data first.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge" variant="outline" size="lg">
                Start with Utility Intelligence
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
