import type { ProofItem } from "@/components/showcase/ProofCard";

/**
 * Labs proof library — executive-facing catalogue of Artemis showcases.
 * Public names use generic descriptors; real client/agency/project identifiers
 * are never surfaced here (they live only in internal strategy docs). The live
 * public showcase uses synthetic data.
 */
export const proofLibrary: ProofItem[] = [
  {
    slug: "construction-intelligence-workbench",
    title: "Construction Intelligence Workbench",
    status: "Public-safe",
    executiveValue:
      "A live, synthetic 5D workbench: KPIs, a four-way forecast, risk, exposure, and an audit-aware data path in one executive surface.",
    technicalProof: "Data-driven React + inline SVG forecast; synthetic Project Alpha dataset.",
    dataConnected: "Bid, actuals, schedule, production, billing (synthetic).",
    decisionImproved: "Where is cost/cash exposure, and how confident are we?",
    cta: { label: "View showcase", href: "/labs/construction-intelligence-workbench" },
  },
  {
    slug: "forecast-exposure-control-center",
    title: "Forecast Exposure Control Center",
    status: "Prototype",
    executiveValue:
      "Range-and-confidence view of cost exposure — how bad it could get, and how sure we are.",
    technicalProof: "Exposure matrix with confidence bands over a forecast horizon.",
    dataConnected: "Bid Estimate vs Actuals vs PM Forecast vs system projection.",
    decisionImproved: "How much contingency to hold, and when to act.",
    cta: { label: "Request walkthrough", href: "/contact" },
  },
  {
    slug: "model-to-money-inspector",
    title: "Model-to-Money Inspector",
    status: "Private Demo",
    executiveValue:
      "Trace a dollar from model geometry and quantities through schedule to cost and cash.",
    technicalProof: "Model elements linked to cost codes with source-labeled logic.",
    dataConnected: "Geometry, quantities, schedule, cost (private source).",
    decisionImproved: "Is the forecast grounded in the model, or in opinion?",
    cta: { label: "Request walkthrough", href: "/contact" },
  },
  {
    slug: "geometry-qa-plan-editing-sandbox",
    title: "Geometry QA + Plan Editing Sandbox",
    status: "Private Demo",
    executiveValue:
      "Interactive geometry quality assurance with human-reviewed plan edits.",
    technicalProof: "Constraint checks with defined review gates on every edit.",
    dataConnected: "Plan geometry and engineering constraints (private source).",
    decisionImproved: "Are the quantities and constructability defensible?",
    cta: { label: "Request walkthrough", href: "/contact" },
  },
  {
    slug: "sewer-3d-4d-5d-workbench",
    title: "3D / 4D / 5D Utility Workbench",
    status: "Private Demo",
    executiveValue:
      "A heavy-civil workbench tying model, sequence, and cost on a real program (private).",
    technicalProof: "3D/4D/5D linkage with schedule sequencing and cost rollup.",
    dataConnected: "Model, schedule, cost (private, agency-specific).",
    decisionImproved: "How does sequence change cost and cash over time?",
    cta: { label: "Request walkthrough", href: "/contact" },
  },
  {
    slug: "modular-workbench-shell",
    title: "Artemis Modular Workbench Shell",
    status: "Production Candidate",
    executiveValue:
      "The reusable app shell every Artemis workbench inherits — consistent, governable.",
    technicalProof: "Composable React shell: nav, panels, modes, theming.",
    dataConnected: "Framework layer (no project data).",
    decisionImproved: "How fast can a new module reach a trustworthy state?",
    cta: { label: "Coming soon", href: null },
  },
  {
    slug: "system-graphics-library",
    title: "System Graphics Library",
    status: "Prototype",
    executiveValue:
      "A reusable visual language for architecture, value-chain, and decision graphics.",
    technicalProof: "SVG/CSS figures; each answers the six-question rule.",
    dataConnected: "Illustrative (no project data).",
    decisionImproved: "Can a stakeholder trust what a diagram claims?",
    cta: { label: "Coming soon", href: null },
  },
  {
    slug: "executive-implementation-doctrine",
    title: "Executive Implementation Doctrine",
    status: "Public-safe",
    executiveValue:
      "The method behind the tools: AI amplifies disciplined fundamentals, with human review and audit-grade logic.",
    technicalProof: "Phase 0–6 transition method; what-it-is / what-it-is-not framing.",
    dataConnected: "Operating method (no project data).",
    decisionImproved: "How does a company actually operationalize AI?",
    cta: { label: "Request walkthrough", href: "/contact" },
  },
];
