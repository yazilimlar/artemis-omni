'use client';
import {useState} from 'react';
type Lens='spatial'|'telemetry'|'scenario'|'evidence';
const lenses:Record<Lens,{label:string;src:string;note:string}>={
 spatial:{label:'Spatial Intelligence',src:'/dayos-v098a/',note:'Leaflet/OSM spatial lens, route alternatives, current/expected location.'},
 telemetry:{label:'Telemetry + Critical Timing',src:'/dayos-v098b/',note:'Weather/daylight telemetry, battery projection, HARD-anchor timing rail.'},
 scenario:{label:'Scenario Overlay',src:'/dayos-v098c/',note:'Ephemeral what-if controls with feasibility and constraint explanations.'},
 evidence:{label:'Evidence + Cost',src:'/dayos-v098d/',note:'Evidence-backed costs with actual, booked, tariff, and estimate bands kept separate.'}
};
export default function DayOSNext(){
 const [lens,setLens]=useState<Lens>('spatial'); const active=lenses[lens];
 return <main style={{minHeight:'100vh',background:'#071019',color:'#eef6ff',fontFamily:'system-ui'}}><div style={{maxWidth:1600,margin:'0 auto',padding:16}}>
  <section style={{background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:16}}><div style={{fontSize:10,letterSpacing:'.12em',fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',color:'#8fa4b8'}}>ARTEMIS DAYOS · INTEGRATION PREVIEW</div><h1 style={{margin:'6px 0'}}>Combined Upgraded DayOS</h1><p style={{margin:0,color:'#8fa4b8'}}>One public entry point for Spatial, Telemetry/Critical Timing, Scenario Overlay, and Evidence/Cost hardening.</p><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}>{(Object.keys(lenses) as Lens[]).map(k=><button key={k} onClick={()=>setLens(k)} aria-pressed={lens===k} style={{border:'1px solid #2a4055',background:lens===k?'#17324a':'#101d2a',color:'#eef6ff',borderRadius:9,padding:'9px 12px',cursor:'pointer'}}>{lenses[k].label}</button>)}</div></section>
  <section style={{background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:12,marginTop:12}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap',marginBottom:10}}><div><strong>{active.label}</strong><div style={{fontSize:12,color:'#8fa4b8',marginTop:3}}>{active.note}</div></div><a href={active.src} target="_blank" rel="noreferrer" style={{color:'#8fc7ff'}}>Open lens directly ↗</a></div><iframe key={active.src} title={active.label} src={active.src} style={{width:'100%',height:'78vh',border:'1px solid #223345',borderRadius:10,background:'#071019'}}/></section>
  <section style={{marginTop:12,padding:12,border:'1px solid #223345',borderRadius:12,color:'#8fa4b8',fontSize:12}}>Integration rule: scenario state is ephemeral, telemetry retains provenance, and cost classes are never blended into a misleading total.</section>
 </div></main>;
}
