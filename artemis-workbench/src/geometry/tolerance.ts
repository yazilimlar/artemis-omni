export interface GeometryTolerance {
  readonly absolute: number;
  readonly relative: number;
}

export const DEFAULT_GEOMETRY_TOLERANCE: GeometryTolerance = Object.freeze({
  absolute: 1e-9,
  relative: 1e-12,
});

export function nearlyEqual(
  a: number,
  b: number,
  tolerance: GeometryTolerance = DEFAULT_GEOMETRY_TOLERANCE,
): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const delta = Math.abs(a - b);
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return delta <= Math.max(tolerance.absolute, tolerance.relative * scale);
}

export function assertTolerance(tolerance: GeometryTolerance): GeometryTolerance {
  if (
    !Number.isFinite(tolerance.absolute) ||
    !Number.isFinite(tolerance.relative) ||
    tolerance.absolute < 0 ||
    tolerance.relative < 0
  ) {
    throw new RangeError("Geometry tolerances must be finite non-negative numbers");
  }
  return Object.freeze({ ...tolerance });
}
