import { DEFAULT_GEOMETRY_TOLERANCE, nearlyEqual, type GeometryTolerance } from "./tolerance";
import { add, cross, dot, normalize, scale, subtract, type Vec3 } from "./vector3";

export interface Plane {
  readonly normal: Vec3;
  readonly constant: number;
}

export interface Ray {
  readonly origin: Vec3;
  readonly direction: Vec3;
}

export function planeFromPointNormal(point: Vec3, normal: Vec3): Plane {
  const unitNormal = normalize(normal);
  return Object.freeze({
    normal: unitNormal,
    constant: -dot(unitNormal, point),
  });
}

export function planeFromPoints(a: Vec3, b: Vec3, c: Vec3): Plane {
  const ab = subtract(b, a);
  const ac = subtract(c, a);
  return planeFromPointNormal(a, cross(ab, ac));
}

export function signedDistanceToPlane(plane: Plane, point: Vec3): number {
  return dot(plane.normal, point) + plane.constant;
}

export function projectPointToPlane(plane: Plane, point: Vec3): Vec3 {
  return subtract(point, scale(plane.normal, signedDistanceToPlane(plane, point)));
}

export function intersectRayPlane(
  ray: Ray,
  plane: Plane,
  tolerance: GeometryTolerance = DEFAULT_GEOMETRY_TOLERANCE,
): Vec3 | null {
  const direction = normalize(ray.direction);
  const denominator = dot(plane.normal, direction);
  if (nearlyEqual(denominator, 0, tolerance)) return null;

  const t = -(dot(plane.normal, ray.origin) + plane.constant) / denominator;
  if (t < 0 && !nearlyEqual(t, 0, tolerance)) return null;
  return add(ray.origin, scale(direction, Math.max(0, t)));
}
