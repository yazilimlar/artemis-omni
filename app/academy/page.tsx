import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
import { getAllMeta } from "@/lib/content";
import type { ContentMeta } from "@/lib/content/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Academy",
  path: "/academy",
  description:
    "Tutorials, explainers, glossaries, and executive reporting frameworks for project controls, construction intelligence, and AI automation.",
});

/**
 * Standalone Tech Stack documents (TS-A2, TS-COM-01). These live as their own
 * routes (app/academy/tech-stack-*) rather than MDX articles, so the MDX-driven
 * grid above cannot see them — they are listed here explicitly, otherwise the
 * routes are live but linked from nowhere.
 */
const techStackDocuments: ContentMeta[] = [
  {
    slug: "tech-stack-com-01",
    collection: "academy",
    title: "ARTEMIS Tech Stack — Combined · COM-01",
    summary:
      "Document TS-COM-01 joins the full TS-A1 statement inside the TS-A2 instrument — interactive 3D Live 5D stack, constellation, lifecycle scrubber, and five bases on one live clock, in six views.",
    date: "2026-10-29",
    category: "Tech Stack",
  },
  {
    slug: "tech-stack-a2",
    collection: "academy",
    title: "ARTEMIS Tech Stack — Academy · A2",
    summary:
      "Document TS-A2 restates TS-A1 as a working instrument: turn the six-layer Live 5D stack, explore the OctopusG constellation, and scrub the collaboration stage through the phases of a job.",
    date: "2026-10-29",
    category: "Tech Stack",
  },
];

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
      <section className="border-t border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Tech Stack"
            title="The Tech Stack documents"
            description="The standalone Tech Stack editions — the A2 interactive instrument and the combined COM-01 document built from A1 + A2."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {techStackDocuments.map((item) => (
              <ContentCard key={item.slug} item={item} basePath="/academy" />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
