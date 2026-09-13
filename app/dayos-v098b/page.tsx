'use client';
import { useEffect, useMemo, useState } from 'react';
import type { DayOSEntity } from '../../src/dayos/core/types';
import type { BatteryLeg, Telemetry, WeatherPoint, SolarWindow } from '../../src/dayos/core/telemetry';
import { projectTelemetry } from '../../src/dayos/viewmodel/projectTelemetry';

export default function DayOSV098b(){
 const [nowSec,setNowSec]=useState(()=>Math.floor(Date.now()/1000));
 useEffect(()=>{const id=setInterval(()=>setNowSec(Math.floor(Date.now()/1000)),1000);return()=>clearInterval(id)},[]);
 const base=useMemo(()=>nowSec-nowSec%3600,[nowSec]);
 const entities:DayOSEntity[]=useMemo(()=>[{id:'hard-1',title:'Protected Field Anchor',startsAt:base+3*3600,endsAt:base+4*3600,rigidity:'HARD',readiness:'GO',prepMinutes:15,location:[41.5048,-73.9696]}],[base]);
 const weather:Telemetry<WeatherPoint[]>=useMemo(()=>({value:[0,1,2,3,4,5,6].map((h,i)=>({epochSec:base+h*3600,temperatureC:[18,19,21,23,24,22,20][i],precipitationProbabilityPct:[5,8,12,15,20,18,10][i]})),observedAtUtc:new Date().toISOString(),source:'PUBLIC_SAFE fixture',epistemic:'REPORTED',temporalRole:'FORECAST',confidence:.75}),[base]);
 const solar:Telemetry<SolarWindow>=useMemo(()=>({value:{sunriseSec:base-4*3600,solarNoonSec:base+2*3600,sunsetSec:base+8*3600},observedAtUtc:new Date().toISOString(),source:'PUBLIC_SAFE fixture',epistemic:'REPORTED',temporalRole:'FORECAST',confidence:.7}),[base]);
 const batteryLegs:BatteryLeg[]=useMemo(()=>[{id:'standby',startsAt:nowSec,endsAt:nowSec+3600,screenIntensity:.25,gps:false,sensor:false,weakSignal:false},{id:'transit',startsAt:nowSec+3600,endsAt:nowSec+5400,screenIntensity:.8,gps:true,sensor:false,weakSignal:false},{id:'field',startsAt:nowSec+5400,endsAt:nowSec+9000,screenIntensity:.55,gps:true,sensor:true,weakSignal:false}],[nowSec]);
 const vm=projectTelemetry({entities,nowSec,transitDurationSec:45*60,weather,solar,batteryLegs,ambientSocPct:82,temperatureC:22});
 const fmt=(s:number|null)=>s==null?'—':new Date(s*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 const mins=(s:number|null)=>s==null?'—':`${Math.round(s/60)}m`;
 return <main style={{minHeight:'100vh',background:'#071019',color:'#eef6ff',padding:18,fontFamily:'system-ui'}}><div style={{maxWidth:1400,margin:'0 auto'}}>
   <section style={panel}><div style={eyebrow}>ARTEMIS DAYOS · v0.9.8b</div><h1 style={{margin:'6px 0'}}>Telemetry & Critical Timing</h1><div style={{color:'#8fa4b8'}}>Pure projection preview · fixture telemetry only · no live-weather/device claims</div></section>
   <section style={{...panel,marginTop:12}} aria-label="Critical timing rail"><div style={eyebrow}>CRITICAL TIMING RAIL</div><div style={{display:'grid',gridTemplateColumns:'2fr repeat(5,1fr)',gap:12,marginTop:10}}><Metric n="HARD ANCHOR" v={vm.critical.anchor?.title||'—'}/><Metric n="LEAVE BY" v={fmt(vm.critical.leaveBySec)}/><Metric n="SLACK" v={mins(vm.critical.slackSec)}/><Metric n="COUNTDOWN" v={mins(vm.critical.countdownSec)}/><Metric n="RISK" v={vm.critical.risk}/><Metric n="NOW" v={fmt(nowSec)}/></div></section>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
     <section style={panel}><div style={eyebrow}>TEMPERATURE FORECAST</div><Spark values={vm.weather.map(x=>x.temperatureC)}/><div style={{color:'#8fa4b8',fontSize:12}}>{vm.provenance.weather}</div></section>
     <section style={panel}><div style={eyebrow}>BATTERY SoC(t)</div><Spark values={(vm.battery?.samples||[]).filter((_,i)=>i%15===0).map(x=>x.soc)}/><div style={{display:'flex',justifyContent:'space-between'}}><span>Start {vm.battery?.socStart.toFixed(1)}%</span><strong>End {vm.battery?.socEnd.toFixed(1)}%</strong></div><div style={{color:'#8fa4b8',fontSize:12}}>{vm.provenance.battery}</div></section>
   </div>
   <section style={{...panel,marginTop:12}}><div style={eyebrow}>DAYLIGHT WINDOW</div><div style={{height:12,background:'#142333',borderRadius:99,position:'relative',margin:'18px 0'}}><div style={{position:'absolute',left:'15%',right:'15%',top:0,bottom:0,borderRadius:99,background:'#d9b44a'}}/></div><div style={{display:'flex',justifyContent:'space-between'}}><span>Sunrise {fmt(vm.solar?.sunriseSec??null)}</span><span>Solar noon {fmt(vm.solar?.solarNoonSec??null)}</span><span>Sunset {fmt(vm.solar?.sunsetSec??null)}</span></div><div style={{color:'#8fa4b8',fontSize:12,marginTop:8}}>{vm.provenance.solar}</div></section>
 </div></main>
}
function Metric({n,v}:{n:string;v:string}){return <div><div style={eyebrow}>{n}</div><div style={{fontSize:18,fontWeight:800,marginTop:4}}>{v}</div></div>}
function Spark({values}:{values:number[]}){const w=600,h=140;if(values.length<2)return <div style={{height:h}}/>;const min=Math.min(...values),max=Math.max(...values),span=max-min||1;const pts=values.map((v,i)=>`${i/(values.length-1)*w},${h-10-(v-min)/span*(h-20)}`).join(' ');return <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:150,margin:'10px 0'}} role="img" aria-label="telemetry plot"><polyline fill="none" stroke="currentColor" strokeWidth="4" points={pts}/></svg>}
const panel:React.CSSProperties={background:'#0d1823',border:'1px solid #223345',borderRadius:12,padding:14};
const eyebrow:React.CSSProperties={fontSize:10,fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',letterSpacing:'.08em',color:'#8fa4b8'};
