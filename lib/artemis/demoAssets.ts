/**
 * Executive demo library — data for /demo. Mirrors the triage in
 * docs/showcases/ExecutiveDemoLibrary.md. NOTHING here is embedded or migrated;
 * these are catalogued candidates requiring sanitization, review, and migration
 * before any public release.
 */
export type DemoClassification =
  | "Public-safe"
  | "Private demo"
  | "Needs sanitization"
  | "Reference only"
  | "Production candidate";

export type DemoPriority = "P1" | "P2" | "P3" | "P4";

export type DemoAsset = {
  name: string;
  demonstrates: string;
  classification: DemoClassification;
  priority: DemoPriority;
  note: string;
};

export const demoCaveat =
  "Some demos are catalogued as future integration candidates and require sanitation, review, and migration before public release.";

export const demoAssets: DemoAsset[] = [
  {
    name: "Artemis Construction Intelligence Workbench (LinkedIn RC2)",
    demonstrates: "Flagship 5D construction-intelligence workbench: field → forecast → cash.",
    classification: "Production candidate",
    priority: "P1",
    note: "First public showcase candidate. Verify no confidential data before public use.",
  },
  {
    name: "Artemis App Shell Template v0.3",
    demonstrates: "Reusable Artemis app chrome (nav, panels, theming).",
    classification: "Production candidate",
    priority: "P1",
    note: "First React migration candidate — extract into reusable components.",
  },
  {
    name: "ESCR Forecast Matrix & Exposure Range Dashboard",
    demonstrates: "Forecast exposure control with confidence/range on cost exposure.",
    classification: "Needs sanitization",
    priority: "P2",
    note: "Client-specific (ESCR). Sanitize into a public-safe Forecast Exposure Control Center.",
  },
  {
    name: "DEP Sewer Construction Intelligence Workbench",
    demonstrates: "3D/4D/5D heavy-civil workbench on a real program.",
    classification: "Private demo",
    priority: "P2",
    note: "Agency/program specifics. Lead private demo; sanitize before public.",
  },
  {
    name: "Reach K 5D Master Model / Jet Grout Column Inspector",
    demonstrates: "5D model + geotechnical (jet grout) column QA.",
    classification: "Private demo",
    priority: "P3",
    note: "Project-specific. Candidate for a Model-to-Money Inspector once sanitized.",
  },
  {
    name: "Reach K Jet Grout QA — Interactive Plan Editor",
    demonstrates: "Interactive plan editing + geometry QA sandbox.",
    classification: "Private demo",
    priority: "P3",
    note: "Higher integration effort; define human-review gates for edits.",
  },
  {
    name: "System Graphics Exemplary (ZIP)",
    demonstrates: "Reusable system / architecture graphics.",
    classification: "Reference only",
    priority: "P3",
    note: "Curate into six-question-compliant figures for Academy / Labs.",
  },
  {
    name: "Artemis App Shell Template v0.2",
    demonstrates: "Prior app-shell iteration.",
    classification: "Reference only",
    priority: "P4",
    note: "Lineage reference for the v0.3 shell.",
  },
  {
    name: "Artemis App Shell Template v0.1",
    demonstrates: "Earliest app-shell iteration.",
    classification: "Reference only",
    priority: "P4",
    note: "Lineage reference for the v0.3 shell.",
  },
  {
    name: "Exemplary graphics / render (ZIPs)",
    demonstrates: "Cinematic render inspiration.",
    classification: "Reference only",
    priority: "P4",
    note: "Moodboard only; extract palette/motif cues.",
  },
  {
    name: "Artemis brand / media references",
    demonstrates: "Logo, palette, and motif direction.",
    classification: "Reference only",
    priority: "P4",
    note: "Stored privately in docs/brand/reference/ (intake complete).",
  },
];

/** Grouped by priority bucket for the /demo landing page. */
export const demoBuckets: { id: DemoPriority; title: string; blurb: string }[] = [
  { id: "P1", title: "P1 — Public showcase candidates", blurb: "Strongest assets; nearest to a public Labs showcase after review." },
  { id: "P2", title: "P2 — Private demo candidates", blurb: "High-value, but need sanitization before any public release." },
  { id: "P3", title: "P3 — Internal / reference assets", blurb: "Useful building blocks and private demos." },
  { id: "P4", title: "P4 — Archive / research assets", blurb: "Lineage, moodboard, and research references." },
];
