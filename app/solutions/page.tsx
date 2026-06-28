import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Solutions",
  path: "/solutions",
  description:
    "AI systems for engineering, construction, project controls, business operations, and automation — built for accuracy and auditability.",
});

const solutions = [
  {
    tag: "Project Controls",
    title: "5D Cost Intelligence",
    body: "Fuse cost, schedule, and scope into live S-curves, earned-value metrics, and forecast-at-completion. Turn project-control artifacts into a single source of truth.",
  },
  {
    tag: "Automation",
    title: "AI Invoice & Document Processing",
    body: "Extract, validate, and reconcile invoices, fuel-price adjustments, and contracts with an auditable agent pipeline that flags exceptions instead of hiding them.",
  },
  {
    tag: "Engineering",
    title: "BIM & Geotechnical Signals",
    body: "Connect structural fragments, geotechnical data, and field reports back to the model of record for grounded, explainable engineering decisions.",
  },
  {
    tag: "Operations",
    title: "Executive Reporting",
    body: "Generate board-ready dashboards and narratives from project data — consistent, defensible, and on demand.",
  },
  {
    tag: "Decision Support",
    title: "Interactive Tools & Calculators",
    body: "Embed decision-support tools directly into the workflow, from fuel price adjustment to cash-flow modeling.",
  },
  {
    tag: "Knowledge",
    title: "AI-Generated Academy Content",
    body: "Tutorials, glossaries, and frameworks generated and maintained as modular, governed content packages.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Systems built for the jobsite and the boardroom"
        description="Artemis delivers domain AI for engineering, construction, and operations — engineered for accuracy and auditability, not novelty."
      >
        <Button href="/contact" size="lg">
          Request a Pilot
        </Button>
      </PageHero>

      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="What Artemis can run today and pilot tomorrow"
            description="Each solution is composed from the same intelligence core — shared artifacts, shared governance, shared visual language."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Card key={s.title} className="h-full">
                <Badge>{s.tag}</Badge>
                <CardTitle className="mt-4">{s.title}</CardTitle>
                <CardDescription>{s.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
