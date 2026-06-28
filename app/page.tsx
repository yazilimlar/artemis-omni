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
    "Artemis Omni — the AI-first intelligence atelier for engineering, construction, and project controls. 5D cost intelligence, AI decision meshes, and executive dashboards.",
});

const capabilities = [
  {
    icon: Gauge,
    title: "5D Project Controls",
    body: "Cost, schedule, and scope fused into live S-curves, EAC forecasts, and cash-flow intelligence.",
  },
  {
    icon: Workflow,
    title: "AI Automation",
    body: "Invoice extraction, fuel-price adjustments, and reporting handled by an auditable agent mesh.",
  },
  {
    icon: Boxes,
    title: "BIM & Field Intelligence",
    body: "Structural fragments, geotechnical data, and field signals tied back to the model of record.",
  },
  {
    icon: GraduationCap,
    title: "Academy & Tools",
    body: "Tutorials, calculators, and decision-support tools that turn methods into reusable craft.",
  },
];

const pillars = [
  {
    href: "/solutions",
    kicker: "Solutions",
    title: "Systems built for the jobsite and the boardroom",
    body: "Domain AI for engineering, construction, and operations — engineered for accuracy, not novelty.",
  },
  {
    href: "/labs",
    kicker: "Labs",
    title: "Cinematic intelligence experiments",
    body: "Where new visualizations, agents, and interaction models are prototyped before they ship.",
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
            title="A studio for technical intelligence"
            description="Artemis composes the artifacts of complex projects into clear, defensible decisions — with the craft of a classical engineering atelier and the speed of modern automation."
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
