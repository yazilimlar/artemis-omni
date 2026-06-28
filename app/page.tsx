import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SceneFallback } from "@/components/cinematic/SceneFallback";
import { solutionPillars } from "@/lib/artemis/solutions";
import { products } from "@/lib/artemis/products";
import { demoAssets } from "@/lib/artemis/demoAssets";
import { companyPositioning } from "@/lib/artemis/positioning";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "ARTEMIS turns scattered business data, documents, financial workflows, and engineering models into reliable AI-powered operating systems — with human oversight and audit-ready controls. 5D Construction Intelligence is the beachhead.",
});

export default function HomePage() {
  const featuredDemos = demoAssets.filter((a) => a.priority === "P1" || a.priority === "P2");

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint-grid bg-grid opacity-[0.16]" aria-hidden />
        <Container className="py-20 lg:py-28">
          <p className="eyebrow">Artemis · AI Implementation & Automation</p>
          <h1 className="display-serif mt-5 max-w-4xl text-balance text-4xl leading-[1.05] text-parchment sm:text-5xl lg:text-6xl">
            AI systems for companies that need{" "}
            <span className="bg-gold-sheen bg-clip-text text-transparent">more than chatbots.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            ARTEMIS turns scattered business data, documents, financial workflows, and
            engineering models into reliable AI-powered operating systems — with human
            oversight and audit-ready controls.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/contact" size="lg">
              Request a Pilot
            </Button>
            <Button href="/solutions" variant="outline" size="lg">
              Explore Solutions
            </Button>
            <Button href="/demo" variant="ghost" size="lg">
              See the Demo Center
            </Button>
          </div>

          {/* Construction Intelligence beachhead — surfaced above the fold */}
          <Link
            href="/solutions/construction-intelligence"
            className="group mt-10 block max-w-3xl rounded-xl border border-gold/30 bg-navy-deep/50 p-5 transition-colors hover:border-gold/60"
          >
            <div className="flex items-center gap-3">
              <Badge>Beachhead</Badge>
              <span className="display-serif text-base text-parchment">
                {companyPositioning.beachheadLabel}
              </span>
              <ArrowRight className="ml-auto h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {companyPositioning.beachheadProof}
            </p>
          </Link>
        </Container>
        <div className="meander-divider" aria-hidden />
      </section>

      {/* 2 — Three solution pillars */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Solutions"
            title="Three ways Artemis is put to work"
            description="One disciplined approach across business operations, heavy-civil construction, and engineering visualization."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {solutionPillars.map((p) => (
              <Link key={p.slug} href={p.href} className="group">
                <Card className="flex h-full flex-col">
                  {p.beachhead ? <Badge>Beachhead</Badge> : <Badge>Solution</Badge>}
                  <CardTitle className="mt-4">{p.title}</CardTitle>
                  <CardDescription className="flex-1">{p.summary}</CardDescription>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3 — Product module grid */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Products"
            title="Artemis modules"
            description="Construct leads as the public beachhead; the other modules extend the same audit-aware approach across the business."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <Link key={p.slug} href={p.route} className="group">
                  {inner}
                </Link>
              ) : (
                <div key={p.slug}>{inner}</div>
              );
            })}
          </div>
          <div className="mt-8">
            <Button href="/products" variant="outline">
              All products
            </Button>
          </div>
        </Container>
      </section>

      {/* 4 — Demo center preview */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Demo Center"
            title="Workbenches and showcases, catalogued by readiness"
            description="A library of Artemis demos. Some are catalogued as future integration candidates and require sanitation, review, and migration before public release."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDemos.slice(0, 4).map((d) => (
              <Card key={d.name} className="h-full">
                <Badge>{d.priority}</Badge>
                <CardTitle className="mt-3 text-sm">{d.name}</CardTitle>
                <CardDescription>{d.demonstrates}</CardDescription>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/demo" variant="outline">
              Open the Demo Center
            </Button>
          </div>
        </Container>
      </section>

      {/* 5 — Construction Intelligence beachhead */}
      <section className="border-y border-border/60 py-20 lg:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Badge>Beachhead · Artemis Construct</Badge>
            <h2 className="display-serif mt-4 text-balance text-3xl text-parchment sm:text-4xl">
              {companyPositioning.beachheadOneLiner}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              5D Construction Intelligence links design, geometry, quantities, schedule,
              field production, and actual cost into a live cashflow forecast — comparing
              Bid Estimate vs Actuals vs PM Forecast vs system-generated projections for
              heavy civil contractors, infrastructure owners, and project controls teams.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Button href="/solutions/construction-intelligence">Construction Intelligence</Button>
              <Button href="/products/construct" variant="outline">
                Artemis Construct
              </Button>
            </div>
          </div>
          <div>
            <SceneFallback />
          </div>
        </Container>
      </section>

      {/* 6 — Implementation doctrine / transition method */}
      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Implementation"
            title="AI is not the strategy. Implementation is the strategy."
            description="Most companies already use AI tools but can't operationalize them. The gap is process, training, data structure, semantics, governance, and adoption — not model capability. Artemis closes that gap."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Disciplined fundamentals", b: "AI does not replace fundamentals — it amplifies disciplined ones." },
              { t: "Phase 0–6 transition", b: "Diagnostic → semantic modeling → prototype → training → implementation → optimization → operating system." },
              { t: "Audit-aware by design", b: "Human-reviewed outputs, source-labeled assumptions, formula traceability, transparent confidence levels." },
            ].map((x) => (
              <Card key={x.t}>
                <CardTitle className="text-lg">{x.t}</CardTitle>
                <CardDescription>{x.b}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 7 — Portfolio / Library preview */}
      <section className="border-t border-border/60 py-20 lg:py-24">
        <Container className="grid gap-5 lg:grid-cols-2">
          <Link href="/portfolio" className="group">
            <Card className="h-full">
              <Badge>Portfolio</Badge>
              <CardTitle className="mt-4">Selected work, in preview</CardTitle>
              <CardDescription>
                The strongest Artemis workbenches and dashboards — sanitized, public-safe
                versions appear after review.
              </CardDescription>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                View portfolio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
          <Link href="/library" className="group">
            <Card className="h-full">
              <Badge>Library</Badge>
              <CardTitle className="mt-4">Doctrine, methods, and showcases</CardTitle>
              <CardDescription>
                The implementation doctrine, the transition method, tools, and public-safe
                content behind Artemis.
              </CardDescription>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                Open library <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        </Container>
      </section>

      {/* 8 — Request pilot CTA */}
      <section className="py-20 lg:py-28">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-navy-deep/60 p-10 text-center lg:p-16">
            <div
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_hsl(41_64%_56%/0.14),transparent_60%)]"
              aria-hidden
            />
            <p className="eyebrow">Pilot Program</p>
            <h2 className="display-serif mx-auto mt-4 max-w-2xl text-balance text-3xl text-parchment sm:text-4xl">
              Bring Artemis into your next project
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Pilot-ready implementation engagements on real data — human-reviewed and
              audit-aware. Tell us where the pain is.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/demo" variant="outline" size="lg">
                See the Demo Center
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
