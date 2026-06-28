import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ConstructionIntelligenceWorkbench } from "@/components/labs/ConstructionIntelligenceWorkbench";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Construction Intelligence Workbench",
  path: "/labs/construction-intelligence-workbench",
  description:
    "A synthetic public showcase of Artemis construction-intelligence patterns — KPIs, a Bid vs Actuals vs PM Forecast vs System Projection comparison, risk/opportunity, change exposure, and an audit-aware data path. Synthetic sample data only.",
});

export default function ConstructionIntelligenceWorkbenchPage() {
  return (
    <>
      <PageHero
        eyebrow="Labs · Synthetic Showcase"
        title="Construction Intelligence Workbench"
        description="A net-new, synthetic demonstration of Artemis construction-intelligence patterns — built for the public showcase with generic sample data, no 3D or maps, and no real project information."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Synthetic data</Badge>
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Labs
          </Link>
        </div>
      </PageHero>

      <section className="py-12 lg:py-16">
        <Container>
          <ConstructionIntelligenceWorkbench />
        </Container>
      </section>
    </>
  );
}
