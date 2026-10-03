import type { BatteryLeg } from '../core/telemetry';

export const BATTERY_RATE={idle:1.2,screenMax:8.5,gps:4.8,sensor:6.2,weakSignal:1.5} as const;
export const clamp=(v:number,a=0,b=100)=>Math.max(a,Math.min(b,v));

export function tempMultiplier(c:number){
  if(c<=-10) return 1.50;
  if(c<0) return 1.35;
  if(c<10) return 1.18;
  if(c<=35) return 1;
  return 1.22;
}

export interface BatterySample{t:number;soc:number}
export interface BatteryForecast{
  socStart:number;
  socEnd:number;
  depletionAt:number|null;
  samples:BatterySample[];
  drainPct:number;
}

function rateForLeg(leg:BatteryLeg,tempC:number){
  const drain=(BATTERY_RATE.idle+BATTERY_RATE.screenMax*clamp(leg.screenIntensity,0,1)+(leg.gps?BATTERY_RATE.gps:0)+(leg.sensor?BATTERY_RATE.sensor:0)+(leg.weakSignal?BATTERY_RATE.weakSignal:0))*tempMultiplier(tempC);
  return drain-(leg.chargeRatePctPerHour||0);
}

export function integrateSoc(args:{socStart:number;legs:readonly BatteryLeg[];tempC:number;stepSec?:number}):BatteryForecast{
  const {legs,tempC}=args;
  let soc=clamp(args.socStart), depletionAt:number|null=null;
  const stepSec=Math.max(1,args.stepSec||60);
  const samples:BatterySample[]=[];
  const start=legs.length?Math.min(...legs.map(l=>l.startsAt)):0;
  if(legs.length) samples.push({t:start,soc});
  for(const leg of [...legs].sort((a,b)=>a.startsAt-b.startsAt)){
    let t=leg.startsAt;
    while(t<leg.endsAt){
      const dt=Math.min(stepSec,leg.endsAt-t);
      const rate=rateForLeg(leg,tempC);
      const delta=rate*dt/3600;
      if(rate>0&&soc-delta<=0&&depletionAt===null){
        const hoursToZero=soc/rate;
        depletionAt=t+hoursToZero*3600;
      }
      soc=clamp(soc-delta);
      t+=dt;
      samples.push({t,soc});
    }
  }
  return {socStart:clamp(args.socStart),socEnd:soc,depletionAt,samples,drainPct:clamp(args.socStart)-soc};
}
