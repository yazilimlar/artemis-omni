import { quantizeToInt, type SignatureTolerances } from "../core/quantize";

export type MirrorPolicy = "merge" | "separate";

export interface PanelSignatureInput {
  edgeLengths: readonly number[];
  interiorAnglesDeg: readonly number[];
  bevelAnglesDeg?: readonly number[];
  connectorCodes?: readonly string[];
  planarityDeviation?: number;
}

export interface PanelSignatureOptions {
  mirrorPolicy: MirrorPolicy;
  tolerances: SignatureTolerances & { planarityTol?: number };
}

type Step = readonly [number, number, number, string];

function compareStep(a: Step, b: Step): number {
  for (let i = 0; i < 3; i++) {
    const delta = a[i] - b[i];
    if (delta !== 0) return delta;
  }
  return a[3].localeCompare(b[3]);
}

function compareSequence(a: readonly Step[], b: readonly Step[]): number {
  for (let i = 0; i < a.length; i++) {
    const delta = compareStep(a[i], b[i]);
    if (delta !== 0) return delta;
  }
  return 0;
}

function rotate<T>(items: readonly T[], start: number): T[] {
  return [...items.slice(start), ...items.slice(0, start)];
}

function minimumRotation(items: readonly Step[]): Step[] {
  if (items.length === 0) return [];
  let best = rotate(items, 0);
  for (let i = 1; i < items.length; i++) {
    const candidate = rotate(items, i);
    if (compareSequence(candidate, best) < 0) best = candidate;
  }
  return best;
}

function reflectedSteps(
  lengths: readonly number[],
  angles: readonly number[],
  bevels: readonly number[],
  connectors: readonly string[],
): Step[] {
  const n = lengths.length;
  const out: Step[] = [];
  for (let i = 0; i < n; i++) {
    const edgeIndex = (n - 1 - i + n) % n;
    const startVertexIndex = (n - i) % n;
    out.push([
      lengths[edgeIndex],
      angles[startVertexIndex],
      bevels[edgeIndex],
      connectors[edgeIndex],
    ]);
  }
  return out;
}

function serialize(steps: readonly Step[], planarityQuantum: number): string {
  return `${steps.length}|${steps.map((s) => `${s[0]},${s[1]},${s[2]},${s[3]}`).join("|")}|p:${planarityQuantum}`;
}

export function canonicalPanelSignature(
  input: PanelSignatureInput,
  options: PanelSignatureOptions,
): { signature: string; orientation: "forward" | "reflected" } {
  const n = input.edgeLengths.length;
  if (n < 3 || input.interiorAnglesDeg.length !== n) {
    throw new RangeError("edge and interior-angle sequences must have the same length >= 3");
  }
  const bevelsRaw = input.bevelAnglesDeg ?? new Array<number>(n).fill(0);
  const connectors = input.connectorCodes ?? new Array<string>(n).fill("");
  if (bevelsRaw.length !== n || connectors.length !== n) {
    throw new RangeError("bevel and connector sequences must match the edge count");
  }

  const lengths = input.edgeLengths.map((v) => quantizeToInt(v, options.tolerances.lengthTol));
  const angles = input.interiorAnglesDeg.map((v) => quantizeToInt(v, options.tolerances.angleTol));
  const bevels = bevelsRaw.map((v) => quantizeToInt(v, options.tolerances.angleTol));
  const forwardSteps: Step[] = lengths.map((length, i) => [length, angles[i], bevels[i], connectors[i]]);
  const forward = minimumRotation(forwardSteps);
  const planarityQuantum = quantizeToInt(
    input.planarityDeviation ?? 0,
    options.tolerances.planarityTol ?? options.tolerances.lengthTol,
  );

  if (options.mirrorPolicy === "separate") {
    return { signature: serialize(forward, planarityQuantum), orientation: "forward" };
  }

  const reflected = minimumRotation(reflectedSteps(lengths, angles, bevels, connectors));
  return compareSequence(reflected, forward) < 0
    ? { signature: serialize(reflected, planarityQuantum), orientation: "reflected" }
    : { signature: serialize(forward, planarityQuantum), orientation: "forward" };
}

/** Legacy parity helper only. Never use for fabrication grouping. */
export function legacySortedMultisetKey(
  sides: number,
  edgeLengths: readonly number[],
  secondaryValues: readonly number[],
): string {
  return [
    sides,
    ...edgeLengths.map((v) => v.toFixed(1)).sort(),
    ...secondaryValues.map((v) => v.toFixed(1)).sort(),
  ].join("|");
}
