import type { DayOSEntity } from '../core/types';
import type { BatteryLeg, SolarWindow, Telemetry, WeatherPoint } from '../core/telemetry';
import { computeCriticalTiming } from '../engines/criticalTiming';
import { integrateSoc } from '../engines/batteryEngine';

export interface TelemetryViewModel{
  critical:ReturnType<typeof computeCriticalTiming>;
  weather:WeatherPoint[];
  solar:SolarWindow|null;
  battery:ReturnType<typeof integrateSoc>|null;
  provenance:{weather:string|null;solar:string|null;battery:string};
}

export function projectTelemetry(args:{
  entities:readonly DayOSEntity[];
  nowSec:number;
  transitDurationSec:number;
  weather?:Telemetry<WeatherPoint[]>;
  solar?:Telemetry<SolarWindow>;
  batteryLegs?:readonly BatteryLeg[];
  ambientSocPct?:number;
  temperatureC?:number;
}):TelemetryViewModel{
  const critical=computeCriticalTiming({entities:args.entities,nowSec:args.nowSec,transitDurationSec:args.transitDurationSec});
  const battery=args.batteryLegs&&args.ambientSocPct!=null?integrateSoc({socStart:args.ambientSocPct,legs:args.batteryLegs,tempC:args.temperatureC??20}):null;
  return {
    critical,
    weather:args.weather?.value??[],
    solar:args.solar?.value??null,
    battery,
    provenance:{
      weather:args.weather?`${args.weather.epistemic}/${args.weather.temporalRole} · ${args.weather.source}`:null,
      solar:args.solar?`${args.solar.epistemic}/${args.solar.temporalRole} · ${args.solar.source}`:null,
      battery:'DERIVED · batteryEngine v0.9.8b'
    }
  };
}
