import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
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
