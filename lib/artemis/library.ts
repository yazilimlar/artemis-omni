/**
 * Portfolio / Library data — for /portfolio and /library landing pages.
 * Catalogues knowledge artifacts and (future) showcase work. No client data;
 * production candidates require review before public release.
 */
export type LibraryKind =
  | "Doctrine"
  | "Method"
  | "Publishing"
  | "Strategy"
  | "Brand"
  | "Showcase"
  | "Program"
  | "Tool";

export type LibraryItem = {
  slug: string;
  title: string;
  kind: LibraryKind;
  summary: string;
  /** Internal link if it maps to a live route or doc, else null. */
  href: string | null;
  classification: "Public-safe" | "Private demo" | "Reference only" | "Production candidate";
};

export const libraryItems: LibraryItem[] = [
  {
    slug: "implementation-doctrine",
    title: "Artemis Implementation Doctrine",
    kind: "Doctrine",
    summary: "AI does not replace fundamentals — it amplifies disciplined fundamentals.",
    href: null,
    classification: "Reference only",
  },
  {
    slug: "transition-method",
    title: "Artemis Transition Method (Phase 0–6)",
    kind: "Method",
    summary: "Diagnostic → Semantic Modeling → Prototype → Training → Implementation → Optimization → Operating System.",
    href: null,
    classification: "Reference only",
  },
  {
    slug: "executive-demo-library",
    title: "Executive Demo Library",
    kind: "Strategy",
    summary: "Triage of workbenches, dashboards, and render references with public/private classification.",
    href: "/demo",
    classification: "Reference only",
  },
  {
    slug: "programs-and-tutorials-catalog",
    title: "Programs & Tutorials Catalog",
    kind: "Program",
    summary:
      "A public-safe lookup page for attached programs, tutorials, HTML demos, solution cockpits, and exemplary files.",
    href: "/library/programs",
    classification: "Public-safe",
  },
  {
    slug: "artemisix19-autonomous-generator",
    title: "ArtemisIX19 Autonomous Generator",
    kind: "Showcase",
    summary:
      "A public-safe generator studio for prompts, images, renders, videos, plots, movie beats, and sound cues derived from protected Artemis reference work.",
    href: "/labs/artemisix19",
    classification: "Public-safe",
  },
  {
    slug: "ai-insight-publication-engine",
    title: "AI Insight & Publication Engine",
    kind: "Publishing",
    summary:
      "A public-safe editorial system for turning field knowledge, caveats, controls data, and AI review into articles, visuals, and implementation lessons.",
    href: "/insights",
    classification: "Public-safe",
  },
  {
    slug: "system-graphics",
    title: "System Graphics Strategy",
    kind: "Strategy",
    summary: "A repeatable visual language; every graphic answers the six-question rule.",
    href: null,
    classification: "Reference only",
  },
  {
    slug: "fuel-price-adjustment",
    title: "Fuel Price Adjustment Calculator",
    kind: "Tool",
    summary: "Interactive contract fuel-price adjustment model — runs in the browser.",
    href: "/tools/fuel-price-adjustment",
    classification: "Public-safe",
  },
  {
    slug: "5d-cost-control",
    title: "5D Cashflow Control (Academy)",
    kind: "Showcase",
    summary: "What 2D–5D mean and why 5D is Bid vs Actuals vs PM Forecast vs System Projections.",
    href: "/academy/5d-cost-control",
    classification: "Public-safe",
  },
  {
    slug: "brand-asset-intake",
    title: "Brand Asset Intake",
    kind: "Brand",
    summary: "AI-generated reference imagery and palette direction (stored privately).",
    href: null,
    classification: "Reference only",
  },
];
