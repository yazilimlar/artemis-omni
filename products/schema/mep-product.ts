/**
 * Cross-discipline MEP product schema (Phase 1).
 *
 * HVAC is fully specified. PLUMBING and FIRE_SUPPRESSION are STUBS: their category / pipe
 * vocabularies and driver registries are placeholders so the shape is fixed now; no sample
 * rows exist for them. Types only - nothing here executes.
 *
 * Quantity rule: a product row never carries a quantity. Quantities come from the lab
 * pipeline (qtyFor()/estimate()) via `qtyDriver`; see products/SCHEMA.md.
 */

export type MepDiscipline = "HVAC" | "PLUMBING" | "FIRE_SUPPRESSION";

/** registered = exists in the lab's qtyFor(); proposed = needs a qtyFor()/estimate() change (not made here). */
export type DriverStatus = "registered" | "proposed";

export type SpecConfidence = "manufacturer" | "secondary" | "unverified";

/** Shared across disciplines so clash detection can reason about mixed MEP models. */
export type ClashClass =
  | "DUCT_RIGID"
  | "DUCT_FLEX"
  | "PIPE_PRESSURE"
  | "PIPE_GRAVITY" // plumbing sanitary/storm: slope-sensitive (stub)
  | "EQUIPMENT_MAJOR"
  | "TERMINAL_DEVICE"
  | "RATED_PENETRATION" // fire/smoke dampers, firestop-bound items
  | "CONTROL_DEVICE"
  | "SPRINKLER_HEAD"; // fire suppression (stub)

export interface ProductSpec {
  /** Row-level summary. 'unverified' if ANY key field below is unverified. */
  confidence: SpecConfidence;
  /** Per-field confidence; keys are spec field names. */
  fieldConfidence: Record<string, SpecConfidence>;
  /** Source URLs consulted (secondary/manufacturer), or [] when nothing was verifiable. */
  sources: string[];
  [field: string]: unknown;
}

export const REPRESENTATIVE_LABEL =
  "representative — verify against submittals, not sealed design" as const;

export interface MepProductBase<D extends MepDiscipline, C extends string> {
  id: string;
  discipline: D;
  category: C;
  manufacturer: string;
  model: string;
  spec: ProductSpec;
  unit: string;
  /** Driver id as used by qtyFor(). */
  qtyDriver: string;
  driverStatus: DriverStatus;
  /** `${ACTS[activityId].code}-M` in the lab's costCode() convention. */
  costCode: string;
  /** Lab activity id (A01..A15). Chain membership is DERIVED from ACTS, never stored here. */
  activityId: string;
  spoolable: boolean;
  clashClass: ClashClass;
  /** Mandatory on every row. */
  label: typeof REPRESENTATIVE_LABEL;
}

export type HvacCategory =
  | "duct"
  | "fitting_damper"
  | "terminal_unit"
  | "air_distribution"
  | "equipment"
  | "exhaust_fan"
  | "piping"
  | "controls";

export type HvacDuctType = "rectangular_galvanized" | "spiral_round" | "flexible";
export type HvacPipeType = "hydronic" | "refrigerant";

/** Exactly one of ductType | pipeType is set where applicable; neither for devices/equipment. */
export interface HvacProduct extends MepProductBase<"HVAC", HvacCategory> {
  ductType?: HvacDuctType;
  pipeType?: HvacPipeType;
}

// ---- STUBS (no rows, no driver registry yet) ----------------------------------------------

export type PlumbingCategory = "pipe" | "fixture" | "equipment" | "valve_fitting";
export type PlumbingPipeType = "domestic_water" | "sanitary" | "storm" | "gas";
/** STUB. Gravity systems will need slope metadata in spec. */
export interface PlumbingProduct extends MepProductBase<"PLUMBING", PlumbingCategory> {
  pipeType?: PlumbingPipeType;
}

export type FireSuppressionCategory = "pipe" | "sprinkler_head" | "valve_riser" | "pump";
export type FireSuppressionSystemType = "wet" | "dry" | "preaction" | "standpipe";
/** STUB. Expected spec keys: nfpa13HazardClass, kFactor, listing (UL/FM). */
export interface FireSuppressionProduct
  extends MepProductBase<"FIRE_SUPPRESSION", FireSuppressionCategory> {
  systemType?: FireSuppressionSystemType;
}

export type MepProduct = HvacProduct | PlumbingProduct | FireSuppressionProduct;
