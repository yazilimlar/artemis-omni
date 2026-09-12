export type Rigidity = 'HARD' | 'FIRM' | 'SOFT';

export interface EnrichedEntity {
  id: string;
  title: string;
  kind: 'mission' | 'appointment' | 'task' | 'transit' | 'anchor' | 'charge';
  startsAt: number;
  endsAt: number;
  leaveBySec?: number;
  prepMinutes?: number;
  debriefMinutes?: number;
  transitEstimateSec?: number;
  rigidity: Rigidity;
  priority?: number;
  dropped?: boolean;
  chargeRatePctPerHour?: number;
  deltaCostUsd?: number;
  location?: { lat: number; lng: number };
}

export interface OperationalLeg {
  id: string;
  startsAt: number;
  endsAt: number;
  screen: number;
  gps: boolean;
  sensor: boolean;
  signalStrength: number;
  chargeRatePctPerHour?: number;
}

export interface BatteryForecast {
  socStartPct: number;
  socEndPct: number;
  socAtArrivalPct: number;
  breakdown: {
    standbyPct: number;
    screenPct: number;
    gpsPct: number;
    sensorPct: number;
    chargePct: number;
  };
}
