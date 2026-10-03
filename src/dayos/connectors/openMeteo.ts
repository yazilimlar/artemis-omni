import type { Coord } from '../core/types';
import type { SolarWindow, Telemetry, WeatherPoint } from '../core/telemetry';

export interface OpenMeteoSnapshot {
  weather: Telemetry<WeatherPoint[]>;
  solar: Telemetry<SolarWindow>;
}

function toEpochSec(iso:string){ return Math.floor(new Date(iso).getTime()/1000); }

export async function fetchOpenMeteoSnapshot(coord:Coord):Promise<OpenMeteoSnapshot>{
  const [lat,lon]=coord;
  const params=new URLSearchParams({
    latitude:String(lat),
    longitude:String(lon),
    hourly:'temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m',
    daily:'sunrise,sunset',
    temperature_unit:'celsius',
    wind_speed_unit:'kmh',
    timezone:'auto',
    forecast_days:'2'
  });
  // Runtime fetch to api.open-meteo.com. Accepted at noindex_review.
  // Blocking this fetch is required before any public_safe_demo upgrade.
  const res=await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`,{cache:'no-store'});
  if(!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const data=await res.json();
  const observedAtUtc=new Date().toISOString();
  const times:string[]=data?.hourly?.time||[];
  const temps:number[]=data?.hourly?.temperature_2m||[];
  const feels:number[]=data?.hourly?.apparent_temperature||[];
  const pop:number[]=data?.hourly?.precipitation_probability||[];
  const wind:number[]=data?.hourly?.wind_speed_10m||[];
  const value:WeatherPoint[]=times.map((t,i)=>({
    epochSec:toEpochSec(t),
    temperatureC:Number(temps[i]),
    feelsLikeC:Number.isFinite(feels[i])?Number(feels[i]):undefined,
    precipitationProbabilityPct:Number.isFinite(pop[i])?Number(pop[i]):undefined,
    windKph:Number.isFinite(wind[i])?Number(wind[i]):undefined
  })).filter(x=>Number.isFinite(x.epochSec)&&Number.isFinite(x.temperatureC));
  const sunriseIso=data?.daily?.sunrise?.[0];
  const sunsetIso=data?.daily?.sunset?.[0];
  if(!sunriseIso||!sunsetIso) throw new Error('Open-Meteo solar window missing');
  const sunriseSec=toEpochSec(sunriseIso), sunsetSec=toEpochSec(sunsetIso);
  const solarNoonSec=Math.round((sunriseSec+sunsetSec)/2);
  return {
    weather:{value,observedAtUtc,source:'Open-Meteo',epistemic:'REPORTED',temporalRole:'FORECAST',confidence:.92,expiresAtUtc:new Date(Date.now()+30*60*1000).toISOString()},
    solar:{value:{sunriseSec,solarNoonSec,sunsetSec},observedAtUtc,source:'Open-Meteo + midpoint-derived solar noon',epistemic:'REPORTED',temporalRole:'FORECAST',confidence:.88,expiresAtUtc:new Date(Date.now()+6*60*60*1000).toISOString()}
  };
}
