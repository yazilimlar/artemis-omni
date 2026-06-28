/**
 * Central Artemis positioning constants — single source of truth for naming,
 * the ARTEMIS acronym, and the approved "safe language" used across public copy.
 *
 * Positioning rules (see docs/BrandArchitecture.md, docs/ProductRoadmap.md):
 * - Artemis / Artemis Omni = umbrella brand.
 * - Artemis Construct / 5D Construction Intelligence = public beachhead.
 * - Artemis Flow = module-level only (not the parent company).
 *
 * ACRONYM POLICY (reconciled): the ARTEMIS acronym is retained as the *formal brand
 * expansion / origin* only. Public copy must NOT imply Artemis is primarily a robotics
 * company unless/until robotics products actually exist. Lead with the company definition
 * (AI implementation & automation) and the Construction Intelligence beachhead; present
 * the acronym as origin/long-term ambition. See docs/brand/BrandAssetNotes.md (§4/§9).
 */

export const ARTEMIS_ACRONYM =
  "Autonomous Robotics Technology for Engineering, Modeling & Intelligent Systems";

/** Expanded acronym, letter-mapped, for display treatments. */
export const ARTEMIS_ACRONYM_PARTS: { letter: string; word: string }[] = [
  { letter: "A", word: "Autonomous" },
  { letter: "R", word: "Robotics" },
  { letter: "T", word: "Technology" },
  { letter: "E", word: "Engineering" },
  { letter: "M", word: "Modeling" },
  { letter: "I", word: "Intelligent" },
  { letter: "S", word: "Systems" },
];

export const companyPositioning = {
  umbrella: "Artemis",
  umbrellaAlt: "Artemis Omni",
  acronym: ARTEMIS_ACRONYM,
  /** Primary public positioning — lead with this, not the acronym. */
  whatWeAre:
    "Artemis is an AI implementation and automation software company serving small and mid-sized companies and engineering / construction organizations.",
  beachhead: "Artemis Construct — 5D Construction Intelligence",
  beachheadOneLiner: "Connect the field to the forecast to the cash.",
  beachheadLabel: "Public beachhead: Construction Intelligence",
  beachheadProof:
    "Cost controls, CMiC workflows, 5D forecasting, digital twins, and executive project dashboards for large construction and infrastructure programs.",
  /**
   * Careful framing for the formal acronym — used so robotics never reads as the
   * current primary product category.
   */
  acronymFraming: {
    intro: "The formal ARTEMIS expansion is",
    ambition:
      "The name reflects the long-term ambition; robotics products do not exist yet.",
    today:
      "Today, the public beachhead is Construction Intelligence and practical AI implementation.",
  },
} as const;

/**
 * Approved "safe language" vocabulary. Prefer these terms in public copy.
 */
export const SAFE_LANGUAGE = [
  "pilot-ready",
  "implementation framework",
  "demo",
  "prototype",
  "custom deployment",
  "human-reviewed",
  "audit-aware",
  "source-labeled assumptions",
  "controlled integrations",
] as const;

/**
 * Disallowed claims/terms — must never appear in public copy.
 * (Banned positioning terms + over-promises.)
 */
export const DISALLOWED_LANGUAGE = [
  "atelier",
  "AI Decision Mesh",
  "ancient intelligence, modern automation",
  "fully autonomous",
  "100% accurate",
  "revolutionary",
  "AI magic",
] as const;
