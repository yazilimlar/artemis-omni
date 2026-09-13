'use client';
import {useEffect,useState} from 'react';
import {DEFAULT_DAYOS_RUNTIME,DayOSRuntimeState,UnifiedHorizon,parseRuntime,serializeRuntime} from '../../src/dayos/runtime/runtimeState';
import NativeTelemetry from './NativeTelemetry';
import NativeScenario from './NativeScenario';
import NativeEvidenceCost from './NativeEvidenceCost';
import DayOSSpatialPage from '../dayos-v098a/page';
const hs:UnifiedHorizon[]=['now','today','tomorrow','week','month'];
export default function NativeWorkspace(){const [r,setR]=useState<DayOSRuntimeState>(DEFAULT_DAYOS_RUNTIME);useEffect(()=>setR(parseRuntime(window.location.search)),[]);useEffect(()=>window.history.replaceState(null,'',window.location.pathname+'?'+serializeRuntime(r)),[r]);return <div><section style={box}><small>ARTEMIS DAYOS · v0.9.9</small><h1>Unified Command Workspace</h1><p>One runtime; native spatial, timing, telemetry, scenario reasoning, evidence and cost.</p><div>{hs.map(h=><button key={h} onClick={()=>setR(x=>({...x,horizon:h}))} style={btn}>{h}</button>)}<button onClick={()=>setR(x=>({...x,timeMode:x.timeMode==='LIVE'?'SCRUB':'LIVE'}))} style={btn}>{r.timeMode}</button></div></section><DayOSSpatialPage/><NativeTelemetry/><NativeScenario/><NativeEvidenceCost/><section style={{...box,marginTop:12,fontFamily:'monospace'}}>horizon={r.horizon} · mode={r.timeMode} · target={r.selectedTargetId}</section></div>}
const box:React.CSSProperties={background:'#0d1823',border:'1px solid #223345',borderRadius:14,padding:16};const btn:React.CSSProperties={margin:3,padding:'8px 11px',background:'#101d2a',color:'#eef6ff',border:'1px solid #2a4055',borderRadius:8};
