/** Spool engine output (Phase 2). Types only. Tag pattern: D-SPOOL-042 (duct), H-SPOOL-042 (hydronic). */
import type { ClashClass } from "../schema/mep-product";
import type { ClearanceClass, RouteFittingType, SegmentKind } from "../routing/route.schema";

export interface Spool {
  tag: string;
  runId: string;
  productId: string;
  ductType: string | null;
  pipeType: string | null;
  segmentId: string;
  segmentKind: SegmentKind;
  floor: number;
  zone: number;
  indexInSegment: number;
  ofSegment: number;
  lengthCu: number;
  lengthFt: number;
  weightLb: number;
  fittings: { id: string; type: RouteFittingType }[];
  hangers: number;
  braces: { transverse: number; longitudinal: number };
  clearanceClass: ClearanceClass;
  clashClass: ClashClass;
}

/** Fields with no qtyFor() key yet are display-only and must be shown with this status. */
export type DerivedStatus = "derived-not-in-estimate";

export interface SpoolRunSummary {
  runId: string;
  productId: string;
  activityId: string;
  driver: string;
  spoolCount: number;
  lengthFt: number;
  weightLb: number;
  hangers: number;
  braces: { transverse: number; longitudinal: number };
  fittings: Record<string, number>;
}

export interface SpoolResult {
  label: string;
  spools: Spool[];
  perRun: SpoolRunSummary[];
  exclusions: { productId: string; reason: string }[];
}
