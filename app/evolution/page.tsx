import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { AdrSupersessionGraph } from "@/components/evolution/AdrSupersessionGraph";
import { ArchitectureMap } from "@/components/evolution/ArchitectureMap";
import { EvolutionTimeline } from "@/components/evolution/EvolutionTimeline";
import { RegistryFlow } from "@/components/evolution/RegistryFlow";
import { StatsPanel } from "@/components/evolution/StatsPanel";
import { StructureRecord } from "@/components/evolution/StructureRecord";
import scenes from "@/data/scene-registry.json";
import { requireAuth } from "@/lib/auth/require-auth";
import { loadEvolution } from "@/lib/evolution/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Evolution Archive",
  path: "/evolution",
  description: "Internal Evolution Archive: how the Artemis platform was built, in data.",
  noIndex: true,
});

const MAP_SCENE = "evolution-architecture-map";

export default async function EvolutionPage() {
  await requireAuth();
  const { events, stats, generated_at } = loadEvolution();
  const map = scenes.find((scene) => scene.id === MAP_SCENE);

  return (
    <>
      <PageHero
        eyebrow="Internal · Evolution Archive"
        title="Artemis Evolution Archive"
        description="How the platform was built, in data."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>noindex</Badge>
          <Badge>generated from the repository</Badge>
          <a href="/api/evolution-data" className="text-sm text-gold-soft underline-offset-4 hover:underline">
            Explore the raw data →
          </a>
        </div>
      </PageHero>

      <StatsPanel stats={stats} generatedAt={generated_at} />

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Timeline"
            title="Every recorded event, oldest to newest"
            description="Decisions, products, scenes, milestones and merged changes, grouped by month. Route events are hidden by default."
          />
          <div className="mt-8">
            <EvolutionTimeline events={events} />
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="ADR Lineage"
            title="Decisions and what replaced them"
            description="One row per ADR on its date. Arrows run from a superseded decision to its replacement."
          />
          <div className="mt-8">
            <AdrSupersessionGraph events={events} />
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Registry Flow"
            title="Products by lifecycle status over time"
            description="Reconstructed from the registry's git history."
          />
          <div className="mt-8">
            <RegistryFlow events={events} />
          </div>
        </Container>
      </section>

      {map ? (
        <section className="border-b border-border/60 py-12 lg:py-16">
          <Container>
            <ExecutiveSectionHeader
              eyebrow="Architecture Map"
              title="How the parts connect"
              description="Registries, scripts, routes and services, with the direction of data flow."
            />
            <div className="mt-8">
              <ArchitectureMap
                fallbackSrc={map.fallback_2d.replace(/^public(?=\/)/, "")}
                maxSessionSeconds={map.resource_limits.max_session_seconds}
                fpsFloor={map.resource_limits.fps_floor}
              />
            </div>
          </Container>
        </section>
      ) : null}

      <StructureRecord />
    </>
  );
}
