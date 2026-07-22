/**
 * ARTEMIS Workbench v6 — geometry/polygon
 * Pure attribute extraction from an ordered 3D vertex loop.
 * Convention: vertex v_i; directed edge e_i = v_i -> v_{i+1}; interior angle
 * alpha_i belongs to the START vertex of edge e_i.
 */

export type Vec3 = readonly [number, number, number];

export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export function normalize(a: Vec3): Vec3 {
  const n = norm(a);
  if (n < 1e-30) throw new RangeError("cannot normalize zero-length vector");
  return [a[0] / n, a[1] / n, a[2] / n];
}

export function centroid(points: readonly Vec3[]): Vec3 {
  if (points.length === 0) throw new RangeError("centroid requires at least one point");
  let x = 0, y = 0, z = 0;
  for (const p of points) { x += p[0]; y += p[1]; z += p[2]; }
  return [x / points.length, y / points.length, z / points.length];
}

export function newellNormal(points: readonly Vec3[]): Vec3 {
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  const n = Math.hypot(nx, ny, nz);
  if (n < 1e-30) return [0, 1, 0];
  return [nx / n, ny / n, nz / n];
}

export function normalizeWinding(points: readonly Vec3[], outwardReference: Vec3): readonly Vec3[] {
  return dot(newellNormal(points), outwardReference) >= 0 ? points : [...points].reverse();
}

export function edgeLengths(points: readonly Vec3[]): number[] {
  const n = points.length;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = norm(sub(points[(i + 1) % n], points[i]));
  return out;
}

export function interiorAnglesDeg(points: readonly Vec3[]): number[] {
  const n = points.length;
  if (n < 3) throw new RangeError("polygon needs at least 3 vertices");
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n], cur = points[i], next = points[(i + 1) % n];
    const u = normalize(sub(prev, cur));
    const w = normalize(sub(next, cur));
    out[i] = (Math.acos(Math.min(1, Math.max(-1, dot(u, w)))) * 180) / Math.PI;
  }
  return out;
}

export function reflectLoop(points: readonly Vec3[], origin: Vec3, n: Vec3): Vec3[] {
  const unit = normalize(n);
  return points.map((p) => {
    const d = dot(sub(p, origin), unit);
    return sub(p, scale(unit, 2 * d));
  });
}
