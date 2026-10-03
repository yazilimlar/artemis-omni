export type TimeMode = 'LIVE' | 'SCRUB';
export type Rigidity = 'HARD' | 'FIRM' | 'SOFT';
export type Readiness = 'GO' | 'ADVISORY' | 'NO_GO';
export type TransportMode = 'drive' | 'transit' | 'bike' | 'walk';
export type Coord = [number, number];

export interface DayOSEntity {
  id: string;
  title: string;
  startsAt: number;
  endsAt: number;
  rigidity: Rigidity;
  readiness: Readiness;
  prepMinutes?: number;
  location?: Coord;
}

export interface RouteOption {
  id: string;
  mode: TransportMode;
  durationSec: number;
  distanceMeters: number;
  expectedArrivalSec: number;
  slackSec: number;
  coords: Coord[];
  viable: boolean;
  rejectionReason?: string;
}

export interface ExpectedLocationVector {
  currentCoord: Coord;
  targetId: string;
  targetCoord: Coord;
  targetTitle: string;
  targetStartsAt: number;
  leaveBySec: number;
  expectedArrivalSec: number;
  slackSec: number;
  activeRoute: RouteOption;
  alternatives: RouteOption[];
}

export interface OperationalContext {
  nowSec: number;
  timeMode: TimeMode;
  scrubAnchorSec: number | null;
  selectedTargetId: string;
  activeRouteMode: TransportMode;
  currentGps: Coord | null;
  entities: readonly DayOSEntity[];
}
