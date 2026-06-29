export type StatusTone =
  | "public"
  | "synthetic"
  | "private"
  | "sanitize"
  | "pilot"
  | "reference"
  | "test";

export type ProofModule = {
  slug: string;
  title: string;
  eyebrow: string;
  href?: string;
  statusLabel: string;
  statusTone: StatusTone;
  summary: string;
  decision: string;
  signals: string[];
  outcomes: string[];
  boundary: string;
};

export const artemisBridgeValueChain = [
  "Design",
  "Geometry",
  "Quantities",
  "Schedule",
  "Field Production",
  "Actual Cost",
  "Billing Revenue",
  "PM Forecast",
  "System-Generated Projections",
  "Cashflow",
  "Risk / Opportunity",
  "Executive Action",
] as const;

export const proofModules: ProofModule[] = [
  {
    slug: "utility-intelligence-bridge",
    title: "Utility Intelligence Bridge",
    eyebrow: "Infrastructure proof",
    href: "/labs/utility-intelligence-bridge",
    statusLabel: "Public narrative",
    statusTone: "public",
    summary:
      "A public-safe executive story for utility and heavy-civil programs: model context, field production, cost exposure, and forecast logic in one bridge.",
    decision:
      "Which scope packages need executive action before field variance becomes cashflow damage?",
    signals: [
      "Design packages",
      "Utility geometry",
      "Field production",
      "Actual cost",
      "Billing status",
      "Forecast exposure",
    ],
    outcomes: [
      "Earlier variance detection",
      "Cleaner owner and contractor conversations",
      "A repeatable project-controls operating view",
    ],
    boundary:
      "This public page is narrative only. Real program workbenches stay private until rebuilt with synthetic or approved data.",
  },
  {
    slug: "forecast-exposure-control-center",
    title: "Forecast Exposure Control Center",
    eyebrow: "Executive controls",
    statusLabel: "Sanitize required",
    statusTone: "sanitize",
    summary:
      "A range-and-confidence view for cost exposure, cash timing, and forecast drift across bid, actuals, PM forecast, and system projections.",
    decision:
      "How much exposure exists, how confident is the range, and what action reduces it this period?",
    signals: [
      "Bid estimate",
      "Actual cost",
      "Change exposure",
      "Forecast range",
      "Assumptions",
      "Approval state",
    ],
    outcomes: [
      "Confidence-banded forecasts",
      "More explicit assumptions",
      "A controlled escalation list for finance and operations",
    ],
    boundary:
      "Reference material contains client-specific context and must be sanitized before any public demo.",
  },
  {
    slug: "model-to-money-inspector",
    title: "Model-to-Money Inspector",
    eyebrow: "5D QA",
    statusLabel: "Private reference",
    statusTone: "private",
    summary:
      "A proof path for tracing model geometry and quantities into cost codes, billing views, and cashflow consequences.",
    decision:
      "Which model or quantity issue changes the commercial forecast enough to require review?",
    signals: [
      "Model geometry",
      "Quantity takeoff",
      "Cost code mapping",
      "Billing rules",
      "QA confidence",
      "Forecast impact",
    ],
    outcomes: [
      "Better quantity traceability",
      "Clearer QA exceptions",
      "A direct line from model issues to money decisions",
    ],
    boundary:
      "Current references are private. Public versions require generic geometry, synthetic cost codes, and review gates.",
  },
  {
    slug: "geometry-qa-plan-editing-sandbox",
    title: "Geometry QA + Plan Editing Sandbox",
    eyebrow: "Human review",
    statusLabel: "Private reference",
    statusTone: "private",
    summary:
      "A controlled editing concept for plan markups, geometry exceptions, and human-reviewed correction workflows.",
    decision:
      "Which geometry edits are safe to accept, which need engineer review, and which should remain exceptions?",
    signals: [
      "Plan markups",
      "Geometry deltas",
      "Reviewer notes",
      "Exception status",
      "Revision history",
      "QA confidence",
    ],
    outcomes: [
      "Traceable plan edits",
      "Clear human approval gates",
      "Fewer unreviewed geometry-to-cost changes",
    ],
    boundary:
      "This remains a sandbox concept until edit permissions, audit trails, and sanitized plan data are defined.",
  },
  {
    slug: "geodesic-intelligence-workbench",
    title: "Geodesic Intelligence Workbench",
    eyebrow: "Spatial controls",
    href: "/labs/geodesic-intelligence",
    statusLabel: "Public narrative",
    statusTone: "public",
    summary:
      "A public-safe narrative for connecting alignments, survey/control context, field observations, and cost exposure without publishing raw maps or project data.",
    decision:
      "Where does spatial variance create schedule, production, or commercial risk?",
    signals: [
      "Survey control",
      "Alignment logic",
      "Work zones",
      "Field observations",
      "Production quantities",
      "Risk flags",
    ],
    outcomes: [
      "Spatially grounded variance conversations",
      "Faster coordination across engineering and field teams",
      "A safer path toward future map-backed private demos",
    ],
    boundary:
      "No raw maps, tiles, coordinates, or project identifiers are published in this public narrative.",
  },
  {
    slug: "artemis-workbench-shell",
    title: "Artemis Workbench Shell",
    eyebrow: "Reusable system",
    href: "/labs/construction-intelligence-workbench",
    statusLabel: "Synthetic live",
    statusTone: "synthetic",
    summary:
      "The reusable Artemis workbench pattern: executive KPIs, source-labeled assumptions, forecast comparisons, registers, and CTA surfaces.",
    decision:
      "Can a project team review the same trusted operating picture without opening five disconnected systems?",
    signals: [
      "KPI panels",
      "Forecast chart",
      "Risk register",
      "Controls matrix",
      "Audit path",
      "Pilot CTA",
    ],
    outcomes: [
      "A consistent workbench language",
      "Reusable product-page patterns",
      "A safer public showcase foundation",
    ],
    boundary:
      "The live workbench uses synthetic sample data only and does not include raw private demos.",
  },
  {
    slug: "diana-moonshot-brand-experience",
    title: "Diana Moonshot / Brand Experience",
    eyebrow: "Brand system",
    href: "/labs/diana-moonshot",
    statusLabel: "Test-mode narrative",
    statusTone: "test",
    summary:
      "An executive brand experience proving Artemis can feel premium while staying grounded in implementation, project controls, and governance.",
    decision:
      "Can the brand carry executive confidence without distracting from the operating-system argument?",
    signals: [
      "Visual language",
      "Executive story",
      "Pilot CTA",
      "Boundary copy",
      "System diagrams",
      "Governance notes",
    ],
    outcomes: [
      "A sharper public-market presentation",
      "Reusable visual direction",
      "A clear boundary between ambition and current product scope",
    ],
    boundary:
      "This is a brand and experience layer, not a claim that robotics products exist today.",
  },
  {
    slug: "system-graphics-library",
    title: "System Graphics Library",
    eyebrow: "Visual proof",
    statusLabel: "Reference library",
    statusTone: "reference",
    summary:
      "A library pattern for diagrams that answer: decision, connected data, applied logic, human review, trusted output, and remaining limitation.",
    decision:
      "Can each diagram help an executive understand the system well enough to make a better decision?",
    signals: [
      "Decision improved",
      "Connected data",
      "Applied logic",
      "Human review",
      "Trusted output",
      "Remaining limitation",
    ],
    outcomes: [
      "Reusable system diagrams",
      "Less decorative visual work",
      "More credible implementation storytelling",
    ],
    boundary:
      "Graphics must explain system logic. Pure moodboard imagery remains reference only.",
  },
];

export const homepageProofSlugs = [
  "utility-intelligence-bridge",
  "forecast-exposure-control-center",
  "geodesic-intelligence-workbench",
  "artemis-workbench-shell",
];

export function getProofModule(slug: string) {
  return proofModules.find((module) => module.slug === slug);
}

export function getProofModules(slugs: string[]) {
  return slugs
    .map((slug) => getProofModule(slug))
    .filter((module): module is ProofModule => Boolean(module));
}
