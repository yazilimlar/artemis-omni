/**
 * ARTEMIS Workbench v6 — core/quantize
 * Tolerance-aware quantization used by fabrication-identity signatures and
 * fingerprint inputs. Values are quantized to INTEGER quanta (round(v/tol)),
 * never re-multiplied back to floats, so signature serialization is exact.
 *
 * A change of declared tolerance therefore changes every downstream signature
 * and fingerprint, as required by the traceability policy.
 */

export interface SignatureTolerances {
  /** Length quantum in the working length unit (e.g. 0.1 cm or 1 mm). */
  lengthTol: number;
  /** Angle quantum in degrees (e.g. 0.1). */
  angleTol: number;
}

export function assertTolerance(name: string, value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number, got ${value}`);
  }
}

/** Quantize a scalar to an integer number of quanta. Deterministic, symmetric. */
export function quantizeToInt(value: number, tolerance: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`cannot quantize non-finite value ${value}`);
  }
  assertTolerance("tolerance", tolerance);
  const q = value / tolerance;
  return Math.sign(q) * Math.round(Math.abs(q));
}

export function quantizeArray(values: readonly number[], tolerance: number): number[] {
  return values.map((v) => quantizeToInt(v, tolerance));
}
