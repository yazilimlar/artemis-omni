import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
