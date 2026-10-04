import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { PlatformStats } from "@/components/platform/PlatformStats";
import { PlatformTimeline } from "@/components/platform/PlatformTimeline";
import { filterForPublic } from "@/lib/evolution/public-filter";
import { loadEvolution } from "@/lib/evolution/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Platform",
  path: "/platform",
  description:
    "How the Artemis platform was built, in data: a public-safe timeline of shipped capabilities and architectural decisions.",
});

const principles = [
  {
    title: "One umbrella, many products",
    body: "Artemis is a platform of divisions and products. A branch is a work state, not a product identity.",
  },
  {
    title: "Every subject in its own visual language",
    body: "Pages present their subject in the visuals native to it: schedules for plumbing, plots for forecasting, maps for places.",
  },
  {
    title: "Compose proven parts",
    body: "Where mature open-source services exist, Artemis defines the interface and composes them rather than rebuilding them.",
  },
];

export default function PlatformPage() {
  const { events, stats, generated_at } = loadEvolution();
  const publicEvents = filterForPublic(events);

  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Artemis Platform"
        description="How this system was built, in data."
      />

      <PlatformStats events={publicEvents} stats={stats} generatedAt={generated_at} />

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Timeline"
            title="What shipped, and the decisions behind it"
            description="A public-safe selection from the repository's own history, newest first."
          />
          <div className="mt-8">
            <PlatformTimeline events={publicEvents} />
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="Principles"
            title="How the platform is shaped"
            description="Three decisions that guide the work."
          />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {principles.map((item) => (
              <li key={item.title} className="rounded-lg border border-border/70 bg-navy-deep/40 p-5">
                <p className="display-serif text-lg text-parchment">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <Link href="/labs" className="inline-flex items-center gap-2 text-sm text-gold">
            Explore the labs <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Container>
      </section>
    </>
  );
}
