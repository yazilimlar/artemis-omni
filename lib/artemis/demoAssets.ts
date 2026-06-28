/**
 * Executive demo library — data for /demo. Mirrors the triage in
 * docs/showcases/ExecutiveDemoLibrary.md. NOTHING here is embedded or migrated;
 * these are catalogued candidates requiring sanitization, review, and migration
 * before any public release.
 *
 * NOTE: this data model is rendered on PUBLIC routes (/demo, /portfolio, home), so
 * asset names/notes here use generic descriptors only — real client/agency/project
 * identifiers (e.g. ESCR, DEP, "Reach K") are kept out of public copy and live only
 * in the internal strategy doc docs/showcases/ExecutiveDemoLibrary.md.
 */
export type DemoClassification =
  | "Public-safe"
  | "Private demo"
  | "Private reference"
  | "Sanitize required"
  | "Needs sanitization"
  | "Reference only"
  | "Production candidate";

export type DemoPriority = "P1" | "P2" | "P3" | "P4";

/** Governance policy tokens for assets that must not go public as-is. */
export type DemoPolicy = "PRIVATE_REFERENCE" | "SANITIZE_REQUIRED";

export type DemoAsset = {
  name: string;
  demonstrates: string;
  classification: DemoClassification;
  priority: DemoPriority;
  note: string;
  policy?: DemoPolicy;
};

export const demoCaveat =
  "Some demos are catalogued as future integration candidates and require sanitation, review, and migration before public release.";

export const demoAssets: DemoAsset[] = [
  {
    name: "Synthetic Construction Intelligence Workbench",
    demonstrates: "Public, synthetic-data showcase of Artemis construction-intelligence patterns.",
    classification: "Public-safe",
    priority: "P1",
    note: "Live public showcase at /labs/construction-intelligence-workbench — synthetic data only.",
  },
  {
    name: "Artemis App Shell Template v0.3",
    demonstrates: "Reusable Artemis app chrome (nav, panels, theming).",
    classification: "Production candidate",
    priority: "P1",
    note: "First React migration candidate — extract into reusable components.",
  },
  {
    name: "Forecast Exposure & Range Dashboard",
    demonstrates: "Forecast exposure control with confidence/range on cost exposure.",
    classification: "Needs sanitization",
    priority: "P2",
    note: "Client-specific source. Sanitize into a public-safe Forecast Exposure Control Center.",
  },
  {
    name: "Utility Construction Intelligence Workbench",
    demonstrates: "3D/4D/5D heavy-civil utility workbench on a real program.",
    classification: "Private demo",
    priority: "P2",
    note: "Agency/program specifics + 3D/maps. Private demo; sanitize and rebuild before public.",
  },
  {
    name: "Construction Intelligence Workbench (LinkedIn RC2)",
    demonstrates: "Geometry-driven 5D project-controls workbench (real-project reference).",
    classification: "Private reference",
    priority: "P3",
    policy: "PRIVATE_REFERENCE",
    note:
      "The LinkedIn RC2 Construction Intelligence Workbench is not public-migration-ready in its current form. It is deeply entangled with real project data, CMiC-style structures, map/3D logic, and WebGL dependencies. It must be treated as a private reference only. Public demos must use synthetic data and rebuilt UI patterns.",
  },
  {
    name: "5D Master Model / Geotechnical Column Inspector",
    demonstrates: "5D model + geotechnical column QA.",
    classification: "Private demo",
    priority: "P3",
    note: "Project-specific. Candidate for a Model-to-Money Inspector once sanitized.",
  },
  {
    name: "Geotechnical QA Interactive Plan Editor",
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
  { id: "P3", title: "P3 — Internal / reference assets", blurb: "Useful building blocks and private references." },
  { id: "P4", title: "P4 — Archive / research assets", blurb: "Lineage, moodboard, and research references." },
];
