import { describe, expect, it } from 'vitest';
import type { DayOSEntity, OperationalContext } from '../src/dayos/core/types';
import { haversineMeters } from '../src/dayos/engines/routeSolver';
import { projectSpatialMap } from '../src/dayos/viewmodel/projectSpatialMap';

const t0 = 1_700_000_000;
const entities: readonly DayOSEntity[] = [
  { id:'mission:fixture-1', title:'Beacon Site Inspection', startsAt:t0+3600, endsAt:t0+7200, rigidity:'HARD', readiness:'GO', prepMinutes:10, location:[41.5048,-73.9696] },
  { id:'mission:fixture-2', title:'Newburgh Follow-up', startsAt:t0+10800, endsAt:t0+14400, rigidity:'FIRM', readiness:'ADVISORY', prepMinutes:5, location:[41.5034,-74.0104] }
];
const ctx: OperationalContext = { nowSec:t0, timeMode:'LIVE', scrubAnchorSec:null, selectedTargetId:'mission:fixture-1', activeRouteMode:'drive', currentGps:[41.6057,-73.9715], entities };

describe('DayOS v0.9.8a spatial intelligence', () => {
  it('projects valid bounds, nodes, polylines and expected target', () => {
    const vm = projectSpatialMap(ctx);
    expect(vm.bounds).not.toBeNull();
    expect(vm.nodes).toHaveLength(2);
    expect(vm.expectedLocation?.targetId).toBe('mission:fixture-1');
    expect(vm.polylines.length).toBeGreaterThanOrEqual(4);
    expect(vm.polylines.every(p => p.coords.length >= 2)).toBe(true);
  });
  it('keeps selected route endpoints within 50m', () => {
    const vm = projectSpatialMap(ctx);
    const active = vm.polylines.find(p => p.isSelected);
    if (!active) throw new Error('active route missing');
    expect(haversineMeters(active.coords[0], ctx.currentGps!)).toBeLessThan(50);
    expect(haversineMeters(active.coords[active.coords.length-1], entities[0].location!)).toBeLessThan(50);
  });
  it('does not mutate canonical entities when target changes', () => {
    const before = JSON.stringify(entities);
    const vm = projectSpatialMap({ ...ctx, selectedTargetId:'mission:fixture-2' });
    expect(vm.expectedLocation?.targetId).toBe('mission:fixture-2');
    expect(JSON.stringify(entities)).toBe(before);
  });
});
