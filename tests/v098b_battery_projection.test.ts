import { describe, expect, it } from 'vitest';
import { integrateSoc } from '../src/dayos/engines/batteryEngine';
import { projectTelemetry } from '../src/dayos/viewmodel/projectTelemetry';
import type { DayOSEntity } from '../src/dayos/core/types';
import type { BatteryLeg, Telemetry, WeatherPoint } from '../src/dayos/core/telemetry';
const t0=1700000000;
const entities:DayOSEntity[]=[{id:'hard-1',title:'Protected Anchor',startsAt:t0+3600,endsAt:t0+7200,rigidity:'HARD',readiness:'GO',prepMinutes:10,location:[41.5,-73.97]}];
describe('v0.9.8b battery and telemetry',()=>{
 it('integrates battery within physical bounds',()=>{const legs:BatteryLeg[]=[{id:'leg-1',startsAt:t0,endsAt:t0+3600,screenIntensity:.5,gps:true,sensor:false,weakSignal:false}];const x=integrateSoc({socStart:40,legs,tempC:20,stepSec:60});expect(x.socEnd).toBeGreaterThanOrEqual(0);expect(x.socEnd).toBeLessThanOrEqual(100);expect(x.socEnd).toBeCloseTo(29.25,1);expect(x.samples.length).toBe(61);});
 it('preserves source provenance in the view model',()=>{const weather:Telemetry<WeatherPoint[]>={value:[{epochSec:t0,temperatureC:24}],observedAtUtc:'2026-09-12T23:00:00Z',source:'fixture-weather',epistemic:'REPORTED',temporalRole:'FORECAST',confidence:.9};const vm=projectTelemetry({entities,nowSec:t0,transitDurationSec:1200,weather});expect(vm.weather).toHaveLength(1);expect(vm.provenance.weather).toContain('fixture-weather');expect(vm.critical.anchor?.id).toBe('hard-1');});
});
