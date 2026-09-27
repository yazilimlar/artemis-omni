import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  Layers3,
  LockKeyhole,
  MapPinned,
  Route,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import { getProofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Utility Sewer 3D Bridge",
  path: "/labs/utility-intelligence-bridge/3d-model",
  description:
    "A public-safe Artemis utility sewer 3D bridge showing how corridor geometry becomes quantity, schedule, cost, claims, cash exposure, and executive action.",
});

const modelLayers = [
  {
    label: "Surface restoration",
    detail: "Roadway, sidewalk, landscape, and restoration exposure.",
    offset: "translate-y-0",
  },
  {
    label: "Backfill envelope",
    detail: "Trench volume, compaction basis, crew windows, and productivity risk.",
    offset: "translate-y-5",
  },
  {
    label: "Pipe + bedding",
    detail: "Installed utility asset, quantity basis, pay item anchor, and claim object.",
    offset: "translate-y-10",
  },
  {
    label: "Datum spine",
    detail: "Station chain tying geometry, work package, actuals, approvals, and cash together.",
    offset: "translate-y-16",
  },
];

const bridgeSteps = [
  ["01", "Geometry", "Synthetic corridor section and station spine."],
  ["02", "Quantity", "Pipe length, trench volume, structures, and restoration zones."],
  ["03", "Schedule", "Crew windows, blockers, sequence, and earned progress."],
  ["04", "Commercial", "Cost code, pay item, claim packet, payment lag, and cash exposure."],
  ["05", "Action", "Decision owner, confidence, exception path, and next review."],
];

const controlQuestions: Array<{
  icon: LucideIcon;
  title: string;
  detail: string;
}> = [
  {
    icon: Boxes,
    title: "What is installed?",
    detail: "Which utility object has governing geometry, quantity, and scope?",
  },
  {
    icon: Route,
    title: "Where is the constraint?",
    detail: "Which station, structure, or work zone is driving the next delay or change?",
  },
  {
    icon: CircleDollarSign,
    title: "What is the exposure?",
    detail: "Which cost, claim, pay item, or payment lag matters to cash flow?",
  },
  {
    icon: ClipboardCheck,
    title: "Who decides next?",
    detail: "Which owner, confidence level, and review gate controls the next move?",
  },
];

const relatedProofs = getProofModules([
  "utility-field-claims-command-workbench",
  "utility-dual-story-cockpit",
  "utility-intelligence-bridge",
]);

function UtilityModelVisual() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            Public-Safe Utility Sewer 3D Bridge
          </p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">
            Section, spine, and source custody
          </h2>
        </div>
        <Layers3 className="h-6 w-6 text-gold-soft" aria-hidden />
      </div>

      <div className="relative mt-8 min-h-[340px] rounded-md border border-border/60 bg-background/25 p-5">
        <div className="absolute inset-5 rounded-md bg-blueprint-grid bg-grid opacity-[0.14]" aria-hidden />
        <div className="relative mx-auto mt-6 max-w-xl rotate-[-7deg] space-y-4">
          {modelLayers.map((layer, index) => (
            <div
              key={layer.label}
              className={`relative rounded-md border border-border/60 bg-navy-deep/70 p-4 shadow-panel ${layer.offset}`}
              style={{ marginLeft: `${index * 1.35}rem`, marginRight: `${index * 1.35}rem` }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
                  {String(index + 1).padStart(2, "0")} · {layer.label}
                </p>
                <span className="h-2 w-2 rounded-full bg-signal-soft shadow-[0_0_18px_hsl(188_78%_58%/0.75)]" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{layer.detail}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-6 left-8 right-8 h-3 rounded-full border border-gold/25 bg-gold/10 shadow-[0_0_34px_hsl(42_78%_62%/0.22)]" aria-hidden />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This route restores the public link as a native Artemis page. It uses representative
        geometry and deterministic sample logic, not private GIS, survey control, or source files.
      </p>
    </div>
  );
}

export default function UtilitySewer3DBridgePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-95" aria-hidden />
        <div
          className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.13]"
          aria-hidden
        />
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="synthetic">Synthetic 3D route</StatusBadge>
              <StatusBadge tone="public">Public-safe</StatusBadge>
              <StatusBadge tone="private">Private source protected</StatusBadge>
              <span className="eyebrow">Utility Intelligence Bridge · 3D Model</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-tight text-parchment sm:text-5xl lg:text-6xl">
              Utility sewer geometry becomes an operating bridge.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              The restored 3D model route shows the public-safe idea behind the sewer bridge:
              section logic, station spine, quantities, schedule, cost, claims, payment lag, cash
              exposure, and executive action all stay tied to one reviewable source object.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#bridge-chain" size="lg">
                Review Bridge Chain
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/labs/utility-intelligence-bridge/field-claims" variant="outline" size="lg">
                Field Claims Workbench
              </Button>
              <Button href="/labs/utility-intelligence-bridge/dual-story" variant="ghost" size="lg">
                RC8.4 Dual Story
              </Button>
            </div>
          </div>

          <UtilityModelVisual />
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <ConfidenceNote title="Resurrection boundary">
            This page resurrects the shared public URL as a native Artemis route. The visual model
            is representative and synthetic: it does not publish private coordinates, agency data,
            original standalone source HTML, survey control, BIM/GIS exports, or proprietary
            project records.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not sealed design, survey control, agency approval, legal advice, or payment certification.",
              "Not a publication of the removed preview deployment or private source files.",
              "Not live ERP, BIM, GIS, accounting, schedule, or document-control write-back.",
            ]}
          />
        </Container>
      </section>

      <section id="bridge-chain" className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="3D-To-Action Chain"
            title="The model is useful when it controls the conversation"
            description="A utility corridor view only matters if the same object can be followed into quantities, schedule, commercial exposure, and the next accountable decision."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {bridgeSteps.map(([step, title, detail]) => (
              <article
                key={step}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold-soft">
                  {step}
                </p>
                <h2 className="display-serif mt-3 text-xl text-parchment">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Control Surface"
            title="What the restored 3D bridge should help a reviewer ask"
            description="The route keeps the old public promise alive while pointing the viewer toward the stronger RC8 field-claims and dual-story workbenches."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {controlQuestions.map(({ icon: Icon, title, detail }) => (
              <article
                key={title}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <Icon className="h-5 w-5 text-gold-soft" aria-hidden />
                <h2 className="display-serif mt-4 text-xl text-parchment">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Related Proof"
            title="Continue from the 3D model into the operating workbench"
            description="The 3D bridge is the visual front door. The field-claims and dual-story routes show how the same source chain becomes contractor execution logic."
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
              <LockKeyhole className="h-6 w-6" aria-hidden />
            </div>
            <p className="eyebrow mt-5">Private Pilot Gate</p>
            <h2 className="display-serif mx-auto mt-3 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Reconnect the public model to approved private utility records.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The next version should map one approved utility work package into geometry,
              quantity, schedule, cost, claims, payment status, cash exposure, and executive review.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact?module=Utility%20Sewer%203D%20Bridge" size="lg">
                Request a Utility Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge" variant="outline" size="lg">
                Back to Utility Bridge
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Public-safe route
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <MapPinned className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                No private coordinates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <Workflow className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Review gates
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
