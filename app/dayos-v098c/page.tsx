'use client';
import { useEffect, useMemo, useState } from 'react';
import { projectScenario } from '../../src/dayos/viewmodel/projectScenario';
import type { ScenarioOverlay } from '../../src/dayos/core/scenario';

const canonical = Object.freeze({ nowSec: 1000, anchorStartsAtSec: 5000, basePrepMin: 10, baseTransitSec: 1200, baseBatteryEndPct: 60 });
const initial: ScenarioOverlay = { id: 'interactive', transitDeltaMin: 0, prepDeltaMin: 0, batteryStartDeltaPct: 0, weatherRiskDelta: 0 };

export default function ScenarioPage(){
  const [draft,setDraft]=useState<ScenarioOverlay>(initial);
  const [applied,setApplied]=useState<ScenarioOverlay>(initial);
  useEffect(()=>{ const t=setTimeout(()=>setApplied(draft),220); return()=>clearTimeout(t); },[draft]);
  const vm=useMemo(()=>projectScenario(canonical,applied),[applied]);
  const set=(k:keyof ScenarioOverlay,v:number)=>setDraft(s=>({...s,[k]:v}));
  const min=(s:number|null)=>s==null?'—':`${Math.round(s/60)}m`;
  return <main style={{minHeight:'100vh',background:'#071019',color:'#eef6ff',padding:18,fontFamily:'system-ui'}}><div style={{maxWidth:1200,margin:'0 auto'}}>
    <section style={panel}><small>ARTEMIS DAYOS · v0.9.8c</small><h1>Scenario Overlay & Smart Controls</h1><p style={muted}>Ephemeral what-if overlay · 220 ms debounce · canonical truth remains read-only</p></section>
    <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:12,marginTop:12}}>
      <aside style={panel} aria-label="Scenario drawer"><h2 style={{marginTop:0}}>Scenario Drawer</h2>
        <Slider name="Transit delay" value={draft.transitDeltaMin||0} min={-20} max={90} step={5} suffix=" min" onChange={v=>set('transitDeltaMin',v)}/>
        <Slider name="Prep delta" value={draft.prepDeltaMin||0} min={-10} max={45} step={5} suffix=" min" onChange={v=>set('prepDeltaMin',v)}/>
        <Slider name="Battery delta" value={draft.batteryStartDeltaPct||0} min={-50} max={20} step={5} suffix="%" onChange={v=>set('batteryStartDeltaPct',v)}/>
        <Slider name="Weather-risk delta" value={draft.weatherRiskDelta||0} min={0} max={1} step={0.1} suffix="" onChange={v=>set('weatherRiskDelta',v)}/>
        <button onClick={()=>setDraft(initial)} style={button}>Reset scenario</button>
      </aside>
      <section style={panel}><h2 style={{marginTop:0}}>Baseline → Candidate</h2>
        <div style={grid}><Metric n="BASE SLACK" v={min(vm.baseline.slackSec)}/><Metric n="CANDIDATE SLACK" v={min(vm.candidate.slackSec)}/><Metric n="Δ SLACK" v={min(vm.delta.slackSec)}/><Metric n="BATTERY END" v={vm.candidate.batteryEndPct==null?'—':`${vm.candidate.batteryEndPct.toFixed(0)}%`}/><Metric n="FEASIBLE" v={vm.candidate.feasible?'YES':'NO'}/><Metric n="CHANGED" v={vm.changed?'YES':'NO'}/></div>
        <div style={{marginTop:18,padding:12,border:'1px solid #223345',borderRadius:10}}><strong>Decision explanation</strong>{vm.candidate.reasons.length?<ul>{vm.candidate.reasons.map(r=><li key={r}>{r}</li>)}</ul>:<p style={muted}>No hard constraint violated by this scenario.</p>}</div>
        <p style={{...muted,marginTop:18}}>Canonical input fingerprint: {JSON.stringify(canonical)}</p>
      </section>
    </div>
  </div></main>
}
function Slider({name,value,min,max,step,suffix,onChange}:{name:string;value:number;min:number;max:number;step:number;suffix:string;onChange:(v:number)=>void}){return <label style={{display:'block',margin:'16px 0'}}><div style={{display:'flex',justifyContent:'space-between'}}><span>{name}</span><strong>{value}{suffix}</strong></div><input aria-label={name} type="range" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))} style={{width:'100%'}}/></label>}
function Metric({n,v}:{n:string;v:string}){return <div><small style={muted}>{n}</small><div style={{fontSize:22,fontWeight:800,marginTop:4}}>{v}</div></div>}
const panel:React.CSSProperties={background:'#0d1823',border:'1px solid #223345',borderRadius:12,padding:16};
const muted:React.CSSProperties={color:'#8fa4b8'};
const grid:React.CSSProperties={display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:16};
const button:React.CSSProperties={background:'#101d2a',border:'1px solid #223345',color:'#eef6ff',borderRadius:8,padding:'9px 12px',cursor:'pointer'};
