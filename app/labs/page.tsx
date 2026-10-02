import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { BrandVisualLibrary } from "@/components/showcase/BrandVisualLibrary";
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
import { labsEditorial, type LabEditorial } from "@/data/labs-editorial";
import sceneRegistry from "@/data/scene-registry.json";
import { proofModules } from "@/data/proofLibrary";
import {
  linkableRoute,
  loadDivisions,
  loadProducts,
  mergeRegistryOverlay,
  type RegistryProduct,
} from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Labs Proof Library",
  path: "/labs",
  description:
    "Artemis Labs is an executive proof library for public-safe narratives, synthetic showcases, system diagrams, and private-demo boundaries.",
});

function EditorialLabCard({ module }: { module: LabEditorial }) {
  const Icon = module.Icon;
  const AccentIcon = module.accentIcon;
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/50 p-6 shadow-panel transition-colors hover:border-gold/45">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-70"
        aria-hidden
      />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone={module.statusTone}>{module.statusLabel}</StatusBadge>
            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
              {module.eyebrow}
            </span>
          </div>
          <h2 className="display-serif mt-4 text-balance text-2xl text-parchment sm:text-3xl">
            {module.title}
          </h2>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-gold/25 bg-gold/10 text-gold-soft">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {module.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {module.signals.map((signal) => (
          <span
            key={signal}
            className="rounded-full border border-border/60 bg-background/35 px-2.5 py-1 text-xs text-muted-foreground"
          >
            {signal}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-gold/20 bg-gold/5 p-4">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
            <AccentIcon className="h-4 w-4" aria-hidden />
            Revenue Path
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {module.commercialPath}
          </p>
        </div>
        <div className="rounded-md border border-border/60 bg-background/30 p-4">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Review Boundary
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {module.boundary}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button href={module.href}>
          Open Lab
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
        <Button href="/library/programs" variant="outline">
          Catalog Context
        </Button>
      </div>
    </article>
  );
}

function RegistryLabCard({
  product,
  divisionName,
}: {
  product: RegistryProduct;
  divisionName: string;
}) {
  const route = linkableRoute(product);
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/50 p-6 shadow-panel transition-colors hover:border-gold/45">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver/50 to-transparent opacity-70"
        aria-hidden
      />
      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
        {divisionName}
      </span>
      <h2 className="display-serif mt-4 text-balance text-2xl text-parchment sm:text-3xl">
        {product.name}
      </h2>

      {route ? (
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={route}>
            Open Lab
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Button>
        </div>
      ) : null}
    </article>
  );
}

const MORE_LAB_REGISTRY_IDS = ["artemis-nomad", "bidroom-exemplary-contractor"];

export default function LabsPage() {
  const products = loadProducts();
  const labEntries = mergeRegistryOverlay(products, labsEditorial);
  // Site audit F-2 / B-1: registered public_safe_demo labs with no other inbound
  // link (not added to the sitemap: not "public"), plus Botanical, which moved
  // out of the header into Labs.
  const moreLabs = [
    ...MORE_LAB_REGISTRY_IDS.flatMap((id) => {
      const product = products.find((item) => item.id === id);
      const href = product ? linkableRoute(product) : null;
      return product && href ? [{ title: product.name, href }] : [];
    }),
    { title: "Rainbow House Botanical Encyclopedia", href: "/labs/rainbow-house-botanical" },
  ];
  const divisionNames = new Map(loadDivisions().map((division) => [division.id, division.name]));
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
          <Button href="/library/programs" variant="outline">
            Program Index
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Public-safe publishing rule">
            Most Labs pages do not embed raw workbenches, private project files, client
            identifiers, or unreviewed demos. The standalone module section below is the reviewed
            exception path: self-contained public prototypes are wrapped as isolated lab modules
            with explicit limitations, security notes, and commercial next steps.
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

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Standalone Modules"
            title="Reviewed prototypes now become public Artemis Labs"
            description="These modules preserve the original standalone HTML engines for speed and visibility, while the surrounding Artemis site provides route discipline, catalog context, commercial direction, and review boundaries."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {labEntries.map((entry) =>
              entry.editorial ? (
                <EditorialLabCard key={entry.editorial.href} module={entry.editorial} />
              ) : entry.product ? (
                <RegistryLabCard
                  key={entry.product.id}
                  product={entry.product}
                  divisionName={divisionNames.get(entry.product.division) ?? "Unclassified"}
                />
              ) : null,
            )}
          </div>
          {moreLabs.length > 0 ? (
            <p className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm">
              <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                More from Labs
              </span>
              {moreLabs.map((lab) => (
                <Link
                  key={lab.href}
                  href={lab.href}
                  className="text-gold-soft underline-offset-4 hover:underline"
                >
                  {lab.title}
                </Link>
              ))}
            </p>
          ) : null}
        </Container>
      </section>

      {sceneRegistry.length > 0 ? (
        <section className="border-b border-border/60 py-16 lg:py-20">
          <Container>
            <ExecutiveSectionHeader
              eyebrow="Immersive Scenes"
              title="Registered 3D scenes"
              description="Progressive 3D scenes from the scene registry (ADR-015). Each upgrades from a static image only when the device allows it."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {sceneRegistry.map((scene) => (
                <article
                  key={scene.id}
                  className="group relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/50 p-6 shadow-panel transition-colors hover:border-gold/45"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-silver/50 to-transparent opacity-70"
                    aria-hidden
                  />
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                    Scene Registry · {scene.data_mode}
                  </span>
                  <h2 className="display-serif mt-4 text-balance text-2xl text-parchment sm:text-3xl">
                    {scene.title}
                  </h2>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href={scene.route}>
                      Open Scene
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

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
          <div className="mt-12">
            <BrandVisualLibrary variant="preview" />
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
