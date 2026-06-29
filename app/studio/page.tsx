import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { StudioWorkbench } from "@/components/studio/StudioWorkbench";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Studio",
  path: "/studio",
  description:
    "Artemis Studio — a generative workbench for prompts, images, video, sound, renders, plots, and movies. Runs key-free in simulation mode, ready for live providers.",
  keywords: [
    "AI studio",
    "prompt generator",
    "image generator",
    "video generator",
    "sound generator",
    "render",
    "plot",
    "movie treatment",
  ],
});

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="Studio"
        title="A generative workbench for the whole pipeline"
        description="Auto-prompt, image, video, sound, render, plot, and movie — in one place. Everything runs key-free in simulation mode and is pre-wired to switch to live providers when you add API keys."
      />
      <section className="py-12 lg:py-16">
        <Container>
          <StudioWorkbench />
        </Container>
      </section>
    </>
  );
}
