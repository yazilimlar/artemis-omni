import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
import { getAllMeta } from "@/lib/content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Academy",
  path: "/academy",
  description:
    "Tutorials, explainers, glossaries, and executive reporting frameworks for project controls, construction intelligence, and AI automation.",
});

export default function AcademyPage() {
  const articles = getAllMeta("academy");

  return (
    <>
      <PageHero
        eyebrow="Academy"
        title="Methods, made into craft"
        description="Tutorials and frameworks that turn project-controls and construction-intelligence methods into reusable knowledge. New AI-generated content packages land here."
      />
      <section className="py-16 lg:py-20">
        <Container>
          {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles published yet.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((item) => (
                <ContentCard key={item.slug} item={item} basePath="/academy" />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
