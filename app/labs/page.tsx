import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllMeta } from "@/lib/content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Labs",
  path: "/labs",
  description:
    "Experimental cinematic intelligence demos and prototypes from Artemis Omni — new visualizations, agents, and interaction models.",
});

export default function LabsPage() {
  const experiments = getAllMeta("labs");

  return (
    <>
      <PageHero
        eyebrow="Labs"
        title="Cinematic intelligence, in prototype"
        description="Where Artemis prototypes new visualizations, agents, and interaction models before they ship into solutions. Expect rough edges and bold ideas."
      >
        <Badge>Experimental</Badge>
      </PageHero>
      {/* Featured public showcase (synthetic) */}
      <section className="pt-16">
        <Container>
          <Link href="/labs/construction-intelligence-workbench" className="group">
            <Card className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Badge>Public Showcase</Badge>
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                  Synthetic data
                </span>
              </div>
              <CardTitle className="mt-2">Construction Intelligence Workbench</CardTitle>
              <CardDescription>
                A synthetic public showcase: KPIs, a Bid vs Actuals vs PM Forecast vs System
                Projection comparison, risk/opportunity, change exposure, and an audit-aware
                data path. No real project data.
              </CardDescription>
              <span className="mt-3 inline-flex items-center gap-2 text-sm text-gold">
                Open workbench
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          {experiments.length === 0 ? (
            <p className="text-muted-foreground">No experiments published yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experiments.map((item) => (
                <ContentCard key={item.slug} item={item} basePath="/labs" />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
