import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { solutionPillars, ARTEMIS_FULL } from "@/lib/artemis/solutions";
import { companyPositioning } from "@/lib/artemis/positioning";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Solutions",
  path: "/solutions",
  description:
    "Artemis solutions for heavy civil, infrastructure, and project controls: project controls, schedule + production, cost + forecast, field-to-finance, AI implementation + staff adoption, and executive decision support.",
});

const audiences = [
  "Heavy civil contractors",
  "Infrastructure owners",
  "PMCM teams",
  "Project controls managers",
  "Estimators",
  "Finance teams",
  "Operations teams",
  "Executives",
];

const solutionBlocks = [
  {
    title: "Project Controls Intelligence",
    body: "Integrate cost and schedule into one defensible forecast — earned value, EAC, and variance with source-labeled logic.",
    forWhom: "Project controls managers, PMCM",
  },
  {
    title: "Schedule + Production Intelligence",
    body: "Tie schedule sequencing and field production to progress and cost, so plan vs actual is live, not monthly.",
    forWhom: "Operations, superintendents, PMCM",
  },
  {
    title: "Cost + Forecast Intelligence",
    body: "A four-way comparison — Bid Estimate vs Actuals vs PM Forecast vs system-generated projection — with confidence levels.",
    forWhom: "Project controls, finance, executives",
  },
  {
    title: "Field-to-Finance Bridge",
    body: "Connect field production and actual cost to billing revenue and cashflow, without re-keying between systems.",
    forWhom: "Operations, finance, contractors",
  },
  {
    title: "AI Implementation + Staff Adoption",
    body: "The transition method: diagnose, model semantics, prototype, and train the process — so the system is actually used.",
    forWhom: "Leadership, operations, controls",
  },
  {
    title: "Executive Reporting + Decision Support",
    body: "Board-ready forecasts, risk/opportunity, and recommended action — audit-aware and traceable to source.",
    forWhom: "Executives, owners",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Three ways Artemis is put to work"
        description={`${companyPositioning.whatWeAre} ${companyPositioning.acronymFraming.today}`}
      >
        <div className="space-y-5">
          <p className="max-w-2xl rounded-lg border border-border/60 bg-navy-deep/40 p-4 text-sm text-muted-foreground">
            {companyPositioning.acronymFraming.intro}{" "}
            <span className="text-foreground/85">ARTEMIS — {ARTEMIS_FULL}</span>.{" "}
            {companyPositioning.acronymFraming.ambition}
          </p>
          <Button href="/contact" size="lg">
            Request a Pilot
          </Button>
        </div>
      </PageHero>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            {solutionPillars.map((p) => (
              <Link key={p.slug} href={p.href} className="group">
                <Card className="flex h-full flex-col">
                  {p.beachhead ? <Badge>Beachhead</Badge> : <Badge>Solution</Badge>}
                  <CardTitle className="mt-4">{p.title}</CardTitle>
                  <CardDescription className="flex-1">{p.summary}</CardDescription>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities — six solution blocks */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Capabilities"
            title="What Artemis delivers"
            lede="Six connected capabilities across the project lifecycle — from controls and production to forecast, cash, adoption, and executive decisions."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutionBlocks.map((b) => (
              <Card key={b.title} className="h-full">
                <CardTitle className="text-lg">{b.title}</CardTitle>
                <CardDescription>{b.body}</CardDescription>
                <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  For: {b.forWhom}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Audiences */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Who it's for"
            title="Built for the people who carry the forecast"
            lede="Artemis speaks to the field, the controls desk, the finance office, and the boardroom — with one connected source of truth."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {audiences.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border/70 bg-navy-deep/50 px-3 py-1.5 text-sm text-foreground/85"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/contact" size="lg">Request a Pilot</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
