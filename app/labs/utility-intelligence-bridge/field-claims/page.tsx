import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  ClipboardList,
  Database,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { UtilityFieldClaimsWorkbench } from "@/components/labs/UtilityFieldClaimsWorkbench";
import { ConfidenceNote } from "@/components/showcase/ConfidenceNote";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { StatusBadge } from "@/components/showcase/StatusBadge";
import { WhatItIsNotBox } from "@/components/showcase/WhatItIsNotBox";
import {
  utilityBridgeMetricStrip,
  utilityCapabilityMatrix,
  utilityLaunchActions,
  utilityLifecycle,
  utilityQaChecks,
  utilityRoleTranslations,
  utilitySourceDisciplines,
  utilitySourceSchemas,
  utilityVersionProgression,
} from "@/data/utilityFieldClaims";
import { getProofModules } from "@/data/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Utility Field Claims Command Workbench",
  path: "/labs/utility-intelligence-bridge/field-claims",
  description:
    "A public-safe Artemis RC8.3 rebuild for utility contractors: model-to-quantity, cost-code, schedule, actuals, claims, payment lag, cashflow exposure, and executive action.",
});

const relatedProofs = getProofModules([
  "utility-dual-story-cockpit",
  "utility-intelligence-bridge",
  "artemis-workbench-shell",
]);

function SourceModelVisual() {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/55 p-5 shadow-panel">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
            Animated Source-Model Feed
          </p>
          <h2 className="display-serif mt-2 text-2xl text-parchment">One source object</h2>
        </div>
        <Workflow className="h-6 w-6 text-gold-soft" aria-hidden />
      </div>

      <div className="mt-6 rounded-md border border-border/60 bg-background/25 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-md border border-signal-soft/25 bg-signal-soft/10 p-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-wider text-signal-soft">
              Synthetic utility object
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/86">
              Pipe run · trench · manhole set · restoration zone
            </p>
          </div>
          <div className="hidden h-px w-12 bg-gold/50 sm:block" aria-hidden />
          <div className="rounded-md border border-gold/25 bg-gold/10 p-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-wider text-gold-soft">
              Data custody packet
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/86">
              Same source object, translated without losing the review trail.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {utilitySourceDisciplines.map((discipline, index) => (
            <div
              key={discipline.label}
              className="rounded-md border border-border/50 bg-navy-deep/35 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.56rem] uppercase tracking-wider text-gold-soft">
                  {String(index + 1).padStart(2, "0")} · {discipline.label}
                </p>
                <span className="h-2 w-2 rounded-full bg-signal-soft shadow-[0_0_18px_hsl(188_78%_58%/0.7)]" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {discipline.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        The motion means custody, not decoration: geometry becomes quantity; quantity becomes
        schedule, cost, actuals, earned value, claim, payment, cash, and action.
      </p>
    </div>
  );
}

export default function UtilityFieldClaimsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial opacity-95" aria-hidden />
        <div
          className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.14]"
          aria-hidden
        />
        <Container className="grid gap-10 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="synthetic">Synthetic live rebuild</StatusBadge>
              <StatusBadge tone="private">RC8.3 source protected</StatusBadge>
              <span className="eyebrow">Utility Intelligence Bridge · Executive Field Claims</span>
            </div>
            <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-tight text-parchment sm:text-5xl lg:text-6xl">
              One parametric model. Six disciplines. One source of truth for utility contractors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Artemis turns a utility corridor into an operating language for contractors:
              geometry becomes quantity, quantity becomes schedule, cost, labor, and cash,
              field completion becomes earned value, and approved work becomes claims,
              payment exposure, and executive action.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#cockpit" size="lg">
                Open Live Workbench
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/for/contractors" variant="outline" size="lg">
                Contractor Pathway
              </Button>
              <Button href="/labs/utility-intelligence-bridge/dual-story" variant="outline" size="lg">
                Compare RC8.4
              </Button>
              <Button href="/library/programs#utility-bridge-field-claims-cockpit" variant="ghost" size="lg">
                Catalog Entry
              </Button>
            </div>
          </div>

          <SourceModelVisual />
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
          <ConfidenceNote title="Representative demonstration boundary">
            This is a public-safe, synthetic Artemis rebuild for utility contractors. It is not
            sealed design, survey control, agency approval, payment certification, legal advice,
            or a substitute for contract reconciliation. Actuals, claims, and payment records
            shown here are source-tagged sample records unless a private implementation imports
            approved data through reviewed interfaces.
          </ConfidenceNote>
          <WhatItIsNotBox
            items={[
              "Not a publication of the private RC8.3 HTML, GIS context, coordinates, or source paths.",
              "Not live ERP, schedule, BIM, GIS, accounting, or document-control write-back.",
              "Not an unmanaged bot that changes systems of record without review gates.",
            ]}
          />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Progression"
            title="From public narrative to field-claims command workbench"
            description="This page highlights the RC8.3 utility demo as the next step in the Artemis progression: the public site keeps the raw source private while exposing the extended functionality as a sanitized, native route."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityVersionProgression.map((item) => (
              <article
                key={item.version}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
                  {item.version}
                </p>
                <h2 className="display-serif mt-3 text-xl text-parchment">{item.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.capability}
                </p>
                <p className="mt-4 rounded-md border border-gold/20 bg-gold/5 p-3 text-xs leading-relaxed text-gold-soft">
                  {item.extension}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="source-feed" className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Source-Model Feed"
            title="The chain of custody is the product"
            description="The contractor value is not a prettier model. The value is knowing how one utility object changes quantity, code, schedule, actuals, earned value, claim approval, payment lag, cash, and action."
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

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Launch Bay"
            title="A controlled demo path for contractor executives"
            description="The route follows the RC8.3 demonstration order while keeping everything public-safe and deterministic."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityLaunchActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="group rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel transition-colors hover:border-gold/45"
              >
                <BadgeCheck className="h-5 w-5 text-gold-soft" aria-hidden />
                <h2 className="display-serif mt-4 text-xl text-parchment">{action.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {action.detail}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                  Jump to section
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
            eyebrow="Live Application Shell"
            title="Run the field-claims scenario without private data"
            description="The workbench demonstrates scenario recomputation and record reconciliation through synthetic, source-tagged sample records. It shows the operating shape of a private pilot without claiming live enterprise integration."
          />
          <div className="mt-10">
            <UtilityFieldClaimsWorkbench />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Capability Matrix"
            title="One bridge, six contractor disciplines"
            description="Each discipline keeps its own professional dialect, but Artemis keeps the source chain connected so leadership can find the governing constraint."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {utilityCapabilityMatrix.map((item) => (
              <article
                key={item.discipline}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <BriefcaseBusiness className="h-5 w-5 text-gold-soft" aria-hidden />
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
            eyebrow="Role Translation"
            title="The same truth in the language each team uses"
            description="Artemis should not flatten contractor work into one generic dashboard. The workbench translates the same source object into field, estimating, controls, contract, finance, and executive language."
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
            eyebrow="Schema Bridge"
            title="Minimum path from demo to private pilot"
            description="The public page names the source structures without publishing private records. A private implementation can map these fields to approved schedule, ERP, field, BIM, GIS, and document-control interfaces."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {utilitySourceSchemas.map((schema) => (
              <article
                key={schema.title}
                className="rounded-lg border border-border/70 bg-navy-deep/45 p-5 shadow-panel"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gold-soft" aria-hidden />
                  <h2 className="display-serif text-xl text-parchment">{schema.title}</h2>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {schema.fields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border border-border/60 bg-background/30 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="RC8.3 QA / Regression Status"
            title="Public release checks for the sanitized rebuild"
            description="The strongest demo is useful only if the public boundary is clean. These checks are visible so the contractor audience understands what is proven and what remains private-pilot scope."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {utilityQaChecks.map((check) => (
              <article
                key={check.label}
                className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-5"
              >
                <FileCheck2 className="h-5 w-5 text-emerald-100" aria-hidden />
                <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-wider text-emerald-100">
                  {check.status}
                </p>
                <h2 className="display-serif mt-2 text-xl text-parchment">{check.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">{check.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Related Proof"
            title="Where this demo sits in Artemis"
            description="The field-claims route extends the existing Utility Intelligence Bridge, the reusable workbench shell, and the forecast exposure control pattern."
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
              Start with one utility scope, one forecast period, and one claims review.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Artemis should read approved project structures, reconcile source-tagged records,
              propose reviewed outputs, and write back only through explicit review gates.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button href="/contact?module=Utility%20Field%20Claims%20Command%20Workbench" size="lg">
                Request a Utility Contractor Pilot
              </Button>
              <Button href="/labs/utility-intelligence-bridge" variant="outline" size="lg">
                Back to Utility Bridge
              </Button>
              <Button href="/labs" variant="ghost" size="lg">
                Proof Library
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Approved interfaces only
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <Boxes className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Synthetic public data
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1">
                <ClipboardList className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
                Human review gate
              </span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
