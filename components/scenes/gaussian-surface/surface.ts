/**
 * Pure maths for the Gaussian surface scene (ADR-020 Tier 1). No three.js import, so it can
 * be unit-tested and reused to generate the static fallback image.
 */

export const SIGMA = 1.0;
/** Plane edge length, in scene units; x and y both run over [-SIZE/2, SIZE/2]. */
export const SIZE = 4;
/** Grid cells per side. (SEGMENTS + 1)² = 4,225 vertices, under the 5,000 budget. */
export const SEGMENTS = 64;
/** Display-only vertical scale. The plotted value is the unscaled gaussian. */
export const HEIGHT_SCALE = 1.6;

/** z = exp(-(x² + y²) / (2σ²)). Peak 1 at the origin. */
export function gaussian(x: number, y: number, sigma = SIGMA): number {
  return Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
}

/** Vertices of a (segments x segments)-cell grid. */
export function vertexCount(segments = SEGMENTS): number {
  return (segments + 1) * (segments + 1);
}

export type Rgb = readonly [number, number, number];

/** Palette stops, 0..1 channels: signal blue, crescent cyan, gold (the site palette). */
const BLUE: Rgb = [0.0, 0.42, 0.84];
const CYAN: Rgb = [0.0, 0.85, 1.0];
const GOLD: Rgb = [0.84, 0.66, 0.31];

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Blue (z = 0) -> cyan (z = 0.5) -> gold (z = 1); t is clamped to [0, 1]. */
export function colorAt(t: number): Rgb {
  const z = Math.min(1, Math.max(0, t));
  return z < 0.5 ? mix(BLUE, CYAN, z / 0.5) : mix(CYAN, GOLD, (z - 0.5) / 0.5);
}

export const toHex = ([r, g, b]: Rgb): string =>
  "#" + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");

/** Radius at which the surface has height z (inverse of gaussian along an axis). */
export function contourRadius(z: number, sigma = SIGMA): number {
  return sigma * Math.sqrt(-2 * Math.log(z));
}
