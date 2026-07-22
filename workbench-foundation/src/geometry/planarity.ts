/**
 * ARTEMIS Workbench v6 — geometry/planarity
 * Best-fit-plane planarity audit using the smallest-eigenvalue eigenvector of
 * the vertex covariance matrix. Newell-plane deviation is retained for legacy
 * parity reporting.
 */

import { type Vec3, centroid, sub, dot, newellNormal } from "./polygon";

export interface PlanarityThresholds {
  exactEps: number;
  tolerance: number;
  threeDLimit: number;
}

export type PlanarityClass =
  | "exact-planar"
  | "projected-within-tolerance"
  | "projected-outside-tolerance"
  | "three-dimensional-fabrication-required";

export interface PlanarityMetric {
  bestFitNormal: Vec3;
  bestFitOriginOffset: number;
  maxAbsoluteDeviation: number;
  rmsDeviation: number;
  peakToPeakDeviation: number;
  newellPlaneMaxDeviation: number;
  classification: PlanarityClass;
  thresholds: PlanarityThresholds;
}

export function symmetricEigen3(mIn: readonly number[][]): { values: number[]; vectors: Vec3[] } {
  const a = mIn.map((row) => [...row]);
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 64; sweep++) {
    const off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off < 1e-30) break;
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]] as const) {
      if (Math.abs(a[p][q]) < 1e-32) continue;
      const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < 3; k++) {
        const akp = a[k][p], akq = a[k][q];
        a[k][p] = c * akp - s * akq;
        a[k][q] = s * akp + c * akq;
      }
      for (let k = 0; k < 3; k++) {
        const apk = a[p][k], aqk = a[q][k];
        a[p][k] = c * apk - s * aqk;
        a[q][k] = s * apk + c * aqk;
      }
      for (let k = 0; k < 3; k++) {
        const vkp = v[k][p], vkq = v[k][q];
        v[k][p] = c * vkp - s * vkq;
        v[k][q] = s * vkp + c * vkq;
      }
    }
  }
  const pairs = [0, 1, 2].map((i) => ({
    value: a[i][i],
    vector: [v[0][i], v[1][i], v[2][i]] as Vec3,
  })).sort((x, y) => x.value - y.value);
  return { values: pairs.map((p) => p.value), vectors: pairs.map((p) => p.vector) };
}

export function classify(maxDev: number, t: PlanarityThresholds): PlanarityClass {
  if (maxDev <= t.exactEps) return "exact-planar";
  if (maxDev <= t.tolerance) return "projected-within-tolerance";
  if (maxDev <= t.threeDLimit) return "projected-outside-tolerance";
  return "three-dimensional-fabrication-required";
}

export function planarityMetric(points: readonly Vec3[], thresholds: PlanarityThresholds): PlanarityMetric {
  if (points.length < 3) throw new RangeError("planarity needs >=3 points");
  const c = centroid(points);
  const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of points) {
    const d = sub(p, c);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) m[i][j] += d[i] * d[j];
  }
  const eig = symmetricEigen3(m);
  let n = eig.vectors[0];
  const nw = newellNormal(points);
  if (dot(n, nw) < 0) n = [-n[0], -n[1], -n[2]];

  const devs = points.map((p) => dot(sub(p, c), n));
  const maxDev = Math.max(...devs.map(Math.abs));
  const rms = Math.sqrt(devs.reduce((a, d) => a + d * d, 0) / devs.length);
  const p2p = Math.max(...devs) - Math.min(...devs);
  const nwDevs = points.map((p) => dot(sub(p, c), nw));
  const nwMax = Math.max(...nwDevs.map(Math.abs));

  return {
    bestFitNormal: n,
    bestFitOriginOffset: dot(n, c),
    maxAbsoluteDeviation: maxDev,
    rmsDeviation: rms,
    peakToPeakDeviation: p2p,
    newellPlaneMaxDeviation: nwMax,
    classification: classify(maxDev, thresholds),
    thresholds,
  };
}
