import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { LiveDashboardCard } from "@/components/showcase/LiveDashboardCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { audiences, getAudiencePage } from "@/data/audiences";
import { getProofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

const nodeTones = ["source", "logic", "review", "output"] as const;
const nodeDetails = [
  "Source evidence",
  "Applied operating logic",
  "Human review point",
  "Decision output",
] as const;

function getDashboardVariant(slug: string): "cashflow" | "flux" | "field" {
  if (["contractors", "project-managers", "technicians", "crews", "engineers"].includes(slug)) {
    return "field";
  }
  if (["cfos", "executives", "board-teams", "holdings"].includes(slug)) {
    return "cashflow";
  }
  return "flux";
}

export const dynamicParams = false;

export function generateStaticParams() {
  return audiences.map((audience) => ({ slug: audience.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const audience = getAudiencePage(slug);
  if (!audience) {
    return createMetadata({ title: "Not found", path: `/for/${slug}`, noIndex: true });
  }

  return createMetadata({
    title: `For ${audience.label}`,
    path: `/for/${audience.slug}`,
    description: audience.summary,
  });
}

export default async function AudienceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const audience = getAudiencePage(slug);
  if (!audience) notFound();

  const proofModules = getProofModules(audience.proofModuleSlugs);
  const dashboardVariant = getDashboardVariant(audience.slug);
  const diagramNodes = audience.connects.slice(0, 4).map((label, index) => ({
    label,
    detail: nodeDetails[index] ?? "Operating signal",
    tone: nodeTones[index] ?? "source",
  }));

  return (
    <>
      <PageHero
        eyebrow={`For ${audience.label}`}
        title={audience.headline}
        description={audience.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="test">Generated landing page</StatusBadge>
          <StatusBadge tone="public">Public-safe copy</StatusBadge>
          <Button href="/contact" variant="outline">
            {audience.cta}
          </Button>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Pain Points"
            title={`Where Artemis helps ${audience.label}`}
            description="The page starts with operational pressure, then ties the pressure to connected evidence, proof modules, and an implementation path."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audience.painPoints.map((point, index) => (
              <Card key={point} className="h-full">
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  Pressure {String(index + 1).padStart(2, "0")}
                </span>
                <CardDescription className="mt-4 text-sm">{point}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <SystemDiagramCard
            title="What Artemis connects"
            description="Audience-specific implementation starts by making the source chain explicit."
            decision="Which operating decision improves when the evidence is connected and reviewed?"
            nodes={diagramNodes}
            outcome="A reviewed operating view that turns connected evidence into action."
          />
          <ConfidenceNote title="Public-safe audience page">
            This route uses generalized audience copy and proof-module references. It does
            not include client facts, private project data, financial account data, backend
            integrations, analytics, or form wiring.
          </ConfidenceNote>
        </Container>
        <Container className="mt-5">
          <LiveDashboardCard
            title={`${audience.label} operating pulse`}
            subtitle="A lightweight animated view of connected signals, confidence, exposure, and next action."
            variant={dashboardVariant}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Implementation Pathway"
            title="From workflow diagnosis to controlled proof"
            description="The same Artemis method adapts to the audience: start with a real decision loop, prove the evidence chain safely, then train the operating cadence."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {audience.pathway.map((step, index) => (
              <ImplementationPhaseCard
                key={step}
                phase={`Step ${String(index + 1).padStart(2, "0")}`}
                title={
                  [
                    "Diagnose",
                    "Map",
                    "Prototype",
                    "Operationalize",
                  ][index] ?? "Implement"
                }
                description={step}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Modules"
            title="Proof paths matched to this audience"
            description="These proof modules are the safest public entry points for the audience pathway."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {proofModules.map((module) => (
              <ProofCard key={module.slug} module={module} compact />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Expected Outcomes"
            title="What the first controlled pilot should prove"
            description="Outcomes stay practical: better visibility, clearer assumptions, safer review, and a path from test mode to operating cadence."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audience.outcomes.map((outcome) => (
              <Card key={outcome} className="h-full">
                <CardTitle className="text-lg">Expected outcome</CardTitle>
                <CardDescription>{outcome}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 text-center lg:p-12">
            <p className="eyebrow">Audience CTA</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              {audience.cta}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Start with one workflow, one evidence chain, and one reviewable proof before
              deeper integration work begins.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/labs" variant="outline" size="lg">
                View Proof Library
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
