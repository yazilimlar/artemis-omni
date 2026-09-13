'use client';
import {useEffect,useState} from 'react';
import {DEFAULT_DAYOS_RUNTIME,DayOSRuntimeState,UnifiedHorizon,UnifiedLens,parseRuntime,serializeRuntime} from '../../src/dayos/runtime/runtimeState';

const lenses:Record<Exclude<UnifiedLens,'overview'>,{label:string;src:string;note:string}>={
 spatial:{label:'Spatial Intelligence',src:'/dayos-v098a/',note:'Leaflet/OSM routes, current and expected location.'},
 telemetry:{label:'Telemetry + Critical Timing',src:'/dayos-v098b/',note:'Weather/daylight, battery projection, HARD-anchor timing.'},
 scenario:{label:'Scenario Overlay',src:'/dayos-v098c/',note:'Ephemeral what-if controls and feasibility.'},
 evidence:{label:'Evidence + Cost',src:'/dayos-v098d/',note:'Receipt, reservation, tariff and estimate bands kept separate.'}
};
const horizons:UnifiedHorizon[]=['now','today','tomorrow','week','month'];

export default function DayOSNext(){
 const [runtime,setRuntime]=useState<DayOSRuntimeState>(DEFAULT_DAYOS_RUNTIME);
 useEffect(()=>{setRuntime(parseRuntime(window.location.search))},[]);
 useEffect(()=>{const q=serializeRuntime(runtime);window.history.replaceState(null,'',`${window.location.pathname}?${q}`)},[runtime]);
 const patch=(p:Partial<DayOSRuntimeState>)=>setRuntime(s=>({...s,...p}));
 const active=runtime.activeLens==='overview'?null:lenses[runtime.activeLens];
 return <main style={{minHeight:'100vh',background:'#071019',color:'#eef6ff',fontFamily:'system-ui'}}><div style={{maxWidth:1600,margin:'0 auto',padding:16}}>
  <section style={{background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:16}}>
   <div style={{fontSize:10,letterSpacing:'.12em',fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',color:'#8fa4b8'}}>ARTEMIS DAYOS · v0.9.9 UNIFIED RUNTIME</div>
   <h1 style={{margin:'6px 0'}}>DayOS Command Overview</h1>
   <p style={{margin:0,color:'#8fa4b8'}}>One shared runtime controls lens, horizon, time mode and selected target. Legacy v0.9.8 lenses remain drill-down surfaces while they are ported natively.</p>
   <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}>{(['overview','spatial','telemetry','scenario','evidence'] as UnifiedLens[]).map(k=><button key={k} onClick={()=>patch({activeLens:k})} aria-pressed={runtime.activeLens===k} style={{border:'1px solid #2a4055',background:runtime.activeLens===k?'#17324a':'#101d2a',color:'#eef6ff',borderRadius:9,padding:'9px 12px',cursor:'pointer'}}>{k==='overview'?'Command Overview':k==='spatial'?'Spatial':k==='telemetry'?'Telemetry':k==='scenario'?'Scenario':'Evidence + Cost'}</button>)}</div>
   <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>{horizons.map(h=><button key={h} onClick={()=>patch({horizon:h})} aria-pressed={runtime.horizon===h} style={{border:'1px solid #2a4055',background:runtime.horizon===h?'#17324a':'#101d2a',color:'#eef6ff',borderRadius:8,padding:'7px 10px',cursor:'pointer'}}>{h}</button>)}<button onClick={()=>patch({timeMode:runtime.timeMode==='LIVE'?'SCRUB':'LIVE'})} style={{border:'1px solid #2a4055',background:'#101d2a',color:'#eef6ff',borderRadius:8,padding:'7px 10px',cursor:'pointer'}}>{runtime.timeMode}</button></div>
  </section>
  {runtime.activeLens==='overview'?<section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginTop:12}}>
   {[['Spatial','Route + expected location','/dayos-v098a/'],['Telemetry','Weather · daylight · battery','/dayos-v098b/'],['Scenario','Feasibility under change','/dayos-v098c/'],['Evidence + Cost','Provenance-backed cost classes','/dayos-v098d/']].map(([title,note,href])=><a key={title} href={href} style={{display:'block',textDecoration:'none',color:'#eef6ff',background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:16}}><div style={{fontSize:12,color:'#8fa4b8'}}>{runtime.horizon.toUpperCase()} · {runtime.timeMode}</div><h2 style={{margin:'7px 0'}}>{title}</h2><p style={{margin:0,color:'#8fa4b8'}}>{note}</p></a>)}
   <div style={{gridColumn:'1/-1',background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:16}}><strong>Canonical runtime</strong><div style={{marginTop:8,color:'#8fa4b8',fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:12}}>lens={runtime.activeLens} · horizon={runtime.horizon} · mode={runtime.timeMode} · target={runtime.selectedTargetId}</div></div>
  </section>:<section style={{background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:12,marginTop:12}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap',marginBottom:10}}><div><strong>{active!.label}</strong><div style={{fontSize:12,color:'#8fa4b8',marginTop:3}}>{active!.note}</div></div><a href={active!.src} target='_blank' rel='noreferrer' style={{color:'#8fc7ff'}}>Open legacy lens ↗</a></div><iframe key={active!.src} title={active!.label} src={active!.src} style={{width:'100%',height:'76vh',border:'1px solid #223345',borderRadius:10,background:'#071019'}}/></section>}
  <section style={{marginTop:12,padding:12,border:'1px solid #223345',borderRadius:12,color:'#8fa4b8',fontSize:12}}>v0.9.9 rule: runtime state is canonical; embedded v0.9.8 pages are temporary drill-downs, not independent truth.</section>
 </div></main>;
}
