import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About",
  path: "/about",
  description:
    "Artemis Omni is an AI-first intelligence atelier fusing classical engineering craft with modern automation for the built environment.",
});

const principles = [
  {
    title: "Accuracy over novelty",
    body: "Intelligence is only useful if it is trustworthy. Every output is traceable to its source artifacts.",
  },
  {
    title: "Craft over templates",
    body: "We compose dashboards, models, and narratives like an atelier — deliberate, legible, and elegant.",
  },
  {
    title: "Augment, don't obscure",
    body: "Automation should make experts faster and decisions clearer — never a black box.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="An intelligence atelier for the built environment"
        description="Artemis Omni fuses the discipline of a classical engineering studio with modern AI — turning the raw artifacts of complex projects into executive-grade decisions."
      />

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Philosophy"
            title="Ancient intelligence, modern automation"
            description="The name Artemis evokes the lunar, the precise, the watchful. Our work pairs that classical sensibility with rigorous, auditable engineering."
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

      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <SectionHeading
            eyebrow="Phase"
            title="A prototype, deployed deliberately"
            description="Artemis is currently piloting inside the aGOraXai ecosystem at artemis.agoraxai.com before its independent launch. We build in public, ship in focused increments, and measure outcomes."
          />
          <Button href="/contact" size="lg">
            Request a Pilot
          </Button>
        </Container>
      </section>
    </>
  );
}
