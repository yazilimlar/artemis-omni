import type { Coord, DayOSEntity, ExpectedLocationVector, RouteOption, TransportMode } from '../core/types';

const R = 6371000;
const toRad = (d:number) => d * Math.PI / 180;
export function haversineMeters(a:Coord,b:Coord){
  const dLat=toRad(b[0]-a[0]), dLon=toRad(b[1]-a[1]);
  const x=Math.sin(dLat/2)**2+Math.cos(toRad(a[0]))*Math.cos(toRad(b[0]))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

const speedMps:Record<TransportMode,number>={drive:15.5,transit:9,bike:4.5,walk:1.4};
const fixedSec:Record<TransportMode,number>={drive:300,transit:720,bike:120,walk:0};

export function buildRouteOptions(current:Coord,target:DayOSEntity,nowSec:number):RouteOption[]{
  if(!target.location) return [];
  const distance=Math.max(1,Math.round(haversineMeters(current,target.location)));
  return (Object.keys(speedMps) as TransportMode[]).map(mode=>{
    const durationSec=Math.round(distance/speedMps[mode])+fixedSec[mode];
    const expectedArrivalSec=nowSec+durationSec;
    const prepSec=(target.prepMinutes||0)*60;
    const slackSec=target.startsAt-prepSec-expectedArrivalSec;
    return {
      id:`${target.id}:${mode}`,
      mode,
      durationSec,
      distanceMeters:distance,
      expectedArrivalSec,
      slackSec,
      coords:[current,target.location!],
      viable: target.rigidity!=='HARD' || slackSec>=0,
      rejectionReason: target.rigidity==='HARD'&&slackSec<0?'Negative slack to HARD anchor':undefined
    };
  });
}

export function computeExpectedLocationVector(args:{
  current:Coord; target:DayOSEntity; nowSec:number; preferredMode:TransportMode;
}):ExpectedLocationVector|null{
  const {current,target,nowSec,preferredMode}=args;
  if(!target.location) return null;
  const alternatives=buildRouteOptions(current,target,nowSec);
  const preferred=alternatives.find(r=>r.mode===preferredMode&&r.viable);
  const activeRoute=preferred || alternatives.find(r=>r.viable) || alternatives[0];
  if(!activeRoute) return null;
  const prepSec=(target.prepMinutes||0)*60;
  return {
    currentCoord:current,
    targetId:target.id,
    targetCoord:target.location,
    targetTitle:target.title,
    targetStartsAt:target.startsAt,
    leaveBySec:target.startsAt-prepSec-activeRoute.durationSec,
    expectedArrivalSec:activeRoute.expectedArrivalSec,
    slackSec:activeRoute.slackSec,
    activeRoute,
    alternatives
  };
}
