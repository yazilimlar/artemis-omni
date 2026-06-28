/**
 * Central Artemis positioning constants — single source of truth for naming,
 * the ARTEMIS acronym, and the approved "safe language" used across public copy.
 *
 * Positioning rules (see docs/BrandArchitecture.md, docs/ProductRoadmap.md):
 * - Artemis / Artemis Omni = umbrella brand.
 * - Artemis Construct / 5D Construction Intelligence = public beachhead.
 * - Artemis Flow = module-level only (not the parent company).
 *
 * NOTE: the ARTEMIS acronym below was explicitly approved for the public data model
 * on the feature/public-app-shell-experience-foundation branch. It reverses the earlier
 * caution in docs/brand/BrandAssetNotes.md (§4/§9) about the "Autonomous Robotics…"
 * framing — reconcile those notes before merge if the direction is confirmed.
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
  whatWeAre:
    "Artemis is an AI implementation and automation software company serving small and mid-sized companies and engineering / construction organizations.",
  beachhead: "Artemis Construct — 5D Construction Intelligence",
  beachheadOneLiner: "Connect the field to the forecast to the cash.",
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
