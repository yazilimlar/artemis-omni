import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeatureAsset } from "@/lib/artemis/brandAssets";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About",
  path: "/about",
  description:
    "Artemis Omni is a 5D Construction Intelligence Bridge for heavy civil and infrastructure — connecting design, field production, and actual cost to live cashflow forecasts and executive action.",
});

const principles = [
  {
    title: "Accuracy over novelty",
    body: "A forecast is only useful if it is trustworthy. Every number is traceable to its source — bid, actuals, schedule, and field production.",
  },
  {
    title: "Connected, not siloed",
    body: "Design, geometry, quantities, schedule, cost, and billing belong in one bridge — so a field change reaches the cashflow forecast automatically.",
  },
  {
    title: "Augment, don't obscure",
    body: "Automation should make estimators and controls managers faster and decisions clearer — never a black box.",
  },
];

export default function AboutPage() {
  const brandFeature = getFeatureAsset();
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A 5D Construction Intelligence Bridge"
        description="Artemis Omni connects the artifacts of heavy civil and infrastructure delivery — geometry, quantities, schedule, field production, and actual cost — into live cashflow forecasts and executive action."
      />

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Method"
            title="One source of truth, from bid to cash"
            description="Artemis is built for the people who carry the forecast: estimators, project controls managers, PMCM teams, infrastructure owners, and executives. Rigorous, auditable, and connected end to end."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {principles.map((p) => (
              <Card key={p.title}>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription>{p.body}</CardDescription>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Brand identity accent */}
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Link
            href="/brand"
            className="group block overflow-hidden rounded-2xl border border-border/60 bg-navy-deep/30"
          >
            <Image
              src={brandFeature.src}
              alt={brandFeature.alt}
              width={brandFeature.width}
              height={brandFeature.height}
              sizes="(min-width: 1024px) 38vw, 88vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>
          <div>
            <SectionHeading
              eyebrow="Identity"
              title="Precision, made visible"
              description="The Artemis figure signals intent and accuracy; the system graphics, palette, and Greek-meander motifs carry the engineering and project-controls story. Explore the brand identity, palette, and concept art."
            />
            <Button href="/brand" variant="outline" className="mt-6">
              View the brand
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <SectionHeading
            eyebrow="Phase"
            title="A prototype, built deliberately"
            description="Artemis is an early-stage prototype. We build in focused increments, validate on real project data, and measure outcomes before we expand scope."
          />
          <Button href="/contact" size="lg">
            Request a Pilot
          </Button>
        </Container>
      </section>
    </>
  );
}
