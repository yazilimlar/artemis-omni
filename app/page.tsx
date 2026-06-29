import Link from "next/link";
import { ArrowRight, Gauge, Boxes, Workflow, LineChart, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SceneFallback } from "@/components/cinematic/SceneFallback";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { ValueChainStrip } from "@/components/showcase/ValueChainStrip";
import { ConnectedDataPanel } from "@/components/showcase/ConnectedDataPanel";
import { DecisionLoopGraphic } from "@/components/showcase/DecisionLoopGraphic";
import { SystemDiagramCard } from "@/components/showcase/SystemDiagramCard";
import { ImplementationPhaseCard } from "@/components/showcase/ImplementationPhaseCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { products } from "@/lib/artemis/products";
import { companyPositioning } from "@/lib/artemis/positioning";
import { implementationPhases, aiStruggles } from "@/lib/artemis/implementation";
import { proofLibrary } from "@/lib/artemis/proofLibrary";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "Artemis turns project fundamentals into AI-enabled execution — connecting schedule, cost, production, forecast, and cashflow for heavy civil and infrastructure. 5D Construction Intelligence with audit-grade logic and human review.",
});

const fundamentals = [
  { icon: Workflow, label: "Project management" },
  { icon: Gauge, label: "Project controls" },
  { icon: LineChart, label: "Project financials" },
  { icon: Boxes, label: "Project design" },
  { icon: ShieldCheck, label: "Project execution" },
  { icon: Users, label: "Schedule & production" },
];

export default function HomePage() {
  const proofPreview = proofLibrary.slice(0, 3);

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.16]" aria-hidden />
        <Container className="py-20 lg:py-28">
          <div className="meander-divider mb-6 max-w-[160px]" aria-hidden />
          <p className="eyebrow">Artemis · 5D Construction Intelligence &amp; AI Implementation</p>
          <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-[1.05] text-parchment sm:text-5xl lg:text-6xl">
            Turn project fundamentals into{" "}
            <span className="bg-gold-sheen bg-clip-text text-transparent">AI-enabled execution.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Artemis builds the implementation layer between project data, field execution,
            financial controls, and executive decisions — connecting schedule, cost,
            production, forecast, and cashflow with audit-grade logic and human review.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            For heavy civil contractors, infrastructure owners, PMCM teams, estimators,
            project controls managers, and executives.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/contact" size="lg">Request a Pilot</Button>
            <Button href="/labs" variant="outline" size="lg">Explore the Proof Library</Button>
            <Button href="/solutions" variant="ghost" size="lg">See Solutions</Button>
          </div>

          {/* Beachhead strip */}
          <Link
            href="/solutions/construction-intelligence"
            className="group mt-10 block max-w-3xl rounded-xl border border-gold/30 bg-navy-deep/50 p-5 transition-colors hover:border-gold/60"
          >
            <div className="flex items-center gap-3">
              <Badge>Beachhead</Badge>
              <span className="display-serif text-base text-parchment">{companyPositioning.beachheadLabel}</span>
              <ArrowRight className="ml-auto h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{companyPositioning.beachheadProof}</p>
          </Link>
        </Container>
        <div className="meander-divider" aria-hidden />
      </section>

      {/* 2 — AI is not the strategy. Implementation is the strategy. */}
      <section className="py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Doctrine"
            title="AI is not the strategy. Implementation is the strategy."
            lede="AI can reduce cost, increase speed, and improve margin — but only when a company has disciplined fundamentals. AI does not replace fundamentals; it amplifies disciplined ones."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "How do companies actually use AI — beyond a chat window?",
              "How do they train staff on the process, not just the tool?",
              "How do they move off Excel / email / manual workflows?",
              "How do they implement AI without losing transparency, semantics, control, or accountability?",
              "How do they convert AI from a chat tool into a working operating system?",
              "How do they keep every number auditable and source-labeled?",
            ].map((q) => (
              <div key={q} className="rounded-xl border border-border/60 bg-navy-deep/40 p-5 text-sm text-foreground/85">
                {q}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Artemis exists to answer these — the gap is process, training, data structure,
            semantics, governance, and adoption, not model capability.
          </p>
        </Container>
      </section>

      {/* 3 — From project fundamentals to AI-enabled execution */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Foundation"
            title="From project fundamentals to AI-enabled execution"
            lede="Project management, schedule, design, financials, controls, and execution all depend on disciplined fundamentals. Artemis amplifies them — it does not replace them."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fundamentals.map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-lg border border-border/60 bg-navy-deep/40 px-4 py-3">
                <f.icon className="h-5 w-5 shrink-0 text-blueprint" aria-hidden />
                <span className="text-sm text-foreground/85">{f.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 — What Artemis connects */}
      <section className="py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="What Artemis connects"
            title="One implementation layer, not a black box"
            lede="Artemis connects the systems you already run to trusted outputs — through a semantic model, source-labeled logic, and defined human review."
          />
          <div className="mt-10">
            <ConnectedDataPanel />
          </div>
        </Container>
      </section>

      {/* 5 — The Artemis Bridge (value chain) */}
      <section className="border-y border-border/60 py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="The Artemis Bridge"
            title="From design intent to executive action"
            lede="Every link is connected and traceable — so a change in the field reaches the cashflow forecast and the boardroom without a manual reconciliation."
          />
          <div className="mt-10">
            <ValueChainStrip />
          </div>
        </Container>
      </section>

      {/* 6 — Why companies struggle to use AI */}
      <section className="py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="The problem"
            title="Why companies struggle to use AI"
            lede="Most teams already have AI tools. Few have an operating system. The failure points are predictable."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {aiStruggles.map((s) => (
              <Card key={s.title}>
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>{s.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 7 — How Artemis implements AI systems */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="The method"
            title="How Artemis implements AI systems"
            lede="A phased, auditable transition from current state to an operating system — with human review at every consequential step."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {implementationPhases.map((p) => (
              <ImplementationPhaseCard key={p.phase} phase={p} />
            ))}
          </div>
          <div className="mt-10">
            <SystemDiagramCard
              title="The executive decision loop"
              caption="controlled automation"
              footnote="Connected data → audit-grade logic → human review → executive decision → field action — and actuals feed back. Automation handles the repeatable; humans gate the consequential."
            >
              <DecisionLoopGraphic />
            </SystemDiagramCard>
          </div>
        </Container>
      </section>

      {/* 8 — Proof Library / Labs preview */}
      <section className="py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Proof Library"
            title="Evidence, not adjectives"
            lede="Workbenches and showcases — what each proves, the data it connects, and the decision it improves. Public showcases use synthetic data."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {proofPreview.map((item) => (
              <ProofCard key={item.slug} item={item} />
            ))}
          </div>
          <div className="mt-8">
            <Button href="/labs" variant="outline">Open the Proof Library</Button>
          </div>
        </Container>
      </section>

      {/* 9 — Products / modules */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Products"
            title="Artemis modules"
            lede="Construct leads as the public beachhead. The other modules extend the same disciplined, audit-aware approach across the business — introduced as credibility compounds."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const inner = (
                <Card className="h-full">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <Badge>{p.status === "beachhead" ? "Beachhead" : p.status}</Badge>
                  </div>
                  <CardDescription>{p.summary}</CardDescription>
                </Card>
              );
              return p.route ? (
                <Link key={p.slug} href={p.route} className="group">{inner}</Link>
              ) : (
                <div key={p.slug}>{inner}</div>
              );
            })}
          </div>
          <div className="mt-8">
            <Button href="/products" variant="outline">All products</Button>
          </div>
        </Container>
      </section>

      {/* 10 — Construction beachhead */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Badge>Beachhead · Artemis Construct</Badge>
            <h2 className="display-serif mt-4 text-balance text-3xl text-parchment sm:text-4xl">
              {companyPositioning.beachheadOneLiner}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              5D Construction Intelligence links design, geometry, quantities, schedule,
              field production, and actual cost into a live cashflow forecast — comparing
              Bid Estimate vs Actuals vs PM Forecast vs system-generated projections.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Button href="/solutions/construction-intelligence">Construction Intelligence</Button>
              <Button href="/labs/construction-intelligence-workbench" variant="outline">View the workbench</Button>
            </div>
          </div>
          <div>
            <SceneFallback />
          </div>
        </Container>
      </section>

      {/* 11 — Pilot CTA */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-deep/60 p-10 text-center lg:p-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_hsl(41_64%_56%/0.14),transparent_60%)]" aria-hidden />
            <p className="eyebrow">Pilot Program</p>
            <h2 className="display-serif mx-auto mt-4 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Prove it on your project data
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Pilot-ready implementation framework — human-reviewed, audit-aware, with
              source-labeled assumptions and controlled integrations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">Request a Pilot</Button>
              <Button href="/labs" variant="outline" size="lg">See the Proof Library</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
