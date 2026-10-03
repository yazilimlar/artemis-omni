export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export function vec3(x: number, y: number, z: number): Vec3 {
  if (![x, y, z].every(Number.isFinite)) {
    throw new RangeError("Vec3 components must be finite numbers");
  }
  return Object.freeze({ x, y, z });
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return vec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function subtract(a: Vec3, b: Vec3): Vec3 {
  return vec3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function scale(v: Vec3, factor: number): Vec3 {
  if (!Number.isFinite(factor)) throw new RangeError("Scale factor must be finite");
  return vec3(v.x * factor, v.y * factor, v.z * factor);
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}

export function magnitudeSquared(v: Vec3): number {
  return dot(v, v);
}

export function magnitude(v: Vec3): number {
  return Math.sqrt(magnitudeSquared(v));
}

export function normalize(v: Vec3): Vec3 {
  const length = magnitude(v);
  if (length === 0) throw new RangeError("Cannot normalize the zero vector");
  return scale(v, 1 / length);
}

export function distance(a: Vec3, b: Vec3): number {
  return magnitude(subtract(a, b));
}

export function projectToSphere(v: Vec3, radius: number): Vec3 {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError("Sphere radius must be a finite positive number");
  }
  return scale(normalize(v), radius);
}
