export type UnifiedLens='overview'|'spatial'|'telemetry'|'scenario'|'evidence';
export type UnifiedHorizon='now'|'today'|'tomorrow'|'week'|'month';
export type UnifiedTimeMode='LIVE'|'SCRUB';
export type DayOSRuntimeState={activeLens:UnifiedLens;horizon:UnifiedHorizon;timeMode:UnifiedTimeMode;selectedTargetId:string|null};
export const DEFAULT_DAYOS_RUNTIME:DayOSRuntimeState={activeLens:'overview',horizon:'today',timeMode:'LIVE',selectedTargetId:'mission:fixture-1'};
export function serializeRuntime(s:DayOSRuntimeState){const p=new URLSearchParams();p.set('lens',s.activeLens);p.set('horizon',s.horizon);p.set('mode',s.timeMode);if(s.selectedTargetId)p.set('target',s.selectedTargetId);return p.toString()}
export function parseRuntime(search:string):DayOSRuntimeState{const p=new URLSearchParams(search);const lens=(p.get('lens')||'overview') as UnifiedLens;const horizon=(p.get('horizon')||'today') as UnifiedHorizon;const mode=(p.get('mode')||'LIVE') as UnifiedTimeMode;return{activeLens:['overview','spatial','telemetry','scenario','evidence'].includes(lens)?lens:'overview',horizon:['now','today','tomorrow','week','month'].includes(horizon)?horizon:'today',timeMode:mode==='SCRUB'?'SCRUB':'LIVE',selectedTargetId:p.get('target')||'mission:fixture-1'}}
