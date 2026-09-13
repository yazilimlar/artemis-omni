import type { ScenarioEvaluationInput, ScenarioOverlay, ScenarioResult } from '../core/scenario';

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export function evaluateScenario(input:ScenarioEvaluationInput, overlay:ScenarioOverlay):ScenarioResult {
  const transitSec=Math.max(0,input.baseTransitSec+(overlay.transitDeltaMin||0)*60);
  const prepSec=Math.max(0,(input.basePrepMin+(overlay.prepDeltaMin||0))*60);
  const leaveBySec=input.anchorStartsAtSec==null?null:input.anchorStartsAtSec-prepSec-transitSec;
  const slackSec=leaveBySec==null?null:leaveBySec-input.nowSec;
  const batteryEndPct=input.baseBatteryEndPct==null?null:clamp(input.baseBatteryEndPct+(overlay.batteryStartDeltaPct||0),0,100);
  const reasons:string[]=[];
  if(slackSec!=null&&slackSec<0) reasons.push('Negative slack to protected anchor');
  if(batteryEndPct!=null&&batteryEndPct<20) reasons.push('Battery reserve below 20%');
  if((overlay.weatherRiskDelta||0)>=0.5) reasons.push('Weather-risk uplift exceeds threshold');
  return {overlay,leaveBySec,slackSec,batteryEndPct,feasible:reasons.length===0,reasons};
}

export function evaluateScenarioSet(input:ScenarioEvaluationInput, overlays:readonly ScenarioOverlay[]):ScenarioResult[] {
  return overlays.map(o=>evaluateScenario(input,o));
}
