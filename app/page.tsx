import Link from "next/link";
import { ArrowRight, Gauge, Boxes, GraduationCap, Workflow } from "lucide-react";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  path: "/",
  description:
    "Artemis Omni — a 5D Construction Intelligence Bridge for heavy civil and infrastructure. Link field production and actual cost into live cashflow forecasts: Bid Estimate vs Actuals vs PM Forecast vs system-generated projections.",
});

// The connected Artemis value chain, rendered as a sequence on the homepage.
const valueChain = [
  "Design",
  "Geometry",
  "Quantities",
  "Schedule",
  "Field Production",
  "Actual Cost",
  "Billing Revenue",
  "PM Forecast",
  "System-Generated Projections",
  "Cashflow",
  "Risk / Opportunity",
  "Executive Action",
];

const capabilities = [
  {
    icon: Gauge,
    title: "5D Cashflow Forecasting",
    body: "Live cashflow that compares Bid Estimate vs Actuals vs PM Forecast vs system-generated projections — not a static S-curve.",
  },
  {
    icon: Workflow,
    title: "Project Controls & ERP / CMiC",
    body: "Cost, billing, and forecast workflows connected to CMiC and ERP, with auditable exception flags instead of black boxes.",
  },
  {
    icon: Boxes,
    title: "Digital Twin (3D / 4D / 5D)",
    body: "Real geometry and quantities tied to schedule sequencing and constructability — the model of record for the forecast.",
  },
  {
    icon: GraduationCap,
    title: "Field Production → Actual Cost",
    body: "Field progress and production logic tied to actual cost and billing revenue, surfacing variance as it happens.",
  },
];

const pillars = [
  {
    href: "/solutions",
    kicker: "Solutions",
    title: "Built for the jobsite and the boardroom",
    body: "5D construction intelligence for heavy civil and infrastructure delivery — engineered for accuracy, not novelty.",
  },
  {
    href: "/labs",
    kicker: "Labs",
    title: "Forecasting & digital-twin experiments",
    body: "Where new project-controls visualizations and forecasting models are prototyped before they ship.",
  },
  {
    href: "/tools",
    kicker: "Tools",
    title: "Interactive decision support",
    body: "Calculators and dashboards you can use today — starting with fuel price adjustment.",
  },
];

export default function HomePage() {
  return (
    <>
      <CinematicHero />

      {/* Capabilities */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="One bridge from design to cashflow"
            description="Artemis connects the artifacts of heavy civil and infrastructure delivery — geometry, quantities, schedule, field production, actual cost, and billing — into clear, defensible forecasts and executive action."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <Card key={c.title}>
                <c.icon className="h-7 w-7 text-gold" aria-hidden />
                <CardTitle className="mt-4 text-lg">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* The connected value chain */}
      <section className="border-t border-border/60 py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="The Artemis Bridge"
            title="From design intent to executive action"
            description="Every link is connected and traceable — so a change in the field reaches the cashflow forecast and the boardroom without a manual reconciliation."
          />
          <ol className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3">
            {valueChain.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-md border border-border/70 bg-navy-deep/50 px-3 py-1.5 text-sm text-foreground/85">
                  {step}
                </span>
                {i < valueChain.length - 1 ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-gold/70" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Pillars */}
      <section className="border-t border-border/60 py-20 lg:py-28">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {pillars.map((p) => (
              <Link key={p.href} href={p.href} className="group">
                <Card className="h-full">
                  <Badge>{p.kicker}</Badge>
                  <CardTitle className="mt-4">{p.title}</CardTitle>
                  <CardDescription>{p.body}</CardDescription>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
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
              We run focused pilots that prove value on real project data in weeks,
              not quarters. Tell us where the pain is.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact" size="lg">
                Request a Pilot
              </Button>
              <Button href="/case-studies" variant="outline" size="lg">
                See Case Studies
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
