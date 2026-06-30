import { ArrowRight, CircuitBoard, Library, ShieldCheck, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { ArtemisIX19Generator } from "@/components/labs/ArtemisIX19Generator";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import {
  artemisIX19AssetProfiles,
  artemisIX19SolutionIntents,
  artemisIX19SolutionTerrains,
  artemisIX19Sources,
} from "@/data/artemisIX19";
import { getProofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "ArtemisIX19 Autonomous Generator",
  path: "/labs/artemisix19",
  description:
    "ArtemisIX19 is a public-safe autonomous generator studio with a two-click client solution path, triangle convergence, local package vault, Markdown export, and media package outputs.",
});

const relatedProofs = getProofModules([
  "artemisix19-autonomous-generator",
  "geodesic-intelligence-workbench",
  "diana-moonshot-brand-experience",
]);

export default function ArtemisIX19Page() {
  return (
    <>
      <PageHero
        eyebrow="Labs · ArtemisIX19"
        title="Autonomous client solution and media generator for the Artemis reference library."
        description="A public-safe branch of the Artemis proof system: two clicks identify a client purpose and operating terrain, the third click locks the triangle, and the page generates prompts, image briefs, render plans, video storyboards, plots, movie beats, sound cues, daily learning streams, and exportable local packages."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="test">ArtemisIX19</StatusBadge>
          <StatusBadge tone="synthetic">Autonomous rules engine</StatusBadge>
          <StatusBadge tone="private">Raw sources protected</StatusBadge>
          <Button href="#generator" variant="outline">
            Open Generator
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Copy and branch rule">
            ArtemisIX19 is implemented as a separate route and data library on a dedicated git
            branch. The public app gets a clean generator surface; raw Desktop HTML references
            remain protected and are represented only through sanitized source families.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not an iframe wrapper around local HTML files.",
              "Not an external AI API integration or secret-dependent workflow.",
              "Not live news scraping, automatic publishing, or unsupervised public release.",
              "Not a publication of unverified fabrication values, coordinates, or private assets.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Operating Model"
            title="One autonomous generator, seven output modes"
            description="The generator makes a deterministic media package from a selected client path, Artemis source family, audience, privacy mode, and intensity setting. Every output includes a boundary rule."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Wand2,
                title: "Auto Prompt",
                body: "Multi-model-ready instructions with source signals, constraints, and acceptance checks.",
              },
              {
                icon: CircuitBoard,
                title: "Render + Plot",
                body: "3D/SVG render plans, chart concepts, confidence labels, and inspection overlays.",
              },
              {
                icon: Library,
                title: "Content Library",
                body: "Source families are organized into reusable signals, output angles, and migration boundaries.",
              },
              {
                icon: ShieldCheck,
                title: "Safety Gate",
                body: "Public-safe mode blocks raw source embedding, private identifiers, and unverified claims.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
                >
                  <Icon className="h-6 w-6 text-gold-soft" aria-hidden />
                  <h2 className="display-serif mt-4 text-xl text-parchment">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Client Flow"
            title="Two clicks identify the solution; the triangle locks the point"
            description="The visitor starts with purpose and terrain, then uses the triangle as a convergence action. The generated package changes around the selected point, purpose, and meaning."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-navy-deep/45 p-6 shadow-panel">
              <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                Click 1 · Purpose
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {artemisIX19SolutionIntents.map((intent) => (
                  <article
                    key={intent.id}
                    className="rounded-md border border-border/60 bg-background/25 p-4"
                  >
                    <h2 className="text-sm font-semibold text-parchment">{intent.label}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {intent.question}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border/70 bg-navy-deep/45 p-6 shadow-panel">
              <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                Click 2 · Terrain
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {artemisIX19SolutionTerrains.map((terrain) => (
                  <article
                    key={terrain.id}
                    className="rounded-md border border-border/60 bg-background/25 p-4"
                  >
                    <h2 className="text-sm font-semibold text-parchment">{terrain.label}</h2>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {terrain.pressure}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-gold/25 bg-gold/5 p-5 text-sm leading-relaxed text-muted-foreground">
            Click 3 is the triangle: Artemis converges contract requirements, operational facts,
            and financial exposure into a public-safe artifact package and a daily teaching stream.
          </div>
        </Container>
      </section>

      <section id="generator" className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Generator"
            title="Produce a solution and media package without leaving the browser"
            description="Select purpose, terrain, source family, output type, visibility mode, and intensity. The generated package can be copied, saved locally, exported as Markdown, or exported as JSON."
          />
          <div className="mt-10">
            <ArtemisIX19Generator />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Source Library"
            title="The protected references become public-safe source families"
            description="The original files stay out of public routes. ArtemisIX19 uses their high-level capabilities as inputs for new prompts, renders, storyboards, plots, and sonic treatments."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {artemisIX19Sources.map((source) => (
              <article
                key={source.id}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={source.status === "Private reference" ? "private" : "test"}>
                    {source.status}
                  </StatusBadge>
                  <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                    {source.family}
                  </span>
                </div>
                <h2 className="display-serif mt-4 text-2xl text-parchment">{source.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {source.summary}
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                      Signals
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-foreground/82">
                      {source.signals.map((signal) => (
                        <li key={signal} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                      Output Angles
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-foreground/82">
                      {source.outputAngles.map((angle) => (
                        <li key={angle} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-soft" />
                          <span>{angle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-5 rounded-md border border-gold/20 bg-gold/5 p-3 text-xs leading-relaxed text-muted-foreground">
                  {source.boundary}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Output Modes"
            title="Prompt, image, render, video, plot, movie, and sound"
            description="Each generator mode produces a different artifact shape while sharing the same source-signal and boundary system."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artemisIX19AssetProfiles.map((profile) => (
              <article
                key={profile.id}
                className="rounded-lg border border-border/70 bg-background/35 p-5"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {profile.label}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-parchment">{profile.command}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {profile.output}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SystemDiagramCard
            title="ArtemisIX19 generation loop"
            description="The generator is intentionally local and reviewable: client path, triangle convergence, source family, media instruction, review boundary, daily stream, export package."
            decision="Which client problem is being solved, which artifact should be generated, and what public/private boundary governs it?"
            nodes={[
              { label: "2-click path", detail: "Purpose and operating terrain", tone: "source" },
              { label: "Triangle", detail: "Point, purpose, meaning", tone: "logic" },
              { label: "Asset mode", detail: "Prompt, image, render, video, plot, movie, sound", tone: "logic" },
              { label: "Review gate", detail: "Public-safe or private-pilot", tone: "review" },
              { label: "Daily flow", detail: "Essay, update, quote, cartoon, alternatives", tone: "output" },
            ]}
            outcome="A reusable artifact package that can move into design, content, or future implementation without exposing raw references."
          />
          <div className="space-y-5">
            <ImplementationPhaseCard
              phase="Step 01"
              title="Choose purpose and terrain"
              description="Pick the client problem and operating context, then lock the triangle to define the point, purpose, and meaning."
              bullets={["Risk and claims", "Field production", "Cashflow and board exposure", "Public learning"]}
            />
            <ImplementationPhaseCard
              phase="Step 02"
              title="Select source family"
              description="Pick the protected reference lineage to transform into a clean public-safe content system."
              bullets={["Geodesic fabrication", "Table topology", "Türkiye atlas", "3D brand mark"]}
            />
            <ImplementationPhaseCard
              phase="Step 03"
              title="Generate and export"
              description="Produce prompt text, render plans, media beats, charts, and sound cues as deterministic artifacts."
              bullets={["Copy prompt", "Export JSON", "Reuse in content workflow", "Review before public release"]}
            />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Stack"
            title="Related proof modules"
            description="ArtemisIX19 sits beside the public geodesic and Diana proof routes while preserving raw-reference boundaries."
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
          <div className="rounded-lg border border-gold/25 bg-navy-deep/60 p-8 text-center shadow-panel lg:p-12">
            <p className="eyebrow">Next Build Step</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Use ArtemisIX19 as the safe front door for future media generation
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The current version is fully local and deterministic. Future upgrades can connect
              approved AI APIs, render workers, audio synthesis, or video pipelines behind the
              same source-boundary model.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="#generator" size="lg">
                Open Generator
              </Button>
              <Button href="/library/programs#artemisix19-generator-studio" variant="outline" size="lg">
                Catalog Entry
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
