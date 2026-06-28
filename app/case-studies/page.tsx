import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
import { getAllMeta } from "@/lib/content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Case Studies",
  path: "/case-studies",
  description:
    "Outcomes from AI-driven project intelligence — cost control, automation, and executive reporting on real engineering and construction programs.",
});

export default function CaseStudiesPage() {
  const studies = getAllMeta("case-studies");

  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Evidence over adjectives"
        description="How Artemis intelligence changes outcomes on real engineering and construction programs — measured in cost, time, and clarity."
      />
      <section className="py-16 lg:py-20">
        <Container>
          {studies.length === 0 ? (
            <p className="text-muted-foreground">Case studies are being prepared.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studies.map((item) => (
                <ContentCard key={item.slug} item={item} basePath="/case-studies" />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
