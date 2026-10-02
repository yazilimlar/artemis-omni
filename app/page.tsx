import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BlueprintFluxDiagram } from "@/components/showcase/BlueprintFluxDiagram";
import { AudienceCard } from "@/components/showcase/AudienceCard";
import { CinematicStoryPanel } from "@/components/showcase/CinematicStoryPanel";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { GeodesicRenderCard } from "@/components/showcase/GeodesicRenderCard";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { LiveDashboardCard } from "@/components/showcase/LiveDashboardCard";
import { OrganizationArchitectureDiagram } from "@/components/showcase/OrganizationArchitectureDiagram";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { ValueChainStrip } from "@/components/showcase/ValueChainStrip";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { HomeHeroScene } from "@/components/scenes/site-hero/HomeHeroScene";
import { createMetadata } from "@/lib/seo/metadata";
import { companyPositioning } from "@/lib/artemis/positioning";
import { getFeaturedAudiences } from "@/data/audiences";
import { getProofModules, homepageProofSlugs } from "@/data/proofLibrary";
import sceneRegistry from "@/data/scene-registry.json";

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

// ADR-016: the single registered homepage hero scene (route "/"), if any.
const heroScene = sceneRegistry.find((scene) => scene.route === "/") ?? null;

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
              <Button href="/labs/civicbid-intelligence-bridge" variant="ghost" size="lg">
                CivicBid Demo
              </Button>
            </div>
          </div>

          <LiveDashboardCard
            title="A living execution dashboard"
            subtitle="Animated proof of the operating story: forecast corridor, data flux, confidence, exposure, and action."
            variant="cashflow"
          />
        </Container>
        <div className="meander-divider" aria-hidden />
      </section>

      {heroScene ? (
        <section className="border-b border-border/60 py-12 lg:py-16" aria-label={heroScene.title}>
          <Container className="flex justify-center">
            <HomeHeroScene
              fallbackSrc={heroScene.fallback_2d.replace(/^public(?=\/)/, "")}
              fallbackAlt={`${heroScene.title}: static preview`}
              maxSessionSeconds={heroScene.resource_limits.max_session_seconds}
              fpsFloor={heroScene.resource_limits.fps_floor}
            />
          </Container>
        </section>
      ) : null}

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
          <div className="mt-8">
            <BlueprintFluxDiagram />
          </div>
          <div className="mt-8">
            <OrganizationArchitectureDiagram
              title="Client organization blueprint"
              subtitle="A boardroom-safe visual model for how Artemis would map a client company: operating inputs, governance, workflow evidence, review gates, executive dashboards, reports, action logs, and pilot roadmaps."
              organizationName="Client Company / Organization"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Cinematic Operating Story"
            title="The site now shows motion with purpose"
            description="The visual layer is not decoration. It narrates the movement from disconnected field signals into reviewed forecasts, system projections, and executive action."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <CinematicStoryPanel
              title="From signal to decision"
              summary="A pilot story should unfold like an executive review: what changed, what it affects, who reviews it, and what action follows."
              scenes={[
                {
                  label: "Scene 01",
                  title: "Field reality moves first",
                  body: "Production, blockers, quantities, and change signals update before the monthly report can explain them.",
                },
                {
                  label: "Scene 02",
                  title: "Artemis connects the evidence",
                  body: "Design, schedule, actual cost, billing, and PM judgment become one reviewed operating chain.",
                },
                {
                  label: "Scene 03",
                  title: "Executives get action, not noise",
                  body: "The output is a forecast range, confidence note, risk/opportunity flag, and named owner for next action.",
                },
              ]}
            />
            <GeodesicRenderCard
              title="3D geometry without publishing private models"
              caption="The geodesic render suggests depth, fabrication logic, and spatial intelligence while staying SVG/CSS-only and public-safe."
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Library Preview"
            title="Executive proof, without publishing raw demos"
            description="Labs now works as a public-safe proof library: narrative pages, status badges, system diagrams, and boundary language first; raw private HTML demos stay out of public routes."
            actions={
              <div className="flex flex-wrap gap-3">
                <Button href="/labs" variant="outline">
                  Open Labs
                </Button>
                <Button href="/workbench" variant="ghost">
                  Geometric Workbench
                </Button>
              </div>
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
              <Button href="/labs/utility-intelligence-bridge/dual-story" variant="outline" size="lg">
                View RC8.4 Utility Demo
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
