export type DayOSEpistemic = 'OBSERVED' | 'REPORTED' | 'INFERRED';
export type DayOSTemporalRole = 'ACTUAL' | 'FORECAST' | 'SCHEDULED' | 'DERIVED';
export type AnchorClass = 'HARD' | 'PROTECTED' | 'ELASTIC' | 'OPTIONAL';

export type EvidenceKind =
  | 'CALENDAR'
  | 'LOCATION'
  | 'TIMELINE'
  | 'PHOTO'
  | 'VOICE'
  | 'TEXT'
  | 'TRANSACTION'
  | 'USER_CONFIRMATION';

export interface EvidenceRef {
  id: string;
  kind: EvidenceKind;
  source: string;
  epistemic: DayOSEpistemic;
  observedAtUtc?: string;
  contentTimeUtc?: string;
  confidence: number;
  label?: string;
}

export interface OperatingEvent {
  id: string;
  title: string;
  startUtc: string | null;
  endUtc: string | null;
  isAllDay: boolean;
  locationLabel?: string | null;
  lat?: number;
  lng?: number;
  source: string;
  epistemic: DayOSEpistemic;
  temporalRole: DayOSTemporalRole;
  anchorClass: AnchorClass;
  confidence: number;
  evidenceRefs: EvidenceRef[];
  externalUrl?: string | null;
}

export interface DayNarrativeSegment {
  id: string;
  startUtc?: string;
  endUtc?: string;
  title: string;
  summary: string;
  status: 'DRAFT' | 'PROPOSED' | 'VERIFIED';
  confidence: number;
  evidenceRefs: string[];
}

export function classifyCalendarAnchor(input: {
  isAllDay: boolean;
  transparency?: string | null;
  attendance?: string | null;
}): AnchorClass {
  if (input.transparency === 'transparent') return 'OPTIONAL';
  if (input.attendance === 'declined') return 'OPTIONAL';
  if (input.isAllDay) return 'PROTECTED';
  return 'HARD';
}
