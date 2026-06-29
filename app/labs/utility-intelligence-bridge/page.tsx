import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { createMetadata } from "@/lib/seo/metadata";
import { getProofModules } from "@/data/proofLibrary";

export const metadata = createMetadata({
  title: "Utility Intelligence Bridge",
  path: "/labs/utility-intelligence-bridge",
  description:
    "A public-safe Artemis Labs showcase for utility and heavy-civil intelligence: design, geometry, field production, actual cost, billing, forecast exposure, and executive action.",
});

const relatedProofs = getProofModules([
  "forecast-exposure-control-center",
  "artemis-workbench-shell",
  "system-graphics-library",
]);

export default function UtilityIntelligenceBridgePage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Public-Safe Showcase"
        title="Utility Intelligence Bridge"
        description="A narrative proof page for utility and heavy-civil programs: connect the work package, the field, the forecast, and the executive action without publishing raw private project material."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="public">Public narrative</StatusBadge>
          <StatusBadge tone="private">Private demo protected</StatusBadge>
          <Button href="/contact" variant="outline">
            Request a Pilot
          </Button>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SystemDiagramCard
            title="Utility bridge system"
            description="A work-package operating view that ties field status to commercial exposure and executive action."
            decision="Which utility scope needs intervention before variance becomes cashflow loss or schedule delay?"
            nodes={[
              { label: "Design + geometry", detail: "Packages, alignments, conflicts", tone: "source" },
              { label: "Production logic", detail: "Quantities, crews, schedule windows", tone: "logic" },
              { label: "PM review", detail: "Assumptions, exceptions, owner action", tone: "review" },
              { label: "Executive action", detail: "Risk, opportunity, cashflow, next owner", tone: "output" },
            ]}
            outcome="A source-labeled bridge from project fundamentals to action-ready forecast exposure."
          />
          <div className="space-y-5">
            <ConfidenceNote title="Boundary">
              This page does not include agency names, project identifiers, coordinates, maps,
              source HTML, or private workbench logic. It describes the public-safe product
              pattern that a controlled pilot can implement with approved data.
            </ConfidenceNote>
            <WhatItIsNotBox
              items={[
                "Not a published private utility workbench.",
                "Not a map or 3D model migration.",
                "Not a forecast that bypasses PM, finance, or executive review.",
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="What Artemis Connects"
            title="The utility value chain is field-to-finance"
            description="The bridge is credible because it keeps the technical and commercial realities in the same reviewable system."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                phase: "01",
                title: "Work package",
                description: "Design, geometry, quantity basis, constraints, and schedule context.",
              },
              {
                phase: "02",
                title: "Field production",
                description: "Installed quantities, crew progress, blockers, and exceptions.",
              },
              {
                phase: "03",
                title: "Commercial layer",
                description: "Actual cost, billing revenue, change exposure, and cash timing.",
              },
              {
                phase: "04",
                title: "Executive action",
                description: "Risk, opportunity, forecast confidence, owner, and next decision.",
              },
            ].map((phase) => (
              <ImplementationPhaseCard key={phase.phase} {...phase} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Stack"
            title="Related proof modules"
            description="The utility bridge becomes stronger when paired with exposure ranges, a reusable workbench shell, and a diagram standard executives can inspect."
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
            <p className="eyebrow">Pilot CTA</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Build the first utility intelligence bridge on approved scope
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Start with one work package, one forecast period, and one decision owner.
              Prove the field-to-finance loop before expanding the bridge.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/labs" variant="outline" size="lg">
                Back to Proof Library
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
