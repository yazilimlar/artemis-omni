import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { ArtemisEmblem } from "@/components/showcase/ArtemisEmblem";
import { BrandVisualLibrary } from "@/components/showcase/BrandVisualLibrary";
import { BlueprintFluxDiagram } from "@/components/showcase/BlueprintFluxDiagram";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { OrganizationArchitectureDiagram } from "@/components/showcase/OrganizationArchitectureDiagram";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { createMetadata } from "@/lib/seo/metadata";
import { getProofModules } from "@/data/proofLibrary";
import { DianaDemonstrator } from "@/components/labs/DianaDemonstrator";

export const metadata = createMetadata({
  title: "Diana Moonshot / Brand Experience",
  path: "/labs/diana-moonshot",
  description:
    "A public-safe Artemis Labs showcase for executive brand experience, visual proof language, implementation narrative, and product-boundary discipline.",
});

const relatedProofs = getProofModules([
  "diana-moonshot-brand-experience",
  "system-graphics-library",
  "artemis-workbench-shell",
]);

export default function DianaMoonshotPage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Brand Experience"
        title="Diana Moonshot / Brand Experience"
        description="A test-mode brand and experience page for proving that Artemis can feel executive-grade while staying anchored to implementation, governance, and project-controls proof."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="test">Test-mode narrative</StatusBadge>
          <StatusBadge tone="reference">Brand reference</StatusBadge>
          <Button href="/contact" variant="outline">
            Request a Pilot
          </Button>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Interactive Demonstrator"
            title="Orbit the archer mark"
            description="The Diana 3D demonstrator, live in the page. Drag to orbit, scroll to zoom, and use the camera presets inside to direct the shot — brand proof you can play with, not just read about."
          />
          <div className="mt-10">
            <DianaDemonstrator />
            <p className="mt-4 text-xs text-muted-foreground">
              Sample visualization — an interactive 3D brand study. Loads only when you ask
              it to.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SystemDiagramCard
            title="Brand-to-trust loop"
            description="The brand experience has one job: help executives understand the system faster and trust its boundaries sooner."
            decision="Does the experience make the implementation argument clearer, more credible, and easier to act on?"
            nodes={[
              { label: "Executive story", detail: "Problem, value chain, pilot action", tone: "source" },
              { label: "Visual logic", detail: "Diagrams, status, hierarchy, proof cards", tone: "logic" },
              { label: "Boundary review", detail: "Claims, limitations, private material", tone: "review" },
              { label: "Pilot conversion", detail: "Next workflow, owner, evidence chain", tone: "output" },
            ]}
            outcome="A premium public experience that still points back to implementation proof."
          />
          <div className="space-y-5">
            <ConfidenceNote title="Boundary">
              Diana Moonshot is a brand-experience proof, not a claim about current product
              categories beyond Artemis implementation software and the construction-intelligence
              beachhead. It should sharpen trust, not distract from proof.
            </ConfidenceNote>
            <WhatItIsNotBox
              items={[
                "Not a separate product line.",
                "Not current product-capability evidence.",
                "Not decorative visual work that avoids the operating-system argument.",
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Brand Operationalization"
            title="Logo, dashboard, and system diagram become one operating language"
            description="The attached blueprint direction is translated into a clean public pattern: full-color emblem, animated architecture diagram, and executive dashboard surfaces without copying artifact text or raw source files."
          />
          <div className="mt-10 grid items-center gap-5 lg:grid-cols-[0.38fr_1fr]">
            <div className="cinematic-breathe rounded-2xl border border-gold/25 bg-navy-deep/55 p-8 text-center shadow-panel">
              <ArtemisEmblem className="mx-auto h-44 w-44" label="Artemis operational emblem" />
              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-wider text-signal-soft">
                Operational mark study
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Crescent, Delta-A, gold, platinum, and cyan are treated as a cinematic accent
                system. The primary public wordmark remains readable Artemis.
              </p>
            </div>
            <BlueprintFluxDiagram />
          </div>
          <div className="mt-5">
            <OrganizationArchitectureDiagram
              title="Brand system to client operating system"
              subtitle="The logo, dashboard, and architecture language should help a client's leadership team see how their own organization could be mapped without publishing private systems or project artifacts."
              organizationName="Client Company / Organization"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Logo Library"
            title="Curated visual assets for Artemis brand narration"
            description="The attached Artemis/Diana graphics are now represented as optimized public assets and displayed as a labeled concept library. They support cinematic storytelling, logo direction, and material palette without changing current product-scope boundaries."
          />
          <div className="mt-10">
            <BrandVisualLibrary />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Experience System"
            title="A brand sprint is useful only when it improves executive comprehension"
            description="The Diana Moonshot concept becomes public-safe when it is translated into hierarchy, diagrams, proof cards, status language, and pilot paths."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ImplementationPhaseCard
              phase="Layer 01"
              title="Signal"
              description="Create immediate confidence that Artemis is serious, technical, and executive-facing."
              bullets={["Sharper hero", "Clear hierarchy", "Controlled status language"]}
            />
            <ImplementationPhaseCard
              phase="Layer 02"
              title="Proof"
              description="Move quickly from atmosphere into proof modules, diagrams, boundaries, and implementation logic."
              bullets={["Proof cards", "System diagrams", "Confidence notes"]}
            />
            <ImplementationPhaseCard
              phase="Layer 03"
              title="Action"
              description="Convert attention into a specific pilot path instead of a vague brand impression."
              bullets={["Audience pathway", "Pilot CTA", "Decision owner"]}
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Stack"
            title="Related proof modules"
            description="The brand experience is strongest when paired with reusable graphics, a live synthetic shell, and explicit proof-library status."
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
              Turn the executive experience into a pilot pathway
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Pair the brand layer with one real operating decision, one evidence chain, and
              one reviewable implementation proof.
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
