import type { ScenarioEvaluationInput, ScenarioOverlay, ScenarioResult } from '../core/scenario';
import { evaluateScenario } from '../engines/scenarioOverlay';

export interface ScenarioViewModel {
  baseline: ScenarioResult;
  candidate: ScenarioResult;
  delta: {
    leaveBySec: number | null;
    slackSec: number | null;
    batteryEndPct: number | null;
  };
  changed: boolean;
}

const baselineOverlay: ScenarioOverlay = { id: 'baseline' };

export function projectScenario(input: ScenarioEvaluationInput, overlay: ScenarioOverlay): ScenarioViewModel {
  const baseline = evaluateScenario(input, baselineOverlay);
  const candidate = evaluateScenario(input, overlay);
  const delta = {
    leaveBySec: baseline.leaveBySec == null || candidate.leaveBySec == null ? null : candidate.leaveBySec - baseline.leaveBySec,
    slackSec: baseline.slackSec == null || candidate.slackSec == null ? null : candidate.slackSec - baseline.slackSec,
    batteryEndPct: baseline.batteryEndPct == null || candidate.batteryEndPct == null ? null : candidate.batteryEndPct - baseline.batteryEndPct,
  };
  const changed = (overlay.prepDeltaMin || 0) !== 0 || (overlay.transitDeltaMin || 0) !== 0 ||
    (overlay.batteryStartDeltaPct || 0) !== 0 || (overlay.weatherRiskDelta || 0) !== 0 ||
    overlay.routeMode != null || overlay.walkToleranceMeters != null;
  return { baseline, candidate, delta, changed };
}
