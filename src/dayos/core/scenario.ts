import type { TransportMode } from './types';

export interface ScenarioOverlay {
  id: string;
  routeMode?: TransportMode;
  prepDeltaMin?: number;
  transitDeltaMin?: number;
  batteryStartDeltaPct?: number;
  weatherRiskDelta?: number;
  walkToleranceMeters?: number;
}

export interface ScenarioResult {
  overlay: ScenarioOverlay;
  leaveBySec: number | null;
  slackSec: number | null;
  batteryEndPct: number | null;
  feasible: boolean;
  reasons: string[];
}

export interface ScenarioEvaluationInput {
  nowSec: number;
  anchorStartsAtSec: number | null;
  basePrepMin: number;
  baseTransitSec: number;
  baseBatteryEndPct: number | null;
}
