'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Plus, Phone, X, ArrowRightLeft, ChevronLeft, ChevronRight } from 'lucide-react';

type Status = 'confirmed'|'checked_in'|'pending'|'hold'|'inquiry'|'cancelled';
type Unit = {id:string;name:string;capacity:number;color:string};
type Booking = {id:string;guest:string;unitId:string;checkIn:string;checkOut:string;guests:number;source:string;status:Status;amount:number};

const units:Unit[]=[
  {id:'ceviz',name:'Ceviz Ev',capacity:5,color:'#c89b62'},
  {id:'biberiye',name:'Biberiye Ev',capacity:5,color:'#7e9f7c'},
  {id:'nar',name:'Nar Ev',capacity:5,color:'#c9675a'},
  {id:'elma',name:'Elma Ev',capacity:5,color:'#8fa75e'},
  {id:'hurma',name:'Hurma Ev',capacity:5,color:'#a67556'},
];

const initial:Booking[]=[
  {id:'R-1042',guest:'Anna Müller',unitId:'ceviz',checkIn:'2026-08-18',checkOut:'2026-08-22',guests:3,source:'Airbnb',status:'checked_in',amount:580},
  {id:'R-1043',guest:'Mehmet Kaya',unitId:'biberiye',checkIn:'2026-08-19',checkOut:'2026-08-24',guests:4,source:'Direct',status:'confirmed',amount:690},
  {id:'R-1044',guest:'James Smith',unitId:'nar',checkIn:'2026-08-22',checkOut:'2026-08-26',guests:2,source:'Booking.com',status:'confirmed',amount:560},
  {id:'R-1045',guest:'Sofia Rossi',unitId:'elma',checkIn:'2026-08-24',checkOut:'2026-08-27',guests:2,source:'WhatsApp',status:'pending',amount:420},
  {id:'R-1046',guest:'Elif Demir',unitId:'hurma',checkIn:'2026-08-20',checkOut:'2026-08-23',guests:5,source:'Phone',status:'confirmed',amount:495},
];

const blocks=[{unitId:'elma',start:'2026-08-27',end:'2026-08-29',label:'Maintenance'}];
const parse=(s:string)=>new Date(`${s}T00:00:00`);
const key=(d:Date)=>d.toISOString().slice(0,10);
const add=(d:Date,n:number)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const overlaps=(a1:string,a2:string,b1:string,b2:string)=>parse(a1)<parse(b2)&&parse(a2)>parse(b1);
const blocking=(s:Status)=>['confirmed','checked_in','pending','hold'].includes(s);

export default function FunctionalManagerDemo(){
  const [bookings,setBookings]=useState(initial);
  const [start,setStart]=useState('2026-08-18');
  const [days,setDays]=useState(14);
  const [guests,setGuests]=useState(2);
  const [selected,setSelected]=useState<Booking|null>(null);
  const [editor,setEditor]=useState<Booking|null>(null);
  const [mode,setMode]=useState<'new'|'edit'|null>(null);
  const [message,setMessage]=useState('');
  const dates=useMemo(()=>Array.from({length:days},(_,i)=>add(parse(start),i)),[start,days]);
  const end=key(add(parse(start),days));

  const availability=(unit:Unit,ci=start,co=end,g=guests,ignoreId?:string)=>{
    if(g>unit.capacity)return {ok:false,reason:'Capacity exceeded'};
    if(blocks.some(b=>b.unitId===unit.id&&overlaps(b.start,b.end,ci,co)))return {ok:false,reason:'Blocked / maintenance'};
    const conflict=bookings.find(b=>b.id!==ignoreId&&b.unitId===unit.id&&blocking(b.status)&&overlaps(b.checkIn,b.checkOut,ci,co));
    return conflict?{ok:false,reason:`Conflict ${conflict.id}`}:{ok:true,reason:'Available'};
  };

  const openNew=(unitId=units.find(u=>availability(u).ok)?.id||'ceviz')=>{
    setEditor({id:'',guest:'',unitId,checkIn:start,checkOut:key(add(parse(start),Math.min(3,days))),guests,source:'Phone',status:'confirmed',amount:0});
    setMode('new'); setMessage('');
  };
  const openEdit=(b:Booking)=>{setEditor({...b});setMode('edit');setMessage('');};
  const save=()=>{
    if(!editor)return;
    if(!editor.guest.trim()){setMessage('Guest name is required.');return;}
    if(parse(editor.checkOut)<=parse(editor.checkIn)){setMessage('Check-out must be after check-in.');return;}
    const u=units.find(x=>x.id===editor.unitId)!;
    const a=availability(u,editor.checkIn,editor.checkOut,editor.guests,mode==='edit'?editor.id:undefined);
    if(blocking(editor.status)&&!a.ok){setMessage(a.reason);return;}
    if(mode==='new'){
      const next=`R-${Math.max(...bookings.map(b=>Number(b.id.split('-')[1])))+1}`;
      setBookings(v=>[...v,{...editor,id:next}]);
      setMessage(`Created ${next}`);
    } else {
      setBookings(v=>v.map(b=>b.id===editor.id?editor:b));
      setSelected(editor);
      setMessage(`Updated ${editor.id}`);
    }
    setMode(null); setEditor(null);
  };
  const cancel=(b:Booking)=>{
    const next={...b,status:'cancelled' as Status};
    setBookings(v=>v.map(x=>x.id===b.id?next:x)); setSelected(next); setMessage(`${b.id} cancelled; inventory released.`);
  };
  const shift=(delta:number)=>setStart(key(add(parse(start),delta)));
  const occ=dates.map(d=>{const d1=key(d),d2=key(add(d,1));return Math.round(100*units.filter(u=>bookings.some(b=>b.unitId===u.id&&blocking(b.status)&&overlaps(b.checkIn,b.checkOut,d1,d2))).length/units.length)});
  const avg=Math.round(occ.reduce((a,b)=>a+b,0)/Math.max(1,occ.length));

  return <main className="app">
    <header><div><span>PINAR EVLERİ · FUNCTIONAL DEMO</span><h1>Manager Booking Control</h1><p>All booking buttons on this page mutate synchronized demo state. Refresh resets the dataset.</p></div><div className="actions"><button onClick={()=>openNew()}><Plus size={16}/> New booking</button><button onClick={()=>setDays(days===7?14:7)}><Phone size={16}/> Phone view</button></div></header>

    <section className="controls"><button onClick={()=>shift(-days)}><ChevronLeft size={16}/></button><input type="date" value={start} onChange={e=>setStart(e.target.value)}/><button onClick={()=>shift(days)}><ChevronRight size={16}/></button><select value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select><select value={guests} onChange={e=>setGuests(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} guests</option>)}</select><b>Occupancy {avg}%</b></section>

    {message&&<div className="toast">{message}<button onClick={()=>setMessage('')}>×</button></div>}

    <section className="finder"><div><CalendarDays size={18}/><b>{start} → {end}</b><span>{guests} guests</span></div>{units.map(u=>{const a=availability(u);return <button key={u.id} className={a.ok?'ok':'no'} onClick={()=>a.ok&&openNew(u.id)}><i style={{background:u.color}}/><b>{u.name}</b><small>{a.reason}</small>{a.ok&&<span>BOOK</span>}</button>})}</section>

    <section className="calendar"><div className="head"><div>House</div>{dates.map(d=><div key={key(d)}><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)}</small></div>)}</div>{units.map(u=><div className="row" key={u.id}><div className="unit"><i style={{background:u.color}}/><b>{u.name}</b><small>Cap {u.capacity}</small></div>{dates.map(d=>{const d1=key(d),d2=key(add(d,1));const b=bookings.find(x=>x.unitId===u.id&&blocking(x.status)&&overlaps(x.checkIn,x.checkOut,d1,d2));const bl=blocks.find(x=>x.unitId===u.id&&overlaps(x.start,x.end,d1,d2));return <button key={d1} className={bl?'block':b?'busy':'free'} onClick={()=>b?setSelected(b):!bl&&openNew(u.id)}>{b&&b.checkIn===d1?<span>{b.guest.split(' ')[0]}</span>:bl&&bl.start===d1?<span>BLOCK</span>:''}</button>})}</div>)}</section>

    <section className="list"><h2>Reservations</h2>{bookings.map(b=><button key={b.id} className={b.status==='cancelled'?'cancelled':''} onClick={()=>setSelected(b)}><b>{b.id}</b><span>{b.guest}</span><span>{units.find(u=>u.id===b.unitId)?.name}</span><span>{b.checkIn} → {b.checkOut}</span><span>{b.status}</span><strong>€{b.amount}</strong></button>)}</section>

    {selected&&<div className="shade" onClick={()=>setSelected(null)}><aside onClick={e=>e.stopPropagation()}><button className="x" onClick={()=>setSelected(null)}><X/></button><small>{selected.id}</small><h2>{selected.guest}</h2><p>{units.find(u=>u.id===selected.unitId)?.name} · {selected.checkIn} → {selected.checkOut} · {selected.guests} guests</p><div className="drawerBtns"><button onClick={()=>openEdit(selected)}>Edit booking</button><button onClick={()=>{const n={...selected,checkOut:key(add(parse(selected.checkOut),1))};setEditor(n);setMode('edit');}}>Extend +1 night</button><button onClick={()=>{const n={...selected,checkOut:key(add(parse(selected.checkOut),-1))};setEditor(n);setMode('edit');}}>Shorten -1 night</button><button onClick={()=>openEdit({...selected,unitId:units.find(u=>u.id!==selected.unitId&&availability(u,selected.checkIn,selected.checkOut,selected.guests,selected.id).ok)?.id||selected.unitId})}><ArrowRightLeft size={15}/> Move house</button><button className="danger" disabled={selected.status==='cancelled'} onClick={()=>cancel(selected)}>Cancel booking</button></div></aside></div>}

    {editor&&mode&&<div className="shade"><aside><button className="x" onClick={()=>{setEditor(null);setMode(null)}}><X/></button><small>{mode==='new'?'NEW RESERVATION':`EDIT ${editor.id}`}</small><h2>{mode==='new'?'Create booking':'Modify booking'}</h2><label>Guest<input value={editor.guest} onChange={e=>setEditor({...editor,guest:e.target.value})}/></label><label>House<select value={editor.unitId} onChange={e=>setEditor({...editor,unitId:e.target.value})}>{units.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></label><div className="two"><label>Check-in<input type="date" value={editor.checkIn} onChange={e=>setEditor({...editor,checkIn:e.target.value})}/></label><label>Check-out<input type="date" value={editor.checkOut} onChange={e=>setEditor({...editor,checkOut:e.target.value})}/></label></div><div className="two"><label>Guests<select value={editor.guests} onChange={e=>setEditor({...editor,guests:Number(e.target.value)})}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label><label>Status<select value={editor.status} onChange={e=>setEditor({...editor,status:e.target.value as Status})}>{['confirmed','checked_in','pending','hold','inquiry','cancelled'].map(s=><option key={s}>{s}</option>)}</select></label></div><div className="two"><label>Source<select value={editor.source} onChange={e=>setEditor({...editor,source:e.target.value})}>{['Direct','Airbnb','Booking.com','WhatsApp','Phone'].map(s=><option key={s}>{s}</option>)}</select></label><label>Value €<input type="number" value={editor.amount} onChange={e=>setEditor({...editor,amount:Number(e.target.value)})}/></label></div>{message&&<p className="error">{message}</p>}<button className="save" onClick={save}>{mode==='new'?'Create booking':'Save changes'}</button></aside></div>}

    <style jsx>{`
      :global(html){background:#f2f4ef}:global(body){margin:0;background:#f2f4ef;color:#193327}:global(*){box-sizing:border-box}.app{min-height:100vh;padding:24px;font-family:Inter,Arial,sans-serif}.app>header{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:16px}.app>header span{font-size:10px;letter-spacing:.15em;color:#68786e;font-weight:800}.app h1{font-family:Georgia,serif;font-size:42px;margin:4px 0}.app header p{margin:0;color:#6d786f}.actions{display:flex;gap:8px}button,input,select{font:inherit}button{cursor:pointer}.actions button,.controls button,.controls input,.controls select{border:1px solid #d8ded8;background:#fff;border-radius:10px;padding:10px 12px}.actions button{display:flex;align-items:center;gap:7px}.controls{display:flex;gap:8px;align-items:center;background:#fff;border:1px solid #dce1dc;border-radius:14px;padding:10px;margin-bottom:12px}.controls b{margin-left:auto}.toast{background:#183e2d;color:white;padding:10px 14px;border-radius:10px;margin-bottom:10px;display:flex;justify-content:space-between}.toast button{border:0;background:none;color:white;font-size:20px}.finder{display:grid;grid-template-columns:1.2fr repeat(5,1fr);gap:8px;margin-bottom:12px}.finder>div,.finder>button{min-height:74px;border-radius:12px;border:1px solid #dce1dc;background:#fff;padding:10px;text-align:left}.finder>div{display:flex;flex-direction:column;justify-content:center}.finder>div span{font-size:11px;color:#78847b}.finder button{display:grid;grid-template-columns:auto 1fr;gap:4px 8px}.finder i,.unit i{width:9px;height:9px;border-radius:50%;display:inline-block}.finder small{grid-column:2;font-size:10px;color:#6e796f}.finder span{grid-column:2;font-size:9px;font-weight:800}.finder .ok{border-color:#9bc0a6;background:#f3faf5}.finder .no{opacity:.58;cursor:default}.calendar{background:#fff;border:1px solid #dce1dc;border-radius:16px;overflow:auto;margin-bottom:14px}.head,.row{display:grid;grid-template-columns:150px repeat(${days},minmax(48px,1fr));min-width:${150+days*48}px}.head{background:#f8faf7}.head>div{padding:9px;text-align:center;border-right:1px solid #edf0ec}.head small{display:block;color:#7a847d}.unit{padding:12px;display:flex;gap:7px;align-items:center;border-top:1px solid #edf0ec}.unit small{margin-left:auto;color:#7a847d}.row>button{border:0;border-left:1px solid #edf0ec;border-top:1px solid #edf0ec;min-height:52px}.free{background:#fbfdfb}.busy{background:#e9f2eb}.block{background:repeating-linear-gradient(135deg,#ddd 0,#ddd 6px,#f3f3f3 6px,#f3f3f3 12px)}.row button span{font-size:9px;font-weight:700}.list{background:#fff;border:1px solid #dce1dc;border-radius:16px;padding:14px}.list h2{margin:0 0 8px;font-family:Georgia,serif}.list>button{width:100%;display:grid;grid-template-columns:90px 1fr 1fr 1.6fr 120px 90px;gap:10px;text-align:left;border:0;border-top:1px solid #edf0ec;background:white;padding:10px}.list .cancelled{text-decoration:line-through;opacity:.5}.shade{position:fixed;inset:0;background:rgba(9,24,17,.45);display:flex;justify-content:flex-end;z-index:100}.shade aside{width:min(440px,100%);height:100%;background:#fff;padding:24px;overflow:auto;position:relative}.x{position:absolute;right:16px;top:16px;border:0;background:none}.shade h2{font-family:Georgia,serif;font-size:32px}.drawerBtns{display:grid;gap:8px}.drawerBtns button,.save{padding:12px;border:1px solid #d9dfda;background:#f8faf8;border-radius:10px}.drawerBtns .danger{color:#9d2d2d}.shade label{display:flex;flex-direction:column;gap:5px;margin:10px 0;font-size:12px;color:#667269}.shade input,.shade select{height:42px;border:1px solid #d9dfda;border-radius:9px;padding:0 10px;background:#fff}.two{display:grid;grid-template-columns:1fr 1fr;gap:8px}.save{width:100%;background:#183e2d;color:white;margin-top:10px}.error{color:#9d2d2d;background:#fff0f0;padding:8px;border-radius:8px}@media(max-width:900px){.app{padding:12px}.app>header{align-items:start;flex-direction:column}.app h1{font-size:32px}.finder{grid-template-columns:1fr 1fr}.finder>div{grid-column:1/-1}.controls{overflow:auto}.controls b{white-space:nowrap}.list>button{grid-template-columns:70px 1fr 1fr}.list>button span:nth-of-type(n+3),.list>button strong{display:none}}@media(max-width:600px){.finder{grid-template-columns:1fr}.finder>div{grid-column:auto}.two{grid-template-columns:1fr}.actions{width:100%}.actions button{flex:1;justify-content:center}}
    `}</style>
  </main>
}