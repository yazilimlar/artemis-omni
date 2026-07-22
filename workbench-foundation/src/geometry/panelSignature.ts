/**
 * ARTEMIS Workbench v6 — geometry/panelSignature
 * Canonical cyclic panel-family signature. Replaces the legacy sorted-multiset
 * key, which destroyed cyclic adjacency and could merge geometrically
 * different fabrication parts.
 *
 * INDEXING CONVENTION (normative)
 *   For a loop wound CCW when viewed from outside the solid:
 *     vertex v_i; directed edge e_i = v_i -> v_{i+1};
 *     interior angle alpha_i belongs to vertex v_i (START vertex of e_i);
 *     bevel beta_i and connector code C_i belong to directed edge e_i.
 *
 * REFLECTION INDEX TRANSFORMS (normative — do NOT reverse zipped tuples)
 *   Edge attributes:    L'_i = L_{n-1-i};  B'_i = B_{n-1-i};  C'_i = C_{n-1-i}
 *   Vertex attributes:  A'_i = A_{(n-i) mod n}
 *
 * Deterministic: no floating-point values appear in the serialized signature.
 */

import { type SignatureTolerances, assertTolerance, quantizeArray } from "../core/quantize";

export type MirrorPolicy = "merge" | "separate";

export interface PanelAttributeCycles {
  edgeLengths: readonly number[];
  interiorAnglesDeg: readonly number[];
  bevelAnglesDeg?: readonly number[];
  connectorCodes?: readonly string[];
}

export interface SignatureOptions {
  mirrorPolicy: MirrorPolicy;
  tolerances: SignatureTolerances;
  globalCodes?: readonly string[];
}

export interface PanelSignatureResult {
  signature: string;
  chirality: "forward" | "mirrored" | "achiral";
  canonicalRotation: number;
  sideCount: number;
}

type Step = readonly (number | string)[];

function buildSteps(Lq: readonly number[], Aq: readonly number[], Bq: readonly number[], C: readonly string[]): Step[] {
  return Lq.map((_, i) => [Lq[i], Aq[i], Bq[i], C[i]] as const);
}

function compareSteps(a: Step, b: Step): number {
  for (let k = 0; k < a.length; k++) {
    const x = a[k], y = b[k];
    if (x === y) continue;
    if (typeof x === "number" && typeof y === "number") return x < y ? -1 : 1;
    return String(x) < String(y) ? -1 : 1;
  }
  return 0;
}

function compareSequences(a: readonly Step[], b: readonly Step[]): number {
  for (let i = 0; i < a.length; i++) {
    const c = compareSteps(a[i], b[i]);
    if (c !== 0) return c;
  }
  return 0;
}

function minimalRotation(steps: readonly Step[]): { rotation: number; seq: Step[] } {
  const n = steps.length;
  let best = 0;
  for (let r = 1; r < n; r++) {
    const rotated = (i: number) => steps[(i + r) % n];
    const bestSeq = (i: number) => steps[(i + best) % n];
    for (let i = 0; i < n; i++) {
      const c = compareSteps(rotated(i), bestSeq(i));
      if (c < 0) { best = r; break; }
      if (c > 0) break;
    }
  }
  return { rotation: best, seq: Array.from({ length: n }, (_, i) => steps[(i + best) % n]) };
}

export function reflectAttributeCycles(
  L: readonly number[],
  A: readonly number[],
  B: readonly number[],
  C: readonly string[],
): { L: number[]; A: number[]; B: number[]; C: string[] } {
  const n = L.length;
  const Lr = new Array<number>(n), Ar = new Array<number>(n), Br = new Array<number>(n);
  const Cr = new Array<string>(n);
  for (let i = 0; i < n; i++) {
    Lr[i] = L[n - 1 - i];
    Br[i] = B[n - 1 - i];
    Cr[i] = C[n - 1 - i];
    Ar[i] = A[(n - i) % n];
  }
  return { L: Lr, A: Ar, B: Br, C: Cr };
}

function serialize(seq: readonly Step[], globalCodes: readonly string[]): string {
  const body = seq.map((s) => s.join(",")).join(";");
  const globals = [...globalCodes].sort().join("|");
  return `n=${seq.length}#${body}#g=${globals}`;
}

export function canonicalPanelSignature(
  cycles: PanelAttributeCycles,
  options: SignatureOptions,
): PanelSignatureResult {
  const n = cycles.edgeLengths.length;
  if (n < 3) throw new RangeError(`panel needs >=3 sides, got ${n}`);
  const A = cycles.interiorAnglesDeg;
  const B = cycles.bevelAnglesDeg ?? new Array<number>(n).fill(0);
  const C = cycles.connectorCodes ?? new Array<string>(n).fill("");
  if (A.length !== n || B.length !== n || C.length !== n) {
    throw new RangeError("attribute cycles must all have identical length");
  }
  assertTolerance("lengthTol", options.tolerances.lengthTol);
  assertTolerance("angleTol", options.tolerances.angleTol);

  const Lq = quantizeArray(cycles.edgeLengths, options.tolerances.lengthTol);
  const Aq = quantizeArray(A, options.tolerances.angleTol);
  const Bq = quantizeArray(B, options.tolerances.angleTol);
  const globals = options.globalCodes ?? [];
  const forward = minimalRotation(buildSteps(Lq, Aq, Bq, C as string[]));

  if (options.mirrorPolicy === "separate") {
    return {
      signature: serialize(forward.seq, globals),
      chirality: "forward",
      canonicalRotation: forward.rotation,
      sideCount: n,
    };
  }

  const r = reflectAttributeCycles(Lq, Aq, Bq, C as string[]);
  const mirrored = minimalRotation(buildSteps(r.L, r.A, r.B, r.C));
  const cmp = compareSequences(forward.seq, mirrored.seq);
  const chosen = cmp <= 0 ? forward : mirrored;
  return {
    signature: serialize(chosen.seq, globals),
    chirality: cmp === 0 ? "achiral" : cmp < 0 ? "forward" : "mirrored",
    canonicalRotation: chosen.rotation,
    sideCount: n,
  };
}

export function legacySortedMultisetKey(
  sides: number,
  outerEdges: readonly number[],
  sawBevels: readonly number[],
): string {
  return [
    sides,
    ...outerEdges.map((x) => x.toFixed(1)).sort(),
    ...sawBevels.map((b) => b.toFixed(1)).sort(),
  ].join("|");
}
