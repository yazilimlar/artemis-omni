/**
 * Clash capability types (Phase 3). Types only. See products/clash/clash-engine.mjs.
 *
 * GEOMETRY RESOLUTION: L0 AABB broad-phase. EXACT_BOX overlap is verified for the supplied box
 * geometry only; CONSERVATIVE_AABB overlap is a POTENTIAL intersection and is never promoted.
 * Fixture results are SYNTHETIC engineering validation, not project findings. The engine never
 * mutates BOM, spool quantities, estimates, EVM or claims.
 */
export type RuleCategory = "geometric" | "maintenance" | "fabrication" | "code";
export type Resolution = "EXACT_BOX" | "CONSERVATIVE_AABB";
export type ClashType = "HARD_INTERSECTION" | "POTENTIAL_INTERSECTION" | "INSULATION_INTERFERENCE" | "CLEARANCE_VIOLATION";
export type ObservationType = "TOUCHING" | "NEAR_MISS";
export type Severity = "critical" | "major" | "minor" | "review" | "info";
export type Verification = "VERIFIED_BOX_GEOMETRY" | "UNVERIFIED_BROAD_PHASE";
export type Vec3 = [number, number, number];

export interface ClashObject {
  id: string;
  kind: "duct" | "pipe" | "fitting" | "beam" | "column" | "equipment";
  system?: string;
  floor: string | number;
  zone?: string;
  bbox: { min: Vec3; max: Vec3 };
  /** Must be declared; never assumed. true only for genuine axis-aligned boxes. */
  exactBox: boolean;
  insulationIn?: number;
  serviceFaces?: ("+x" | "-x" | "+y" | "-y" | "+z" | "-z")[];
  spansFloors?: boolean;
  transform?: { translate: Vec3; rotateZDeg?: number };
  /** Link back to P1/P2 routes and spools so a proposed resolution can name what it affects. */
  ref?: { runId?: string; segmentId?: string; spoolTags?: string[] };
}

export interface ClashConnection {
  a: string;
  b: string;
  type: "joint" | "penetration";
  exemptRules: string[];
  allowedOverlapFt: number;
  reason: string;
  basis?: string;
}

export interface ClashInput {
  dataMode: string;
  units: "ft" | "in" | "m" | "mm";
  coordinateSystem: { handedness: "right"; axes: { x: "east"; y: "north"; z: "up" }; datum: string };
  floors: Record<string, { zMin: number; zMax: number }>;
  tolerance: { overlapFt: number; touchFt: number; nearMissFt: number; minExtentFt: number };
  readiness: { clashReady: boolean; reason?: string };
  objects: ClashObject[];
  connections?: ClashConnection[];
}

export interface ClashRecord {
  id: string;
  type: ClashType;
  ruleId: string;
  ruleCategory: RuleCategory;
  severity: Severity;
  verification: Verification;
  objects: string[];
  floors: string[];
  zones: string[];
  evidence: Record<string, unknown>;
  proposedResolution: {
    action: string;
    affected: { objectIds: string[]; runIds: string[]; segmentIds: string[]; spoolTags: string[] };
    mutation: "NONE";
    executes: false;
    requiresRegeneration: true;
  };
  findingStatus: "SYNTHETIC_ENGINEERING_VALIDATION" | "UNVALIDATED_NOT_A_PROJECT_FINDING";
  complianceClaim: "NONE";
}

export interface ClashResult {
  status: "OK" | "REJECTED_INPUT" | "REFUSED_NOT_CLASH_READY";
  complianceClaim: "NONE";
  clashes: ClashRecord[];
  observations: { type: ObservationType; ruleId: string; objects: string[]; gapFt: number }[];
  exempted: { objects: string[]; ruleId: string; reason: string }[];
  rejectedObjects: { id: string | null; code: string; count: number }[];
}
