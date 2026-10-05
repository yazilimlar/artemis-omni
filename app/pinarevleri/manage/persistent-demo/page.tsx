'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, RefreshCcw, Save, X } from 'lucide-react';
import { pinarDemoRpc, PINAR_DEMO_ENVIRONMENT } from '@/lib/pinar-evleri-demo-api';

type Status = 'inquiry'|'hold'|'pending'|'confirmed'|'checked_in'|'checked_out'|'cancelled'|'no_show';
type Unit = {id:string;name:string;short_code:string;base_capacity:number;max_capacity:number|null;is_active:boolean};
type Source = {id:number;name:string;color_hex:string|null;is_direct:boolean};
type Reservation = {id:string;guest_id:string;guest:string;unit_id:string;check_in:string;check_out:string;guest_count:number;status:Status;total_amount:number|null;source_id:number|null;source:string|null;updated_at:string};
type Block = {id:string;unit_id:string;start_date:string;end_date:string;reason:string;note:string|null};
type Snapshot = {environment:string;units:Unit[];sources:Source[];reservations:Reservation[];blocks:Block[]};
type Editor = {id:string|null;guest:string;unit_id:string;check_in:string;check_out:string;guest_count:number;status:Status;total_amount:number;source_id:number|null};

const parse=(s:string)=>new Date(`${s}T00:00:00`);
const key=(d:Date)=>d.toISOString().slice(0,10);
const add=(d:Date,n:number)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const overlaps=(a1:string,a2:string,b1:string,b2:string)=>parse(a1)<parse(b2)&&parse(a2)>parse(b1);
const blocksInventory=(s:Status)=>['hold','pending','confirmed','checked_in','checked_out'].includes(s);
const palette=['#c89b62','#7e9f7c','#c9675a','#8fa75e','#a67556','#6f8a91','#9b7a98'];

export default function PinarPersistentDemoPage(){
  const [data,setData]=useState<Snapshot|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [start,setStart]=useState('2026-08-18');
  const [days,setDays]=useState(14);
  const [guests,setGuests]=useState(2);
  const [editor,setEditor]=useState<Editor|null>(null);

  const load=async()=>{
    setLoading(true); setError('');
    try{setData(await pinarDemoRpc<Snapshot>('demo_manager_snapshot'));}
    catch(e){setError(e instanceof Error?e.message:'Unable to load demo database');}
    finally{setLoading(false);}
  };

  useEffect(()=>{void load();},[]);
  const dates=useMemo(()=>Array.from({length:days},(_,i)=>add(parse(start),i)),[start,days]);
  const end=key(add(parse(start),days));

  if(loading&&!data)return <main style={{padding:32,fontFamily:'Inter,Arial'}}>Loading {PINAR_DEMO_ENVIRONMENT}…</main>;
  if(!data)return <main style={{padding:32,fontFamily:'Inter,Arial'}}><h1>{PINAR_DEMO_ENVIRONMENT}</h1><p>{error||'No data returned.'}</p><button onClick={()=>void load()}>Retry</button></main>;

  const units=data.units.filter(u=>u.is_active);
  const reservations=data.reservations;
  const capacity=(u:Unit)=>u.max_capacity??u.base_capacity;
  const availability=(u:Unit,ci=start,co=end,g=guests,ignoreId?:string)=>{
    if(g>capacity(u))return {ok:false,reason:'Capacity'};
    if(data.blocks.some(b=>b.unit_id===u.id&&overlaps(b.start_date,b.end_date,ci,co)))return {ok:false,reason:'Block / maintenance'};
    const r=reservations.find(r=>r.id!==ignoreId&&r.unit_id===u.id&&blocksInventory(r.status)&&overlaps(r.check_in,r.check_out,ci,co));
    return r?{ok:false,reason:`Booking: ${r.guest}`}:{ok:true,reason:'Available'};
  };

  const occupancy=dates.map(d=>{
    const d1=key(d),d2=key(add(d,1));
    return Math.round(100*units.filter(u=>reservations.some(r=>r.unit_id===u.id&&blocksInventory(r.status)&&overlaps(r.check_in,r.check_out,d1,d2))).length/Math.max(1,units.length));
  });
  const avg=Math.round(occupancy.reduce((a,b)=>a+b,0)/Math.max(1,occupancy.length));
  const available=units.filter(u=>availability(u).ok);

  const openNew=(unitId?:string,ci=start)=>{
    const direct=data.sources.find(s=>s.name==='Direct Website')??data.sources[0];
    setEditor({id:null,guest:'',unit_id:unitId??available[0]?.id??units[0]?.id,check_in:ci,check_out:key(add(parse(ci),3)),guest_count:guests,status:'confirmed',total_amount:0,source_id:direct?.id??null});
    setMessage('');
  };

  const openEdit=(r:Reservation)=>setEditor({id:r.id,guest:r.guest,unit_id:r.unit_id,check_in:r.check_in,check_out:r.check_out,guest_count:r.guest_count,status:r.status,total_amount:Number(r.total_amount??0),source_id:r.source_id});

  const save=async(next=editor)=>{
    if(!next)return;
    setMessage(''); setError('');
    try{
      await pinarDemoRpc('demo_save_reservation',{
        p_reservation_id:next.id,
        p_guest_name:next.guest,
        p_unit_id:next.unit_id,
        p_check_in:next.check_in,
        p_check_out:next.check_out,
        p_guest_count:next.guest_count,
        p_status:next.status,
        p_total_amount:next.total_amount,
        p_source_id:next.source_id,
      });
      setEditor(null); setMessage(next.id?'Reservation updated and persisted.':'Reservation created and persisted.');
      await load();
    }catch(e){setError(e instanceof Error?e.message:'Save failed');}
  };

  const cancel=async(r:Reservation)=>{
    await save({id:r.id,guest:r.guest,unit_id:r.unit_id,check_in:r.check_in,check_out:r.check_out,guest_count:r.guest_count,status:'cancelled',total_amount:Number(r.total_amount??0),source_id:r.source_id});
  };

  return <main className="app">
    <header>
      <div><span>{PINAR_DEMO_ENVIRONMENT.toUpperCase()} · PERSISTENT TEST</span><h1>Manager Availability & Booking</h1><p>Changes on this page are saved to the dedicated demo database. This is not production.</p></div>
      <div className="actions"><button onClick={()=>openNew()}>New booking</button><button onClick={()=>void load()}><RefreshCcw size={15}/> Refresh DB</button></div>
    </header>

    <section className="notice"><b>Environment: DEMO</b><span>Future client-approved live system will use a separate <strong>Pinar Evleri Production</strong> project with authenticated manager access.</span></section>

    <section className="controls"><input type="date" value={start} onChange={e=>setStart(e.target.value)}/><select value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select><select value={guests} onChange={e=>setGuests(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} guests</option>)}</select><b>{avg}% occupancy</b><span>{available.length}/{units.length} fully available for selected range</span></section>

    {message&&<div className="success">{message}</div>}{error&&<div className="error">{error}</div>}

    <section className="finder"><div><CalendarDays size={18}/><b>{start} → {end}</b><small>{guests} guests</small></div>{units.map((u,i)=>{const a=availability(u);return <button key={u.id} className={a.ok?'ok':'no'} onClick={()=>a.ok&&openNew(u.id)}><i style={{background:palette[i%palette.length]}}/><b>{u.name}</b><small>{a.reason}</small>{a.ok&&<span>BOOK</span>}</button>})}</section>

    <section className="calendar"><div className="head"><div>House</div>{dates.map(d=><div key={key(d)}><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)}</small></div>)}</div>{units.map((u,i)=><div className="row" key={u.id}><div className="unit"><i style={{background:palette[i%palette.length]}}/><b>{u.name}</b><small>Cap {capacity(u)}</small></div>{dates.map(d=>{const d1=key(d),d2=key(add(d,1));const r=reservations.find(r=>r.unit_id===u.id&&blocksInventory(r.status)&&overlaps(r.check_in,r.check_out,d1,d2));const bl=data.blocks.find(b=>b.unit_id===u.id&&overlaps(b.start_date,b.end_date,d1,d2));return <button key={d1} className={bl?'block':r?'busy':'free'} onClick={()=>r?openEdit(r):!bl&&openNew(u.id,d1)}>{r&&r.check_in===d1?<span>{r.guest.split(' ')[0]}</span>:bl&&bl.start_date===d1?<span>BLOCK</span>:''}</button>})}</div>)}</section>

    <section className="list"><h2>Persistent reservations</h2>{reservations.map(r=><button key={r.id} className={r.status==='cancelled'?'cancelled':''} onClick={()=>openEdit(r)}><b>{r.guest}</b><span>{units.find(u=>u.id===r.unit_id)?.name}</span><span>{r.check_in} → {r.check_out}</span><span>{r.status}</span><strong>€{Number(r.total_amount??0)}</strong></button>)}</section>

    {editor&&<div className="shade"><aside><button className="x" onClick={()=>setEditor(null)}><X/></button><small>{editor.id?'EDIT PERSISTENT RESERVATION':'NEW PERSISTENT RESERVATION'}</small><h2>{editor.id?'Modify booking':'Create booking'}</h2><label>Guest<input value={editor.guest} onChange={e=>setEditor({...editor,guest:e.target.value})}/></label><label>House<select value={editor.unit_id} onChange={e=>setEditor({...editor,unit_id:e.target.value})}>{units.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></label><div className="two"><label>Check-in<input type="date" value={editor.check_in} onChange={e=>setEditor({...editor,check_in:e.target.value})}/></label><label>Check-out<input type="date" value={editor.check_out} onChange={e=>setEditor({...editor,check_out:e.target.value})}/></label></div><div className="two"><label>Guests<select value={editor.guest_count} onChange={e=>setEditor({...editor,guest_count:Number(e.target.value)})}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label><label>Status<select value={editor.status} onChange={e=>setEditor({...editor,status:e.target.value as Status})}>{['inquiry','hold','pending','confirmed','checked_in','checked_out','cancelled','no_show'].map(s=><option key={s}>{s}</option>)}</select></label></div><div className="two"><label>Source<select value={editor.source_id??''} onChange={e=>setEditor({...editor,source_id:e.target.value?Number(e.target.value):null})}>{data.sources.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>Value €<input type="number" value={editor.total_amount} onChange={e=>setEditor({...editor,total_amount:Number(e.target.value)})}/></label></div><div className="modalActions"><button className="save" onClick={()=>void save()}><Save size={15}/> Save to Demo DB</button>{editor.id&&editor.status!=='cancelled'&&<button className="danger" onClick={()=>{const r=reservations.find(x=>x.id===editor.id);if(r)void cancel(r)}}>Cancel booking</button>}</div></aside></div>}

    <style jsx>{`
      :global(html){background:#f2f4ef}:global(body){margin:0;background:#f2f4ef;color:#193327}:global(*){box-sizing:border-box}.app{min-height:100vh;padding:24px;font-family:Inter,Arial,sans-serif}.app>header{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:14px}.app>header span{font-size:10px;letter-spacing:.15em;color:#68786e;font-weight:800}.app h1{font-family:Georgia,serif;font-size:42px;margin:4px 0}.app header p{margin:0;color:#6d786f}.actions{display:flex;gap:8px}.actions button,.controls input,.controls select{border:1px solid #d8ded8;background:#fff;border-radius:10px;padding:10px 12px}.actions button{display:flex;gap:7px;align-items:center}.notice{display:flex;gap:14px;align-items:center;background:#fff8dd;border:1px solid #ecd98b;border-radius:12px;padding:11px 14px;margin-bottom:10px}.notice span{font-size:12px}.controls{display:flex;gap:8px;align-items:center;background:#fff;border:1px solid #dce1dc;border-radius:14px;padding:10px;margin-bottom:10px}.controls b{margin-left:auto}.controls span{font-size:11px;color:#6e796f}.success,.error{padding:10px 13px;border-radius:10px;margin-bottom:10px}.success{background:#173f2d;color:white}.error{background:#fff0ee;color:#9a2d22;border:1px solid #e4b7b1;white-space:pre-wrap}.finder{display:grid;grid-template-columns:1.2fr repeat(5,1fr);gap:8px;margin-bottom:12px}.finder>div,.finder>button{min-height:74px;border-radius:12px;border:1px solid #dce1dc;background:#fff;padding:10px;text-align:left}.finder>div{display:flex;flex-direction:column;justify-content:center}.finder button{display:grid;grid-template-columns:auto 1fr;gap:4px 8px}.finder i,.unit i{width:9px;height:9px;border-radius:50%;display:inline-block}.finder small{grid-column:2;font-size:10px;color:#6e796f}.finder span{grid-column:2;font-size:9px;font-weight:800}.finder .ok{border-color:#9bc0a6;background:#f3faf5}.finder .no{opacity:.58;cursor:default}.calendar{background:#fff;border:1px solid #dce1dc;border-radius:16px;overflow:auto;margin-bottom:14px}.head,.row{display:grid;grid-template-columns:150px repeat(${days},minmax(48px,1fr));min-width:${150+days*48}px}.head{background:#f8faf7}.head>div{padding:9px;text-align:center;border-right:1px solid #edf0ec}.head small{display:block;color:#7a847d}.unit{padding:12px;display:flex;gap:7px;align-items:center;border-top:1px solid #edf0ec}.unit small{margin-left:auto;color:#7a847d}.row>button{border:0;border-left:1px solid #edf0ec;border-top:1px solid #edf0ec;min-height:52px}.free{background:#fbfdfb}.busy{background:#e9f2eb}.block{background:repeating-linear-gradient(135deg,#ddd 0,#ddd 6px,#f3f3f3 6px,#f3f3f3 12px)}.busy span,.block span{font-size:9px}.list{background:#fff;border:1px solid #dce1dc;border-radius:16px;padding:14px}.list h2{font-family:Georgia,serif}.list>button{width:100%;display:grid;grid-template-columns:1.2fr 1fr 1.5fr 1fr .6fr;gap:10px;text-align:left;border:0;border-top:1px solid #edf0ec;background:#fff;padding:11px}.list .cancelled{opacity:.45}.shade{position:fixed;inset:0;background:rgba(10,25,18,.42);display:flex;justify-content:flex-end;z-index:50}.shade aside{width:min(520px,100%);height:100%;overflow:auto;background:#fff;padding:25px;position:relative}.x{position:absolute;right:18px;top:18px;border:0;background:#f0f2ef;border-radius:50%;padding:7px}.shade h2{font-family:Georgia,serif;font-size:30px}.shade label{display:flex;flex-direction:column;gap:5px;margin:11px 0;font-size:11px;font-weight:700}.shade input,.shade select{height:43px;border:1px solid #d9ded9;border-radius:9px;padding:0 10px;background:white}.two{display:grid;grid-template-columns:1fr 1fr;gap:9px}.modalActions{display:flex;gap:8px;margin-top:16px}.modalActions button{border:0;border-radius:10px;padding:12px 14px}.save{background:#173f2d;color:#fff;display:flex;gap:7px;align-items:center}.danger{background:#fff0ee;color:#a3382c}.app button{cursor:pointer}
      @media(max-width:900px){.finder{grid-template-columns:repeat(2,1fr)}.finder>div{grid-column:1/-1}.app>header{align-items:flex-start;flex-direction:column}.controls{overflow:auto}.controls b{margin-left:0;white-space:nowrap}.list>button{grid-template-columns:1fr 1fr}.head,.row{min-width:${150+days*48}px}}
    `}</style>
  </main>;
}
