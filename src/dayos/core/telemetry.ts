export type Epistemic='OBSERVED'|'REPORTED'|'INFERRED';
export type TemporalRole='ACTUAL'|'FORECAST'|'SCHEDULED'|'DERIVED';

export interface Telemetry<T>{
  value:T;
  observedAtUtc:string;
  contentTimeUtc?:string;
  source:string;
  epistemic:Epistemic;
  temporalRole:TemporalRole;
  confidence:number;
  expiresAtUtc?:string;
}

export interface WeatherPoint{
  epochSec:number;
  temperatureC:number;
  feelsLikeC?:number;
  precipitationProbabilityPct?:number;
  windKph?:number;
}

export interface SolarWindow{
  sunriseSec:number;
  solarNoonSec:number;
  sunsetSec:number;
}

export interface BatteryLeg{
  id:string;
  startsAt:number;
  endsAt:number;
  screenIntensity:number;
  gps:boolean;
  sensor:boolean;
  weakSignal:boolean;
  chargeRatePctPerHour?:number;
}
