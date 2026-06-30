import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { LiveDashboardCard } from "@/components/showcase/LiveDashboardCard";
import { OrganizationArchitectureDiagram } from "@/components/showcase/OrganizationArchitectureDiagram";
import { solutionPillars, ARTEMIS_FULL } from "@/lib/artemis/solutions";
import { companyPositioning } from "@/lib/artemis/positioning";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Solutions",
  path: "/solutions",
  description:
    "Three Artemis solution pillars: AI Business Systems, Construction Intelligence (the 5D beachhead), and Engineering Visualization.",
});

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

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Operating Architecture"
            title="Client company operating blueprint"
            description="Each solution starts by mapping the organization, not by adding isolated AI features. Artemis connects business goals, operating teams, systems, documents, review gates, and executive action."
          />
          <div className="mt-10 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <OrganizationArchitectureDiagram
              title="Solution implementation map"
              subtitle="A public-safe version of the architecture Artemis would build for a client: operating inputs on the left, reviewed implementation logic at the center, and executive outputs on the right."
              organizationName="Client Company / Organization"
            />
            <LiveDashboardCard
              title="Solution cockpit"
              subtitle="A breathing executive view for status, source health, exception velocity, and next operating action."
              variant="flux"
            />
          </div>
        </Container>
      </section>

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
    </>
  );
}
