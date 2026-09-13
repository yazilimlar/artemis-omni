export type EvidenceAuthority = 'OBSERVED' | 'REPORTED' | 'INFERRED' | 'ESTIMATED';

export type LedgerCategory = 'observation' | 'plan' | 'inference' | 'action';

export interface LedgerEntry<T = unknown> {
  id: string;
  category: LedgerCategory;
  authority: EvidenceAuthority;
  payload: T;
  source: string;
  confidence: number;
  recordedAtSec: number;
}

export interface TimelineImportedPayload {
  kind: 'stay' | 'transit';
  startsAt: number;
  endsAt: number;
  label?: string;
  lat?: number;
  lng?: number;
  mode?: 'WALK' | 'BIKE' | 'BUS' | 'RAIL' | 'DRIVE' | 'UNKNOWN';
  distanceMeters?: number;
}

export function makeTimelineInference(
  id: string,
  payload: TimelineImportedPayload,
  confidence: number,
  recordedAtSec: number,
): LedgerEntry<TimelineImportedPayload> {
  return {
    id,
    category: 'observation',
    authority: 'INFERRED',
    payload,
    source: 'timeline.import',
    confidence: Math.max(0, Math.min(1, confidence)),
    recordedAtSec,
  };
}

export function canPromoteInferenceToObserved(entry: LedgerEntry): false {
  void entry;
  return false;
}
