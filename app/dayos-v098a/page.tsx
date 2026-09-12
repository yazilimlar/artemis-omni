'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Coord, DayOSEntity, OperationalContext, TransportMode } from '../../src/dayos/core/types';
import { projectSpatialMap } from '../../src/dayos/viewmodel/projectSpatialMap';

declare global { interface Window { L?: any; __dayos_map?: any } }

const demoEntities:readonly DayOSEntity[]=[
  {id:'mission:fixture-1',title:'Beacon Site Inspection',startsAt:Math.floor(Date.now()/1000)+3600,endsAt:Math.floor(Date.now()/1000)+7200,rigidity:'HARD',readiness:'GO',prepMinutes:10,location:[41.5048,-73.9696]},
  {id:'mission:fixture-2',title:'Newburgh Follow-up',startsAt:Math.floor(Date.now()/1000)+10800,endsAt:Math.floor(Date.now()/1000)+14400,rigidity:'FIRM',readiness:'ADVISORY',prepMinutes:5,location:[41.5034,-74.0104]}
];
const fallbackCoord:Coord=[41.6057,-73.9715];

function useLeafletReady(){
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    if(window.L){setReady(true);return;}
    if(!document.querySelector('link[data-dayos-leaflet]')){
      const link=document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; link.dataset.dayosLeaflet='1'; document.head.appendChild(link);
    }
    const existing=document.querySelector('script[data-dayos-leaflet]') as HTMLScriptElement|null;
    if(existing){existing.addEventListener('load',()=>setReady(true),{once:true});return;}
    const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.async=true; s.dataset.dayosLeaflet='1'; s.onload=()=>setReady(true); document.body.appendChild(s);
  },[]);
  return ready;
}

export default function DayOSSpatialPage(){
  const ready=useLeafletReady();
  const mapDiv=useRef<HTMLDivElement|null>(null);
  const layersRef=useRef<any[]>([]);
  const [selectedTargetId,setSelectedTargetId]=useState('mission:fixture-1');
  const [routeMode,setRouteMode]=useState<TransportMode>('drive');
  const [timeMode,setTimeMode]=useState<'LIVE'|'SCRUB'>('LIVE');
  const [scrubAnchorSec,setScrubAnchorSec]=useState<number|null>(null);
  const [gps,setGps]=useState<Coord|null>(fallbackCoord);
  const [geoState,setGeoState]=useState<'FALLBACK'|'LIVE'|'DENIED'>('FALLBACK');

  useEffect(()=>{
    const p=new URLSearchParams(location.search);
    const target=p.get('target'); if(target&&demoEntities.some(e=>e.id===target)) setSelectedTargetId(target);
    const mode=p.get('mode'); if(mode==='SCRUB') setTimeMode('SCRUB');
    const scrub=Number(p.get('scrub')); if(Number.isFinite(scrub)&&scrub>0) setScrubAnchorSec(scrub);
    const route=p.get('route') as TransportMode|null; if(route&&['drive','transit','bike','walk'].includes(route)) setRouteMode(route);
  },[]);

  useEffect(()=>{
    const p=new URLSearchParams(location.search);
    p.set('lens','map');p.set('target',selectedTargetId);p.set('mode',timeMode);p.set('route',routeMode);
    if(scrubAnchorSec) p.set('scrub',String(scrubAnchorSec)); else p.delete('scrub');
    history.replaceState(null,'','?'+p.toString());
  },[selectedTargetId,timeMode,routeMode,scrubAnchorSec]);

  const nowSec=timeMode==='SCRUB'&&scrubAnchorSec?scrubAnchorSec:Math.floor(Date.now()/1000);
  const ctx:OperationalContext=useMemo(()=>({nowSec,timeMode,scrubAnchorSec,selectedTargetId,activeRouteMode:routeMode,currentGps:gps,entities:demoEntities}),[nowSec,timeMode,scrubAnchorSec,selectedTargetId,routeMode,gps]);
  const vm=useMemo(()=>projectSpatialMap(ctx),[ctx]);

  useEffect(()=>{
    if(!ready||!mapDiv.current||!window.L) return;
    const L=window.L;
    if(!window.__dayos_map){
      window.__dayos_map=L.map(mapDiv.current,{zoomControl:true}).setView(fallbackCoord,10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(window.__dayos_map);
    }
    const map=window.__dayos_map;
    layersRef.current.forEach(x=>x.remove()); layersRef.current=[];
    if(vm.currentLocation){
      const m=L.circleMarker(vm.currentLocation.coord,{radius:8,color:'#53c7ff',fillColor:'#53c7ff',fillOpacity:.65}).bindTooltip('Current location',{permanent:false,direction:'top'}).addTo(map); m.getElement?.()?.setAttribute('aria-label','current-location'); layersRef.current.push(m);
    }
    vm.nodes.forEach(n=>{
      const color=n.status==='GO'?'#49dc9a':n.status==='ADVISORY'?'#ffbd55':'#ff647c';
      const m=L.circleMarker(n.coord,{radius:n.id===selectedTargetId?10:7,color,weight:n.isHard?4:2,fillColor:color,fillOpacity:.65}).bindTooltip(n.title,{direction:'top'}).on('click',()=>setSelectedTargetId(n.id)).addTo(map); m.getElement?.()?.setAttribute('aria-label',n.id===selectedTargetId?'next-destination':`entity-${n.id}`); layersRef.current.push(m);
    });
    vm.polylines.forEach(p=>{const line=L.polyline(p.coords,{color:p.isSelected?'#53c7ff':'#7d91a8',weight:p.isSelected?5:2,dashArray:p.isSelected?undefined:'7 7',opacity:p.isSelected?1:.55}).addTo(map);layersRef.current.push(line)});
    if(vm.bounds){const b=L.latLngBounds(vm.bounds); if(b.isValid()) map.fitBounds(b.pad(.25));}
    const invalidate=()=>map.invalidateSize(); setTimeout(invalidate,0); window.addEventListener('resize',invalidate); return()=>window.removeEventListener('resize',invalidate);
  },[ready,vm,selectedTargetId]);

  const requestLocation=()=>{
    if(!navigator.geolocation){setGeoState('DENIED');return;}
    navigator.geolocation.getCurrentPosition(p=>{setGps([p.coords.latitude,p.coords.longitude]);setGeoState('LIVE')},()=>{setGps(fallbackCoord);setGeoState('DENIED')},{enableHighAccuracy:true,timeout:8000,maximumAge:60000});
  };

  const x=vm.expectedLocation;
  const min=(s:number)=>Math.round(s/60);
  const fmt=(s:number)=>new Date(s*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

  return <main style={{minHeight:'100vh',background:'#071019',color:'#eef6ff',fontFamily:'system-ui,-apple-system,sans-serif',padding:16}}>
    <div style={{maxWidth:1400,margin:'0 auto'}}>
      <header style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:12,marginBottom:12}}>
        <section style={panel}><div style={label}>ARTEMIS DAYOS · v0.9.8a SPATIAL INTELLIGENCE</div><h1 style={{margin:'6px 0 4px',fontSize:26}}>Flight Deck</h1><div style={{color:'#8fa4b8'}}>Leaflet + OpenStreetMap · canonical projection · foreground-only navigation</div></section>
        <section style={panel}><div style={label}>LOCATION SOURCE</div><div style={{display:'flex',gap:8,alignItems:'center',marginTop:8,flexWrap:'wrap'}}><strong>{geoState}</strong><button style={button} onClick={requestLocation}>Use precise location</button>{geoState!=='LIVE'&&<span style={{color:'#8fa4b8',fontSize:12}}>Fallback: Marlboro-area demo anchor</span>}</div></section>
      </header>
      <section style={{...panel,marginBottom:12}} aria-label="Expected next location">
        <div style={label}>EXPECTED NEXT LOCATION</div>
        {x?<><div style={{display:'grid',gridTemplateColumns:'2fr repeat(4,1fr)',gap:10,marginTop:8}}>
          <div><div style={{fontSize:24,fontWeight:800}}>{x.targetTitle}</div><div style={{color:'#8fa4b8'}}>{x.targetCoord[0].toFixed(4)}, {x.targetCoord[1].toFixed(4)}</div></div>
          <Metric name="LEAVE BY" value={fmt(x.leaveBySec)}/><Metric name="ETA" value={fmt(x.expectedArrivalSec)}/><Metric name="DISTANCE" value={`${(x.activeRoute.distanceMeters/1609.34).toFixed(1)} mi`}/><Metric name="SLACK" value={`${x.slackSec>=0?'+':''}${min(x.slackSec)}m`} bad={x.slackSec<0}/>
        </div><div style={{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'}}>{(['drive','transit','bike','walk'] as TransportMode[]).map(m=><button key={m} aria-pressed={routeMode===m} onClick={()=>setRouteMode(m)} style={{...button,borderColor:routeMode===m?'#53c7ff':'#223345',color:routeMode===m?'#fff':'#a8b8c8'}}>{m.toUpperCase()}</button>)}</div></>:<div>No routeable target.</div>}
      </section>
      <section style={{...panel,padding:0,overflow:'hidden'}}><div ref={mapDiv} style={{height:'62vh',minHeight:460}} aria-label="DayOS spatial map"/></section>
      <footer style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap',marginTop:10,color:'#8fa4b8',fontSize:12}}><span>OSM attribution is rendered by Leaflet. Heavy/bulk tile use is not permitted; production provider decision remains open.</span><span>EntityStore truth is read-only in this lens.</span></footer>
    </div>
  </main>;
}

function Metric({name,value,bad}:{name:string;value:string;bad?:boolean}){return <div><div style={label}>{name}</div><div style={{fontSize:20,fontWeight:800,color:bad?'#ff647c':'#eef6ff'}}>{value}</div></div>}
const panel:React.CSSProperties={background:'#0d1823',border:'1px solid #223345',borderRadius:12,padding:14};
const button:React.CSSProperties={background:'#101d2a',border:'1px solid #223345',color:'#eef6ff',borderRadius:8,padding:'8px 10px',cursor:'pointer'};
const label:React.CSSProperties={fontSize:10,fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',letterSpacing:'.08em',color:'#8fa4b8'};
