/**
 * Published brand concept art + logo references (optimized into /public/brand/).
 * Raw originals are retained privately in docs/brand/reference/.
 *
 * Captions follow the approved positioning: Artemis / Artemis Omni umbrella,
 * 5D Construction Intelligence the public lead. The ARTEMIS acronym appears only as
 * a formal brand expansion ("Modeling", not "Mechanics"), never as a current product
 * category. These are identity studies / concept art, not the primary wordmark.
 */
export type BrandAsset = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  feature?: boolean;
};

export const brandAssets: BrandAsset[] = [
  {
    src: "/brand/artemis-archer-blue.jpg",
    alt: "Artemis archer identity study — luminous blue wireframe figure within a Greek-meander and constellation frame",
    title: "Artemis — Intelligent Systems",
    caption:
      "Identity study: the Artemis archer as precision and intent, framed by Greek-meander and blueprint motifs.",
    width: 977,
    height: 1500,
    feature: true,
  },
  {
    src: "/brand/artemis-archer-gold-platinum.jpg",
    alt: "Two-phase Artemis relief — conceptual wireframe beside a gold autonomous realization",
    title: "Concept → Realization",
    caption:
      "From conceptual architecture to realized system — the brand's engineering arc in platinum and gold.",
    width: 1500,
    height: 1005,
  },
  {
    src: "/brand/artemis-archer-bronze.jpg",
    alt: "Bronze wireframe Artemis archer relief — Phase I conceptual architecture",
    title: "Phase I — Conceptual Architecture",
    caption: "An engineering-relief study of the Artemis figure and mechanical compound bow.",
    width: 884,
    height: 1356,
  },
  {
    src: "/brand/artemis-brand-blueprint.jpg",
    alt: "Artemis brand and system blueprint sheet — logo specifications, palette, and dashboard mockup",
    title: "Brand & System Blueprint",
    caption:
      "Working reference: logo specifications, palette direction, and an executive-dashboard mockup. Concept sheet — not the final standard.",
    width: 1042,
    height: 1600,
  },
  {
    src: "/brand/artemis-cover-banner.jpg",
    alt: "Wide Artemis brand banner",
    title: "Brand Banner",
    caption: "Wide-format identity composition for social and cover use.",
    width: 1600,
    height: 400,
  },
];

export function getFeatureAsset(): BrandAsset {
  return brandAssets.find((a) => a.feature) ?? brandAssets[0];
}

/** Brand palette swatches (mirrors the design tokens). */
export const brandPalette: { name: string; hex: string; token: string }[] = [
  { name: "Deep Space Navy", hex: "#0A1326", token: "--navy-deep" },
  { name: "Artemis Navy", hex: "#13203B", token: "--navy" },
  { name: "Blueprint Cyan", hex: "#37B6D8", token: "--blueprint" },
  { name: "Platinum Silver", hex: "#C2CBD8", token: "--silver" },
  { name: "Delta Gold", hex: "#CDA24F", token: "--gold" },
  { name: "Parchment White", hex: "#F0E9DA", token: "--parchment" },
];
