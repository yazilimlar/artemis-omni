import { ARTEMIS_ACRONYM, companyPositioning } from "@/lib/artemis/positioning";

/**
 * Solution pillars — the three top-level ways Artemis is sold.
 *
 * The full ARTEMIS acronym is retained as the *formal brand expansion only*:
 *   ARTEMIS = "Autonomous Robotics Technology for Engineering, Modeling &
 *   Intelligent Systems"
 * Public copy leads with AI implementation + the Construction Intelligence
 * beachhead — never with "robotics" as a current product category.
 */
export const ARTEMIS_FULL = ARTEMIS_ACRONYM;

export type SolutionPillar = {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  summary: string;
  forWhom: string[];
  capabilities: string[];
  outcomes: string[];
  beachhead?: boolean;
};

export const solutionPillars: SolutionPillar[] = [
  {
    slug: "ai-business-systems",
    href: "/solutions/ai-business-systems",
    title: "AI Business Systems",
    tagline: "Turn scattered tools into a governed operating system.",
    summary:
      "Implementation frameworks that move a company off Excel/email/manual workflows into human-reviewed, audit-aware AI operations — with source-labeled assumptions and controlled integrations.",
    forWhom: [
      "Small and mid-sized companies",
      "Operations and finance leaders",
      "Owners modernizing back-office workflows",
    ],
    capabilities: [
      "Workflow diagnosis and bottleneck mapping",
      "Semantic data modeling and systems-of-record boundaries",
      "Document intelligence and controlled automation",
      "Human review points and audit trails",
    ],
    outcomes: [
      "Faster, traceable reporting",
      "Less manual re-keying and dispute",
      "Adoption through process training, not just tools",
    ],
  },
  {
    slug: "construction-intelligence",
    href: "/solutions/construction-intelligence",
    title: "Construction Intelligence",
    tagline: companyPositioning.beachheadOneLiner,
    summary:
      "5D construction intelligence for heavy civil and infrastructure: link design, geometry, quantities, schedule, field production, and actual cost into a live cashflow forecast comparing Bid Estimate vs Actuals vs PM Forecast vs system-generated projections.",
    forWhom: [
      "Heavy civil contractors",
      "Infrastructure owners",
      "PMCM teams, estimators, and project controls managers",
    ],
    capabilities: [
      "5D cashflow forecasting (Bid vs Actuals vs PM Forecast vs System Projection)",
      "ERP / CMiC cost and billing workflows",
      "Field production tied to actual cost and billing revenue",
      "Executive risk / opportunity and reporting",
    ],
    outcomes: [
      "A single, defensible source of truth",
      "Earlier visibility into cost and cash exposure",
      "Executive-ready forecasts with confidence levels",
    ],
    beachhead: true,
  },
  {
    slug: "engineering-visualization",
    href: "/solutions/engineering-visualization",
    title: "Engineering Visualization",
    tagline: "From model geometry to money and meaning.",
    summary:
      "2D → 3D → 4D → 5D digital-twin and engineering visualization that connects real geometry and quantities to schedule sequencing, constructability, and cost — the model of record behind the forecast.",
    forWhom: [
      "Engineering and design teams",
      "Digital-twin and VDC groups",
      "Owners requiring model-grounded decisions",
    ],
    capabilities: [
      "Geometry, quantities, and spatial relationships",
      "Schedule sequencing and production logic (4D)",
      "Model-to-money linkage (5D)",
      "Geometry QA and plan review (controlled)",
    ],
    outcomes: [
      "Constructability surfaced early",
      "Quantities grounded in the model",
      "Visualization that drives decisions, not decoration",
    ],
  },
];

export function getSolutionPillar(slug: string): SolutionPillar | null {
  return solutionPillars.find((p) => p.slug === slug) ?? null;
}

/** The 2D–5D dimensional definitions (strict Artemis meanings). */
export const dimensionModel: { dim: string; meaning: string }[] = [
  { dim: "2D", meaning: "Drawings, plans, areas, sheets, profiles, sections, and takeoff surfaces." },
  { dim: "3D", meaning: "Real geometry, model elements, quantities, spatial relationships, and constructability." },
  { dim: "4D", meaning: "Time-based simulation: schedule, sequencing, planned vs actual progress, production logic." },
  { dim: "5D", meaning: "Cashflow projection: Bid Estimate vs Actuals vs PM Forecast vs System-Generated Projections." },
];
