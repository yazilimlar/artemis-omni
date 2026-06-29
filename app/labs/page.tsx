import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/content/ContentCard";
import { ProofCard } from "@/components/showcase/ProofCard";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { proofLibrary } from "@/lib/artemis/proofLibrary";
import { getAllMeta } from "@/lib/content";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Labs · Proof Library",
  path: "/labs",
  description:
    "The Artemis proof library — workbenches and showcases for 5D construction intelligence and AI implementation. Each entry shows the decision it improves, the data it connects, and its status. Public showcases use synthetic data.",
});

export default function LabsPage() {
  const notes = getAllMeta("labs");

  return (
    <>
      <PageHero
        eyebrow="Labs · Proof Library"
        title="Evidence, not adjectives"
        description="Workbenches, inspectors, and system graphics that prove the Artemis approach. Each entry states the executive value, the technical proof, the data it connects, and the decision it improves. Public showcases use synthetic data; private demos are available on request."
      />

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proofLibrary.map((item) => (
              <ProofCard key={item.slug} item={item} />
            ))}
          </div>
        </Container>
      </section>

      {notes.length > 0 ? (
        <section className="border-t border-border/60 py-16 lg:py-20">
          <Container>
            <ExecutiveSectionHeader
              eyebrow="Lab notes"
              title="Notes from the workbench"
              lede="Short write-ups on method, performance, and design decisions behind the showcases."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((item) => (
                <ContentCard key={item.slug} item={item} basePath="/labs" />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
