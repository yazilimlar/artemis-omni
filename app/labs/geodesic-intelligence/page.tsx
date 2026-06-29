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
  title: "Geodesic Intelligence",
  path: "/labs/geodesic-intelligence",
  description:
    "A public-safe Artemis Labs showcase for spatial project intelligence: survey context, alignment logic, work zones, field observations, production quantities, and risk flags.",
});

const relatedProofs = getProofModules([
  "geodesic-intelligence-workbench",
  "model-to-money-inspector",
  "geometry-qa-plan-editing-sandbox",
]);

export default function GeodesicIntelligencePage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Public-Safe Showcase"
        title="Geodesic Intelligence Workbench"
        description="A spatial-controls narrative for connecting survey context, alignment logic, work zones, field observations, and commercial exposure without publishing raw maps or project identifiers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="public">Public narrative</StatusBadge>
          <StatusBadge tone="reference">No raw coordinates</StatusBadge>
          <Button href="/contact" variant="outline">
            Request a Pilot
          </Button>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SystemDiagramCard
            title="Spatial-to-commercial loop"
            description="A geodesic view is valuable only when location context resolves into schedule, production, cost, and risk decisions."
            decision="Where does spatial variance create a project-controls decision this week?"
            nodes={[
              { label: "Spatial sources", detail: "Survey control, alignment, zones", tone: "source" },
              { label: "Constraint logic", detail: "Access, sequence, conflicts, quantities", tone: "logic" },
              { label: "Field review", detail: "Observation status and QA notes", tone: "review" },
              { label: "Exposure output", detail: "Risk, opportunity, owner action", tone: "output" },
            ]}
            outcome="A location-aware risk conversation that remains reviewable and commercially relevant."
          />
          <div className="space-y-5">
            <ConfidenceNote title="Boundary">
              This public page uses no map tiles, raw coordinates, private models, owner names,
              or project geography. It describes a system pattern for future controlled demos.
            </ConfidenceNote>
            <WhatItIsNotBox
              items={[
                "Not a live GIS portal.",
                "Not a public release of survey or alignment files.",
                "Not a substitute for engineering, survey, or field verification.",
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Implementation Pathway"
            title="Spatial intelligence has to earn trust before it becomes a demo"
            description="The safe path is not to publish maps. The safe path is to define the decision, then prove which spatial signals can be shown, reviewed, and acted on."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ImplementationPhaseCard
              phase="Step 01"
              title="Define the spatial decision"
              description="Select the schedule, access, conflict, quantity, or field-production question the workbench must improve."
              bullets={["Decision owner", "Review cadence", "Escalation threshold"]}
            />
            <ImplementationPhaseCard
              phase="Step 02"
              title="Sanitize the spatial layer"
              description="Replace sensitive maps and coordinates with approved abstractions or synthetic geometry."
              bullets={["No raw coordinates", "No project identifiers", "No private tiles"]}
            />
            <ImplementationPhaseCard
              phase="Step 03"
              title="Tie location to money"
              description="Connect spatial exceptions to quantity, schedule, cost, risk, and executive action."
              bullets={["Quantity effect", "Schedule effect", "Commercial exposure"]}
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Stack"
            title="Related proof modules"
            description="Geodesic intelligence becomes executive-grade when it connects to model QA, plan editing boundaries, and commercial traceability."
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
              Start with one spatial decision and one approved abstraction
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The first pilot can prove the loop without exposing maps, coordinates, or
              project geography on public routes.
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
