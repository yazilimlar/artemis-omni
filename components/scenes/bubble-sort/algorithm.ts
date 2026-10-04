/**
 * Pure bubble sort for the bubble-sort scene (ADR-020 Tier 2). The full step sequence is
 * generated up front, so a renderer is a pure function of the step index. No randomness
 * except a seeded generator, so every run is reproducible.
 */

/** One comparison. `array` is the state after it (so after a swap, the swapped order). */
export type Step = {
  comparing: [number, number];
  swapped: boolean;
  array: number[];
  /** Index from which the suffix is final: n before any pass, 0 on the last step. */
  sortedFrom: number;
};

export const BAR_COUNT = 20;
export const BASE_SEED = 20261004;

/** mulberry32: a small seeded PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The values 1..n in a seeded Fisher-Yates order. Same seed, same order. */
export function shuffled(n: number, seed: number): number[] {
  const values = Array.from({ length: n }, (_, i) => i + 1);
  const random = mulberry32(seed);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

/** Every comparison of a bubble sort (with early exit when a pass makes no swap). */
export function generateBubbleSortSteps(values: readonly number[]): Step[] {
  const a = [...values];
  const n = a.length;
  const steps: Step[] = [];
  for (let pass = 0; pass < n - 1; pass++) {
    const end = n - 1 - pass; // positions above `end` are already final
    let swappedAny = false;
    for (let j = 0; j < end; j++) {
      const swapped = a[j] > a[j + 1];
      if (swapped) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swappedAny = true;
      }
      steps.push({ comparing: [j, j + 1], swapped, array: [...a], sortedFrom: end + 1 });
    }
    if (!swappedAny) break;
  }
  if (steps.length > 0) steps[steps.length - 1].sortedFrom = 0; // the sort is complete
  return steps;
}

/** Number of swaps performed up to and including step `index`. */
export function swapsThrough(steps: readonly Step[], index: number): number {
  let count = 0;
  for (let i = 0; i <= index && i < steps.length; i++) if (steps[i].swapped) count++;
  return count;
}
