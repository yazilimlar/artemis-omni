import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArtemisExperienceShell } from "@/components/experience/ArtemisExperienceShell";
import { demoAssets, demoBuckets, demoCaveat } from "@/lib/artemis/demoAssets";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Demo Center",
  path: "/demo",
  description:
    "The Artemis executive demo library — workbenches, dashboards, and showcases catalogued by readiness. Catalogue only; nothing is embedded yet.",
});

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Demo Center"
        title="Executive demo library"
        description="A catalogue of Artemis workbenches, dashboards, and showcases — organized by readiness for public release."
      />

      {/* Experience Engine preview (placeholder, no WebGL yet) */}
      <section className="py-12 lg:py-16">
        <Container>
          <SectionHeading
            eyebrow="Experience Engine (preview)"
            title="The shell for future cinematic demos"
            description="A lightweight placeholder that establishes the interaction modes and layout. Cinematic WebGL scenes mount here in a later branch."
          />
          <div className="mt-8">
            <ArtemisExperienceShell />
          </div>
        </Container>
      </section>

      {/* Catalogue */}
      <section className="pb-8">
        <Container>
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm text-foreground/85">
            <span className="eyebrow">Caveat</span>
            <p className="mt-1">{demoCaveat}</p>
          </div>
        </Container>
      </section>

      {demoBuckets.map((bucket) => {
        const items = demoAssets.filter((a) => a.priority === bucket.id);
        if (items.length === 0) return null;
        return (
          <section key={bucket.id} className="pb-12">
            <Container>
              <SectionHeading eyebrow={bucket.id} title={bucket.title} description={bucket.blurb} />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <Card key={a.name} className="flex h-full flex-col">
                    <Badge>{a.classification}</Badge>
                    <CardTitle className="mt-4 text-lg">{a.name}</CardTitle>
                    <CardDescription className="flex-1">{a.demonstrates}</CardDescription>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{a.note}</p>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
