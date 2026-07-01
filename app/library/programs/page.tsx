import Link from "next/link";
import { ArrowRight, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/PageHero";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { programCatalogItems, programCatalogSummary } from "@/data/programCatalog";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Programs and Tutorials Catalog",
  path: "/library/programs",
  description:
    "A public-safe Artemis catalog that maps attached programs, tutorials, HTML demos, solution cockpits, and exemplary files to the right website destinations.",
});

const fastLinks = [
  {
    title: "ArtemisIX19",
    href: "/labs/artemisix19",
    description: "Autonomous prompt/media generator for the protected Artemis reference set.",
  },
  {
    title: "1040 Finance Architecture",
    href: "/labs/tax-architecture-2026",
    description: "Standalone 3D finance education prototype for tax-scenario storytelling.",
  },
  {
    title: "Turkiye Atlas",
    href: "/labs/turkiye-atlas",
    description: "Interactive cultural-route atlas with map fallbacks and commercial discovery layers.",
  },
  {
    title: "Atlas All Countries",
    href: "/labs/artemis-atlas-all-countries",
    description: "3D-first game atlas clone with Journey commands, guide animation, and route insertion.",
  },
  {
    title: "Utility Intelligence Bridge",
    href: "/labs/utility-intelligence-bridge",
    description: "Public narrative for the sewer/utility cockpit and field-to-finance bridge.",
  },
  {
    title: "Diana Moonshot",
    href: "/labs/diana-moonshot",
    description: "Public brand-experience destination for the Diana demonstrator and visual system.",
  },
  {
    title: "Insights Engine",
    href: "/insights",
    description:
      "Public-safe article, visual, and tutorial production system inspired by the masterclass reference format.",
  },
  {
    title: "Workbench Shell",
    href: "/labs/construction-intelligence-workbench",
    description: "Synthetic live workbench pattern for future public-safe rebuilds.",
  },
  {
    title: "Tools",
    href: "/tools",
    description: "Future home for rebuilt calculators, simulators, and training utilities.",
  },
];

export default function ProgramsCatalogPage() {
  return (
    <>
      <PageHero
        eyebrow="Library · Program Index"
        title="Programs, tutorials, HTML demos, and exemplary files"
        description="A single lookup page that maps attached Artemis programs and reference HTMLs to public-safe website destinations, without embedding raw private demos."
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="public">Public index</StatusBadge>
          <StatusBadge tone="private">Raw HTML protected</StatusBadge>
          <StatusBadge tone="synthetic">Rebuild with synthetic data</StatusBadge>
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Most efficient website link">
            Use <span className="font-mono text-signal-soft">{programCatalogSummary.liveRoute}</span>{" "}
            as the durable catalog URL. Each attached program gets an anchor on this page and
            points to the best current public route.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a public folder of raw local HTML files.",
              "Not an iframe wrapper around private demos.",
              "Not a claim that every attached reference is ready for public release.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Fast Links"
            title="Where the attached files belong on the website"
            description="The catalog routes each file to one of the existing public-safe destinations first. New live tools should be rebuilt later, not published as raw HTML."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {fastLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border border-border/70 bg-navy-deep/45 p-5 shadow-panel transition-colors hover:border-gold/40"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  Public route
                </p>
                <h2 className="display-serif mt-3 text-xl text-parchment">{link.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                  Open route
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Attached File Map"
            title="Public-safe catalog entries"
            description="Each entry names the sanitized public concept, the best current link, the tutorial or solution use, and the migration rule for future rebuilds."
          />
          <div className="mt-10 grid gap-5">
            {programCatalogItems.map((item) => (
              <article
                key={item.slug}
                id={item.slug}
                className="scroll-mt-24 rounded-2xl border border-border/70 bg-navy-deep/45 p-6 shadow-panel"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge tone={item.statusTone}>{item.statusLabel}</StatusBadge>
                      <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-wider text-muted-foreground">
                        <FileCode2 className="h-3.5 w-3.5" />
                        {item.kind} · {item.sourceType}
                      </span>
                    </div>
                    <h2 className="display-serif mt-4 text-2xl text-parchment">{item.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button href={item.bestPublicLink.href} variant="outline" size="sm">
                      {item.bestPublicLink.label}
                    </Button>
                    <Button href={`/library/programs#${item.slug}`} variant="ghost" size="sm">
                      Entry Link
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-border/60 bg-background/35 p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                      Tutorial Use
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.tutorialUse}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/35 p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                      Solution Fit
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.solutionFit}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/35 p-4">
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                      Boundary
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.boundary}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-4">
                  <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                    Migration Path
                  </p>
                  <ol className="mt-3 grid gap-2 text-sm leading-relaxed text-muted-foreground lg:grid-cols-3">
                    {item.migrationPath.map((step) => (
                      <li key={step} className="rounded-lg border border-border/50 bg-background/25 p-3">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-2xl border border-gold/25 bg-navy-deep/60 p-8 text-center lg:p-12">
            <p className="eyebrow">Next Build Step</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Convert cataloged references into public-safe products one at a time
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The right sequence is tutorial extraction first, synthetic tool rebuild second,
              then private pilot migration with approved data.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/labs/utility-intelligence-bridge" size="lg">
                Start with Utility Bridge
              </Button>
              <Button href="/labs/diana-moonshot" variant="outline" size="lg">
                Open Diana Experience
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
