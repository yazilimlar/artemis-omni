import type { Coord, OperationalContext, Readiness, TransportMode } from '../core/types';
import { computeExpectedLocationVector } from '../engines/routeSolver';

export interface SpatialMapViewModel {
  currentLocation: { coord: Coord; label: string } | null;
  expectedLocation: ReturnType<typeof computeExpectedLocationVector>;
  nodes: Array<{ id:string; coord:Coord; title:string; status:Readiness; isHard:boolean }>;
  polylines: Array<{ id:string; mode:TransportMode; coords:Coord[]; isSelected:boolean }>;
  bounds: [Coord,Coord] | null;
}

export function projectSpatialMap(ctx:OperationalContext):SpatialMapViewModel {
  const target=ctx.entities.find(e=>e.id===ctx.selectedTargetId) || null;
  const current=ctx.currentGps;
  const expectedLocation=current&&target ? computeExpectedLocationVector({current,target,nowSec:ctx.nowSec,preferredMode:ctx.activeRouteMode}) : null;
  const nodes=ctx.entities.filter(e=>e.location).map(e=>({id:e.id,coord:e.location!,title:e.title,status:e.readiness,isHard:e.rigidity==='HARD'}));
  const polylines=expectedLocation ? expectedLocation.alternatives.map(r=>({id:r.id,mode:r.mode,coords:r.coords,isSelected:r.id===expectedLocation.activeRoute.id})) : [];
  const pts:Coord[]=[];
  if(current) pts.push(current);
  if(target?.location) pts.push(target.location);
  const bounds=pts.length ? [
    [Math.min(...pts.map(p=>p[0])),Math.min(...pts.map(p=>p[1]))] as Coord,
    [Math.max(...pts.map(p=>p[0])),Math.max(...pts.map(p=>p[1]))] as Coord
  ] as [Coord,Coord] : null;
  return {currentLocation:current?{coord:current,label:'Current location'}:null,expectedLocation,nodes,polylines,bounds};
}
