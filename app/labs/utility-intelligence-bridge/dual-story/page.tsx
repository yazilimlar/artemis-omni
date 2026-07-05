import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Braces,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  GitBranch,
  Layers3,
  Route,
  ShieldCheck,
  Split,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { UtilityFieldClaimsWorkbench } from "@/components/labs/UtilityFieldClaimsWorkbench";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import {
  utilityDualStoryBoundaryChecks,
  utilityDualStoryLaunch,
  utilityDualStoryPaths,
  utilityDualStoryProgression,
  utilityClassicTiles,
  utilitySynthesisPipeline,
} from "@/data/utilityDualStory";
import {
  utilityBridgeMetricStrip,
  utilityCapabilityMatrix,
  utilityLifecycle,
  utilityRoleTranslations,
} from "@/data/utilityFieldClaims";
import { getProofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Utility Dual Story Cockpit",
  path: "/labs/utility-intelligence-bridge/dual-story",
  description:
    "A public-safe Artemis RC8.4 dual-story utility contractor page: Field Claims operational proof plus Cockpit Classic Section & Spine narrative, connected to a synthetic live workbench.",
});

const relatedProofs = getProofModules([
  "utility-dual-story-cockpit",
  "utility-field-claims-command-workbench",
  "utility-intelligence-bridge",
]);

function SectionSpineVisual() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            Cockpit Classic · Section & Spine
          </p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Trench logic becomes operating logic
          </h2>
        </div>
        <Layers3 className="h-6 w-6 text-gold-soft" aria-hidden />
      </div>

      <div className="mt-6 rounded-md border border-border/60 bg-background/30 p-4">
        <div className="grid gap-3">
          {[
            ["Surface restoration", "Public-facing work zone and restoration exposure."],
            ["Backfill", "Production quantity, compaction basis, schedule driver."],
            ["Pipe + bedding", "Core installed asset, quantity basis, cost-code anchor."],
            ["Trench support", "Safety, support, productivity, and risk envelope."],
            ["Datum / station spine", "The review line tying model, activity, claim, and cash together."],
          ].map(([label, detail], index) => (
            <div
              key={label}
              className="grid min-w-0 grid-cols-[2.5rem_1fr] items-center gap-3"
            >
              <div className="flex h-9 items-center justify-center rounded-md border border-gold/25 bg-gold/10 font-mono text-[0.62rem] text-gold-soft">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="rounded-md border border-border/50 bg-navy-deep/35 p-3">
                <p className="text-sm font-semibold text-parchment">{label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This is a rebuilt diagram concept. It does not include source geometry, GIS coordinates,
        private styles, protected formulas, or raw source code from the attached HTML.
      </p>
    </div>
  );
}

export default function UtilityDualStoryPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-95" aria-hidden />
        <div
          className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.13]"
          aria-hidden
        />
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-20">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="synthetic">RC8.4 synthetic rebuild</StatusBadge>
              <StatusBadge tone="private">Raw source protected</StatusBadge>
              <span className="eyebrow">Utility Intelligence Bridge · Dual Story Cockpit</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-tight text-parchment sm:text-5xl lg:text-6xl">
              Two guided stories. One field-to-cash workbench for utility contractors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              RC8.4 keeps the operational field-claims proof and restores the polished Cockpit
              Classic story as a second narrative path. Both stories lead to the same controlled
              source chain: model, quantity, schedule, cost, actuals, claims, payment, cash, and
              executive action.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#story-selector" size="lg">
                Choose Story Path
                <Split className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="#live-cockpit" variant="outline" size="lg">
                Open Live Cockpit
              </Button>
              <Button href="/labs/utility-intelligence-bridge/field-claims" variant="ghost" size="lg">
                Compare RC8.3
              </Button>
            </div>
          </div>

          <SectionSpineVisual />
        </Container>

        <Container className="pb-12">
          <div className="grid gap-3 md:grid-cols-5">
            {utilityBridgeMetricStrip.map((metric) => (
              <div
                key={metric.label}
                className="min-w-0 rounded-md border border-border/60 bg-background/30 p-4"
              >
                <p className="font-mono text-[0.56rem] uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-parchment">{metric.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Public-safe RC8.4 posture">
            This route publishes the RC8.4 narrative structure as a native Artemis page with
            representative, deterministic data. It does not publish the attached HTML, exact
            corridor, map coordinates, private labels, agency-specific records, protected formulas,
            or live system integrations.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not sealed design, survey control, agency approval, legal advice, or payment certification.",
              "Not an iframe around the private single-file app.",
              "Not live ERP, BIM, GIS, accounting, schedule, or document-control write-back.",
            ]}
          />
        </Container>
      </section>

      <section id="story-selector" className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="RC8.4 Startup Selector"
            title="Choose the narrative path"
            description="The attached version’s strongest addition is a dual-story front door. Field Claims proves the operating loop; Cockpit Classic explains the model-to-controls vision."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {utilityDualStoryPaths.map((path) => (
              <a
                key={path.label}
                href={path.href}
                className="group rounded-lg border border-border/70 bg-navy-deep/45 p-6 shadow-panel transition-colors hover:border-gold/45"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                      {path.label}
                    </p>
                    <h2 className="display-serif mt-3 text-balance text-2xl text-parchment">
                      {path.title}
                    </h2>
                  </div>
                  <GitBranch className="h-6 w-6 text-signal-soft" aria-hidden />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {path.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
                  {path.action}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Progression"
            title="RC8.4 extends the field-claims route without replacing it"
            description="The public site now has a comparison path: RC8.3 for the direct field-to-cash command workbench and RC8.4 for the dual-story cockpit wrapper around the same operating proof."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {utilityDualStoryProgression.map((item) => (
              <article
                key={item.version}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  {item.version}
                </p>
                <h2 className="display-serif mt-3 text-xl text-parchment">{item.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="field-claims-story" className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Story 1 · Operational Proof"
            title="Field completion becomes earned value; approved work becomes cash exposure"
            description="This path is built for contractor leadership: show how the same source record moves from installed quantity to actual cost, claim, approval, payment lag, cash, and action."
          />
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {utilityLifecycle.map((step, index) => (
              <div
                key={step}
                className="rounded-md border border-border/60 bg-background/30 p-4 text-center"
              >
                <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold text-parchment">{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="cockpit-classic-story" className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Story 2 · Cockpit Classic"
            title="Section & Spine turns the model into six professional dialects"
            description="This story restores the strongest Cockpit Classic idea from RC8.4: the visual identity comes from utility construction itself, while the same source model feeds every discipline."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityClassicTiles.map((tile) => (
              <article
                key={tile.label}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <Route className="h-5 w-5 text-gold-soft" aria-hidden />
                <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  {tile.label}
                </p>
                <h2 className="display-serif mt-3 text-xl text-parchment">{tile.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tile.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Synthesis Pipeline"
            title="From classic story to hardened operating proof"
            description="The dual-story version is not just a different opening screen. It adds a disciplined path for explaining, stress-testing, and hardening the public/private bridge."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {utilitySynthesisPipeline.map((item) => (
              <article
                key={item.step}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {item.step}
                </p>
                <h2 className="mt-3 text-sm font-semibold text-parchment">{item.label}</h2>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Launch Bay"
            title="Both stories launch the same controlled workbench"
            description="The public route keeps the RC8.4 launch behavior as website navigation: every action goes to a reviewable, synthetic route section."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityDualStoryLaunch.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel transition-colors hover:border-gold/45"
              >
                <BadgeCheck className="h-5 w-5 text-gold-soft" aria-hidden />
                <h2 className="display-serif mt-4 text-xl text-parchment">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                  Launch
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section id="live-cockpit" className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Live Cockpit"
            title="Run the synthetic RC8 operating proof"
            description="Use the same public-safe workbench as the RC8.3 field-claims page. The difference is the RC8.4 narrative wrapper: choose the operational proof or Cockpit Classic path, then land on the same source chain."
          />
          <div className="mt-10">
            <UtilityFieldClaimsWorkbench />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Discipline Translation"
            title="The dual-story cockpit still speaks to every owner"
            description="The Cockpit Classic story explains the vision; the Field Claims story proves the operational chain. Both are useful only if every discipline can read the same source truth."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-5">
            {utilityRoleTranslations.map((item) => (
              <article
                key={item.role}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {item.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.dialect}
                </p>
                <p className="mt-4 rounded-md border border-signal-soft/20 bg-signal-soft/10 p-3 text-xs leading-relaxed text-signal-soft">
                  {item.translation}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Capability Map"
            title="RC8.4 is a story selector, not a data fork"
            description="Each capability still maps to the same source custody chain. The selector changes how the room enters the demo, not which truth the system uses."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {utilityCapabilityMatrix.map((item) => (
              <article
                key={item.discipline}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <ClipboardCheck className="h-5 w-5 text-gold-soft" aria-hidden />
                <h2 className="display-serif mt-4 text-xl text-parchment">{item.discipline}</h2>
                <p className="mt-3 text-sm font-semibold text-foreground/86">{item.question}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.output}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Publication QA"
            title="What changed for RC8.4 and what stayed private"
            description="These checks are visible because the public page must prove the boundary as clearly as it proves the product story."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityDualStoryBoundaryChecks.map((check) => (
              <article
                key={check}
                className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden />
                <p className="mt-4 text-sm leading-relaxed text-emerald-50/85">{check}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Related Proof"
            title="Compare the utility progression"
            description="The proof cards let reviewers compare the broader Utility Bridge, the RC8.3 Field Claims workbench, and the RC8.4 Dual Story cockpit."
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md border border-gold/30 bg-gold/10 text-gold-soft">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </div>
            <p className="eyebrow mt-5">Private Pilot Gate</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Use RC8.4 when the room needs both the executive story and the field-to-cash proof.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The right pilot starts with approved source structures, representative mappings,
              explicit review gates, and no silent overwrite of systems of record.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact?module=Utility%20Dual%20Story%20Cockpit" size="lg">
                Request a Utility Contractor Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge/field-claims" variant="outline" size="lg">
                Compare RC8.3
              </Button>
              <Button href="/labs/utility-intelligence-bridge" variant="ghost" size="lg">
                Utility Bridge
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <Boxes className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Synthetic data
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <Braces className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Native route
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <FileCheck2 className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Review gates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <CircleDollarSign className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                No payment certification
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
