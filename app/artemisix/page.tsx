import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { StudioIX } from "@/components/artemisix/StudioIX";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "ArtemisIX",
  path: "/artemisix",
  description:
    "ArtemisIX — the next-generation Artemis studio. Auto-prompt, image, video, sound, render, plot, movie, six-dialect translation, and a live 3D conceptual model, with a demonstrator library.",
  keywords: [
    "ArtemisIX",
    "AI studio",
    "3D model viewer",
    "six dialects",
    "sewer utility intelligence",
    "generative workbench",
  ],
});

export default function ArtemisIXPage() {
  return (
    <>
      <PageHero
        eyebrow="ArtemisIX"
        title="The next-generation Artemis studio"
        description="Everything in the Studio — auto-prompt, image, video, sound, render, plot, movie — augmented with two cockpit-native generators: one truth in six professional dialects, and a live 3D conceptual model. Key-free in simulation mode; live-provider ready."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/artemisix/modules">Explore the module registry</Button>
          <Button href="/api/artemisix/registry" variant="outline">
            Live registry API
          </Button>
        </div>
      </PageHero>
      <section className="py-12 lg:py-16">
        <Container>
          <StudioIX />
        </Container>
      </section>
    </>
  );
}
