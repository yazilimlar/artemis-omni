import type { DayOSEntity } from '../core/types';

export type RiskState='NOMINAL'|'ADVISORY'|'CRITICAL'|'INFEASIBLE';
export interface CriticalTimingState{
  anchor:DayOSEntity|null;
  leaveBySec:number|null;
  slackSec:number|null;
  countdownSec:number|null;
  risk:RiskState;
}

export function computeCriticalTiming(args:{
  entities:readonly DayOSEntity[];
  nowSec:number;
  transitDurationSec:number;
}):CriticalTimingState{
  const {entities,nowSec,transitDurationSec}=args;
  const anchor=[...entities]
    .filter(e=>e.rigidity==='HARD'&&e.startsAt>=nowSec)
    .sort((a,b)=>a.startsAt-b.startsAt)[0]||null;
  if(!anchor) return {anchor:null,leaveBySec:null,slackSec:null,countdownSec:null,risk:'NOMINAL'};
  const prepSec=(anchor.prepMinutes||0)*60;
  const leaveBySec=anchor.startsAt-prepSec-transitDurationSec;
  const slackSec=leaveBySec-nowSec;
  const countdownSec=anchor.startsAt-nowSec;
  const risk:RiskState=slackSec<0?'INFEASIBLE':slackSec<10*60?'CRITICAL':slackSec<30*60?'ADVISORY':'NOMINAL';
  return {anchor,leaveBySec,slackSec,countdownSec,risk};
}
