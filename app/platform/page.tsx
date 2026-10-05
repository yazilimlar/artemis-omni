import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/container";
import { ExecutiveSectionHeader } from "@/components/showcase/ExecutiveSectionHeader";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Artemis Platform",
  path: "/platform",
  description:
    "The Artemis platform: an AI-native system for turning project fundamentals into executive action — designed, built, and shipped in eight governed stages.",
});

const pipeline = [
  {
    stage: "01",
    title: "Prompt",
    body: "Every build starts from a written brief: the problem, the audience, and the evidence it must show.",
  },
  {
    stage: "02",
    title: "AI build",
    body: "AI systems draft the implementation — pages, components, data pipelines, and visuals.",
  },
  {
    stage: "03",
    title: "AI review",
    body: "An independent AI reviewer challenges the draft before any human sees it.",
  },
  {
    stage: "04",
    title: "Human review",
    body: "A person approves what the machines proposed. Nothing ships on AI authority alone.",
  },
  {
    stage: "05",
    title: "Pull request",
    body: "Changes are proposed as reviewable units, each with a written summary of what changed and why.",
  },
  {
    stage: "06",
    title: "Vercel preview",
    body: "Every proposal gets a live preview URL. Judge the work itself, not a description of it.",
  },
  {
    stage: "07",
    title: "Merge",
    body: "Approved work joins the main line — the single source of truth for what is live.",
  },
  {
    stage: "08",
    title: "Production",
    body: "The main line deploys automatically. The site you are reading was built exactly this way.",
  },
];

const principles = [
  {
    title: "One umbrella, many products",
    body: "Artemis is a platform of divisions and products. Experiments may start anywhere; a product earns its identity by shipping.",
  },
  {
    title: "Every subject in its own visual language",
    body: "Pages present their subject in the visuals native to it: schedules for plumbing, plots for forecasting, maps for places.",
  },
  {
    title: "Compose proven parts",
    body: "Where mature open-source services exist, Artemis sets the standard and composes them rather than rebuilding them.",
  },
];

const proofLinks = [
  {
    title: "Demos & Portfolio",
    body: "Working demos and showcases you can open right now.",
    href: "/portfolio",
  },
  {
    title: "Labs",
    body: "Experiments with a review boundary — synthetic where live, honest about what is proven.",
    href: "/labs",
  },
  {
    title: "Geometric Workbench",
    body: "Parametric geometry running live in the browser.",
    href: "/workbench",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Artemis Platform"
        description="An AI-native platform for infrastructure and construction intelligence — turning project fundamentals into executive action."
      />

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="What it is"
            title="One platform, many products"
            description="Artemis is a platform of divisions and products with a flagship focus on construction intelligence: 5D cost control, digital twins, finance, document intelligence, and integrations — designed, built, and operated as one system."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {proofLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border/70 bg-navy-deep/40 p-5 transition hover:border-gold/40"
              >
                <p className="display-serif text-lg text-parchment">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-gold">
                  Open <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 py-12 lg:py-16">
        <Container>
          <ExecutiveSectionHeader
            eyebrow="How it is built"
            title="Eight stages, every time"
            description="Every Artemis surface — this page included — ships through the same governed pipeline."
          />
          <ol className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pipeline.map((item) => (
              <li
                key={item.stage}
                className="rounded-lg border border-border/70 bg-navy-deep/40 p-5"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold-soft">
                  {item.stage}
                </p>
                <p className="display-serif mt-2 text-lg text-parchment">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
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
              <li
                key={item.title}
                className="rounded-lg border border-border/70 bg-navy-deep/40 p-5"
              >
                <p className="display-serif text-lg text-parchment">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-gold">
            See the work <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Container>
      </section>
    </>
  );
}
