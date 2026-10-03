'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Filter,
  Home,
  LayoutDashboard,
  ListFilter,
  MoveRight,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type Status = 'confirmed' | 'checked_in' | 'pending' | 'hold' | 'inquiry';
type ViewMode = 'timeline' | 'matrix' | 'table' | 'graph';

type Unit = {
  id: string;
  name: string;
  short: string;
  capacity: number;
  accent: string;
};

type Booking = {
  id: string;
  guest: string;
  unitId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  source: string;
  status: Status;
  amount: number;
};

const units: Unit[] = [
  { id: 'ceviz', name: 'Ceviz Ev', short: 'CEV', capacity: 5, accent: '#c89b62' },
  { id: 'biberiye', name: 'Biberiye Ev', short: 'BIB', capacity: 5, accent: '#7e9f7c' },
  { id: 'nar', name: 'Nar Ev', short: 'NAR', capacity: 5, accent: '#c9675a' },
  { id: 'elma', name: 'Elma Ev', short: 'ELM', capacity: 5, accent: '#8fa75e' },
  { id: 'hurma', name: 'Hurma Ev', short: 'HUR', capacity: 5, accent: '#a67556' },
];

const bookings: Booking[] = [
  { id: 'R-1042', guest: 'Anna Müller', unitId: 'ceviz', checkIn: '2026-08-18', checkOut: '2026-08-22', guests: 3, source: 'Airbnb', status: 'checked_in', amount: 580 },
  { id: 'R-1043', guest: 'Mehmet Kaya', unitId: 'biberiye', checkIn: '2026-08-19', checkOut: '2026-08-24', guests: 4, source: 'Direct', status: 'confirmed', amount: 690 },
  { id: 'R-1044', guest: 'James Smith', unitId: 'nar', checkIn: '2026-08-22', checkOut: '2026-08-26', guests: 2, source: 'Booking.com', status: 'confirmed', amount: 560 },
  { id: 'R-1045', guest: 'Sofia Rossi', unitId: 'elma', checkIn: '2026-08-24', checkOut: '2026-08-27', guests: 2, source: 'WhatsApp', status: 'pending', amount: 420 },
  { id: 'R-1046', guest: 'Elif Demir', unitId: 'hurma', checkIn: '2026-08-20', checkOut: '2026-08-23', guests: 5, source: 'Phone', status: 'confirmed', amount: 495 },
  { id: 'R-1047', guest: 'Lena Fischer', unitId: 'ceviz', checkIn: '2026-08-25', checkOut: '2026-08-28', guests: 2, source: 'Direct', status: 'hold', amount: 450 },
  { id: 'R-1048', guest: 'Omar Haddad', unitId: 'biberiye', checkIn: '2026-08-29', checkOut: '2026-09-02', guests: 4, source: 'Airbnb', status: 'confirmed', amount: 640 },
  { id: 'R-1049', guest: 'Claire Dubois', unitId: 'nar', checkIn: '2026-08-27', checkOut: '2026-08-31', guests: 2, source: 'Direct', status: 'confirmed', amount: 600 },
  { id: 'R-1050', guest: 'David Brown', unitId: 'elma', checkIn: '2026-08-30', checkOut: '2026-09-04', guests: 3, source: 'Booking.com', status: 'confirmed', amount: 775 },
  { id: 'R-1051', guest: 'Ayşe Yılmaz', unitId: 'hurma', checkIn: '2026-08-23', checkOut: '2026-08-25', guests: 2, source: 'WhatsApp', status: 'inquiry', amount: 300 },
];

const blocks = [
  { unitId: 'elma', start: '2026-08-27', end: '2026-08-29', label: 'Maintenance' },
  { unitId: 'hurma', start: '2026-09-03', end: '2026-09-05', label: 'Owner block' },
];

const dateKey = (d: Date) => d.toISOString().slice(0, 10);
const parseDate = (s: string) => new Date(`${s}T00:00:00`);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const nights = (a: string, b: string) => Math.max(0, Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86400000));
const overlaps = (a1: string, a2: string, b1: string, b2: string) => parseDate(a1) < parseDate(b2) && parseDate(a2) > parseDate(b1);

function statusColor(status: Status) {
  if (status === 'checked_in') return '#2f855a';
  if (status === 'confirmed') return '#4263a8';
  if (status === 'pending') return '#c07b26';
  if (status === 'hold') return '#8b5db5';
  return '#7b8793';
}

export default function PinarEvleriManagerPage() {
  const [view, setView] = useState<ViewMode>('timeline');
  const [rangeDays, setRangeDays] = useState(14);
  const [startDate, setStartDate] = useState('2026-08-18');
  const [guestCount, setGuestCount] = useState(2);
  const [unitFilter, setUnitFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [phoneMode, setPhoneMode] = useState(false);
  const [selected, setSelected] = useState<Booking | null>(null);

  const start = parseDate(startDate);
  const days = useMemo(() => Array.from({ length: rangeDays }, (_, i) => addDays(start, i)), [startDate, rangeDays]);
  const endDate = dateKey(addDays(start, rangeDays));

  const filteredUnits = useMemo(() => units.filter(u => unitFilter === 'all' || u.id === unitFilter), [unitFilter]);
  const filteredBookings = useMemo(() => bookings.filter(b => {
    const searchHit = !search || `${b.guest} ${b.id} ${b.source}`.toLowerCase().includes(search.toLowerCase());
    const unitHit = unitFilter === 'all' || b.unitId === unitFilter;
    const statusHit = statusFilter === 'all' || b.status === statusFilter;
    return searchHit && unitHit && statusHit && overlaps(b.checkIn, b.checkOut, startDate, endDate);
  }), [search, unitFilter, statusFilter, startDate, endDate]);

  const blockingStatuses: Status[] = ['confirmed', 'checked_in', 'pending', 'hold'];
  const occupancyByDay = days.map(d => {
    const key = dateKey(d);
    const next = dateKey(addDays(d, 1));
    const occupied = units.filter(u => bookings.some(b => b.unitId === u.id && blockingStatuses.includes(b.status) && overlaps(b.checkIn, b.checkOut, key, next))).length;
    return Math.round((occupied / units.length) * 100);
  });
  const occupancy = Math.round(occupancyByDay.reduce((a, b) => a + b, 0) / Math.max(1, occupancyByDay.length));
  const arrivals = bookings.filter(b => b.checkIn === startDate).length;
  const departures = bookings.filter(b => b.checkOut === startDate).length;
  const selectedRangeAvailability = units.filter(u => {
    const capOk = guestCount <= u.capacity;
    const bookingConflict = bookings.some(b => b.unitId === u.id && blockingStatuses.includes(b.status) && overlaps(b.checkIn, b.checkOut, startDate, endDate));
    const blockConflict = blocks.some(bl => bl.unitId === u.id && overlaps(bl.start, bl.end, startDate, endDate));
    return capOk && !bookingConflict && !blockConflict;
  });

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">PINAR EVLERİ · OPERATIONS MVP</div>
          <h1>Availability & Booking Control Center</h1>
        </div>
        <div className="topActions">
          <button className={phoneMode ? 'phone active' : 'phone'} onClick={() => setPhoneMode(v => !v)}><Phone size={17}/> Phone mode</button>
          <button className="primary"><Plus size={17}/> New booking</button>
        </div>
      </header>

      <section className="filters">
        <div className="filterGroup grow">
          <label>Search</label>
          <div className="searchbox"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Guest, reservation, source..."/></div>
        </div>
        <div className="filterGroup">
          <label>Start</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/>
        </div>
        <div className="filterGroup compact">
          <label>Guests</label>
          <select value={guestCount} onChange={e=>setGuestCount(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select>
        </div>
        <div className="filterGroup">
          <label>House</label>
          <select value={unitFilter} onChange={e=>setUnitFilter(e.target.value)}><option value="all">All houses</option>{units.map(u=><option value={u.id} key={u.id}>{u.name}</option>)}</select>
        </div>
        <div className="filterGroup">
          <label>Status</label>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="checked_in">Checked in</option><option value="pending">Pending</option><option value="hold">Hold</option><option value="inquiry">Inquiry</option></select>
        </div>
      </section>

      <section className="quickbar">
        <div className="presets"><span>Range</span>{[7,14,30].map(n=><button key={n} onClick={()=>setRangeDays(n)} className={rangeDays===n?'on':''}>{n}D</button>)}</div>
        <div className="viewtabs">
          <button className={view==='timeline'?'on':''} onClick={()=>setView('timeline')}><CalendarDays size={15}/> Timeline</button>
          <button className={view==='matrix'?'on':''} onClick={()=>setView('matrix')}><LayoutDashboard size={15}/> Matrix</button>
          <button className={view==='table'?'on':''} onClick={()=>setView('table')}><ListFilter size={15}/> Table</button>
          <button className={view==='graph'?'on':''} onClick={()=>setView('graph')}><SlidersHorizontal size={15}/> Graph</button>
        </div>
      </section>

      <section className="kpis">
        <article><span>Occupancy</span><b>{occupancy}%</b><small>{rangeDays}-day average</small></article>
        <article><span>Available now</span><b>{selectedRangeAvailability.length}/{units.length}</b><small>for {guestCount} guests</small></article>
        <article><span>Arrivals</span><b>{arrivals}</b><small>{startDate}</small></article>
        <article><span>Departures</span><b>{departures}</b><small>{startDate}</small></article>
        <article><span>Visible bookings</span><b>{filteredBookings.length}</b><small>after filters</small></article>
      </section>

      {phoneMode && <section className="phonePanel">
        <div><span className="mini">PHONE BOOKING MODE</span><h2>Answer availability in seconds.</h2><p>{startDate} → {endDate} · {guestCount} guests</p></div>
        <div className="phoneResults">{selectedRangeAvailability.length ? selectedRangeAvailability.map(u=><button key={u.id}><span style={{background:u.accent}} className="dot"/><b>{u.name}</b><small>Available · capacity {u.capacity}</small><MoveRight size={18}/></button>) : <div className="none">No unit is fully free for the whole selected range. Shorten the date range or inspect the calendar below.</div>}</div>
      </section>}

      <section className="workspace">
        <div className="mainCard">
          <div className="cardHead"><div><span className="mini">SYNCHRONIZED VIEW</span><h2>{view === 'timeline' ? 'House timeline' : view === 'matrix' ? 'Availability matrix' : view === 'table' ? 'Reservation table' : 'Occupancy pressure'}</h2></div><button className="quiet"><Filter size={15}/> Filters active</button></div>

          {view === 'timeline' && <div className="timeline">
            <div className="timelineHead"><div className="unitLabel">House</div>{days.map(d=><div className="dayHead" key={dateKey(d)}><b>{d.getDate()}</b><span>{d.toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)}</span></div>)}</div>
            {filteredUnits.map(u=><div className="timelineRow" key={u.id}>
              <div className="unitLabel"><span className="houseDot" style={{background:u.accent}}/><div><b>{u.name}</b><small>Cap. {u.capacity}</small></div></div>
              <div className="cells">{days.map(d=>{
                const key=dateKey(d); const next=dateKey(addDays(d,1));
                const booking=bookings.find(b=>b.unitId===u.id&&blockingStatuses.includes(b.status)&&overlaps(b.checkIn,b.checkOut,key,next));
                const block=blocks.find(bl=>bl.unitId===u.id&&overlaps(bl.start,bl.end,key,next));
                return <div className={`cell ${booking?'occupied':''} ${block?'blocked':''}`} key={key} title={block?.label||booking?.guest||'Available'}>{booking&&booking.checkIn===key&&<button onClick={()=>setSelected(booking)} style={{background:statusColor(booking.status)}} className="bookingBar"><b>{booking.guest}</b><span>{booking.source}</span></button>}{block&&block.start===key&&<span className="blockLabel">{block.label}</span>}</div>
              })}</div>
            </div>)}
          </div>}

          {view === 'matrix' && <div className="matrixWrap"><table className="matrix"><thead><tr><th>House</th>{days.map(d=><th key={dateKey(d)}>{d.getDate()}<small>{d.toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)}</small></th>)}</tr></thead><tbody>{filteredUnits.map(u=><tr key={u.id}><td><span className="houseDot" style={{background:u.accent}}/>{u.name}</td>{days.map(d=>{const key=dateKey(d);const next=dateKey(addDays(d,1));const booking=bookings.find(b=>b.unitId===u.id&&blockingStatuses.includes(b.status)&&overlaps(b.checkIn,b.checkOut,key,next));const block=blocks.find(bl=>bl.unitId===u.id&&overlaps(bl.start,bl.end,key,next));return <td key={key} className={block?'mBlock':booking?'mOcc':'mFree'}>{block?'BLOCK':booking?'OCC':'FREE'}</td>})}</tr>)}</tbody></table></div>}

          {view === 'table' && <div className="tableWrap"><table className="bookTable"><thead><tr><th>Reservation</th><th>Guest</th><th>House</th><th>Stay</th><th>Guests</th><th>Source</th><th>Status</th><th>Value</th></tr></thead><tbody>{filteredBookings.map(b=>{const u=units.find(x=>x.id===b.unitId)!;return <tr key={b.id} onClick={()=>setSelected(b)}><td>{b.id}</td><td><b>{b.guest}</b></td><td><span className="houseDot" style={{background:u.accent}}/>{u.name}</td><td>{b.checkIn.slice(5)} → {b.checkOut.slice(5)}<small>{nights(b.checkIn,b.checkOut)} nights</small></td><td>{b.guests}</td><td>{b.source}</td><td><span className="status" style={{background:statusColor(b.status)}}>{b.status.replace('_',' ')}</span></td><td>€{b.amount}</td></tr>})}</tbody></table></div>}

          {view === 'graph' && <div className="graphWrap"><div className="graph"><div className="axis">100%</div>{occupancyByDay.map((v,i)=><div className="barCol" key={i}><div className="bar" style={{height:`${Math.max(5,v)}%`}}><span>{v}%</span></div><small>{days[i].getDate()}</small></div>)}</div><div className="graphLegend"><span><i className="g1"/>Occupancy %</span><span>Use this view to spot compressed dates and weak gaps quickly.</span></div></div>}
        </div>

        <aside className="sideCard">
          <div className="sideHead"><span className="mini">SELECTED RANGE</span><h3>Availability finder</h3></div>
          <div className="rangeSummary"><CalendarDays size={18}/><div><b>{startDate}</b><span>to {endDate}</span></div></div>
          <div className="rangeSummary"><Users size={18}/><div><b>{guestCount} guests</b><span>capacity filter</span></div></div>
          <div className="availableList">{units.map(u=>{const capOk=guestCount<=u.capacity;const bookingConflict=bookings.some(b=>b.unitId===u.id&&blockingStatuses.includes(b.status)&&overlaps(b.checkIn,b.checkOut,startDate,endDate));const blockConflict=blocks.some(bl=>bl.unitId===u.id&&overlaps(bl.start,bl.end,startDate,endDate));const ok=capOk&&!bookingConflict&&!blockConflict;return <button key={u.id} className={ok?'avail':'unavail'}><span className="houseDot" style={{background:u.accent}}/><div><b>{u.name}</b><small>{!capOk?'Too many guests':blockConflict?'Blocked':bookingConflict?'Booking conflict':'Available'}</small></div><span>{ok?'FREE':'×'}</span></button>})}</div>
          <div className="tip"><Sparkles size={16}/><p>All panels use the same date, guest and house filters. Changing one control should update every view consistently.</p></div>
        </aside>
      </section>

      <section className="lowerGrid">
        <article className="miniCard"><div className="miniHead"><Clock3 size={17}/><b>Today movements</b></div><div className="movement"><span>Arrivals</span>{bookings.filter(b=>b.checkIn===startDate).map(b=><button key={b.id} onClick={()=>setSelected(b)}><b>{b.guest}</b><small>{units.find(u=>u.id===b.unitId)?.name}</small></button>)}{!arrivals&&<small>No arrivals</small>}</div><div className="movement"><span>Departures</span>{bookings.filter(b=>b.checkOut===startDate).map(b=><button key={b.id} onClick={()=>setSelected(b)}><b>{b.guest}</b><small>{units.find(u=>u.id===b.unitId)?.name}</small></button>)}{!departures&&<small>No departures</small>}</div></article>
        <article className="miniCard"><div className="miniHead"><ArrowLeftRight size={17}/><b>Recent booking changes</b></div><ul className="changes"><li><b>R-1047</b><span>Hold created · Ceviz Ev · 25–28 Aug</span><small>10 min ago</small></li><li><b>R-1045</b><span>Guest count 1 → 2</span><small>28 min ago</small></li><li><b>R-1043</b><span>Direct booking confirmed</span><small>42 min ago</small></li></ul></article>
      </section>

      {selected && <div className="drawerBackdrop" onClick={()=>setSelected(null)}><aside className="drawer" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}><X/></button><span className="mini">RESERVATION {selected.id}</span><h2>{selected.guest}</h2><div className="drawerStats"><div><span>House</span><b>{units.find(u=>u.id===selected.unitId)?.name}</b></div><div><span>Stay</span><b>{selected.checkIn} → {selected.checkOut}</b></div><div><span>Guests</span><b>{selected.guests}</b></div><div><span>Source</span><b>{selected.source}</b></div><div><span>Status</span><b>{selected.status.replace('_',' ')}</b></div><div><span>Value</span><b>€{selected.amount}</b></div></div><div className="drawerActions"><button>Change dates</button><button>Change house</button><button>Guest count</button><button>Extend stay</button><button>Shorten stay</button><button className="danger">Cancel booking</button></div><div className="history"><b>Change history</b><p>Created · {selected.source}</p><p>Last synchronized · demo dataset</p></div></aside></div>}

      <style jsx>{`
        :global(html){background:#f4f5f0}:global(body){margin:0;background:#f4f5f0;color:#1c241f}:global(*){box-sizing:border-box}
        .shell{min-height:100vh;padding:26px;font-family:Inter,Arial,Helvetica,sans-serif;background:radial-gradient(circle at 10% 0%,#fff 0,#f4f5f0 40%,#eef0e9 100%);--green:#153d2d;--line:#dfe3da;--muted:#758078;--card:#fff}
        button,input,select{font:inherit}.topbar{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:22px}.eyebrow,.mini{font-size:10px;letter-spacing:.18em;font-weight:800;color:#6c7b71}.topbar h1{margin:6px 0 0;font-family:Georgia,serif;font-size:clamp(30px,4vw,48px);font-weight:500;letter-spacing:-.035em;color:#173427}.topActions{display:flex;gap:10px}.topActions button,.quickbar button,.quiet{border:1px solid var(--line);background:white;border-radius:12px;padding:11px 14px;display:flex;align-items:center;gap:8px;cursor:pointer}.primary{background:var(--green)!important;color:#fff;border-color:var(--green)!important}.phone.active{background:#e8f2eb;border-color:#8db79b;color:#1e5b3d}
        .filters{display:grid;grid-template-columns:minmax(220px,1.7fr) repeat(4,minmax(120px,.7fr));gap:10px;background:rgba(255,255,255,.82);border:1px solid var(--line);padding:14px;border-radius:18px;box-shadow:0 10px 30px rgba(30,50,38,.05)}.filterGroup{display:flex;flex-direction:column;gap:6px}.filterGroup label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:700}.filterGroup input,.filterGroup select,.searchbox{height:42px;border:1px solid #dfe3dd;border-radius:10px;background:#fbfcfa;padding:0 11px;color:#27312b}.searchbox{display:flex;align-items:center;gap:8px}.searchbox input{border:0;background:transparent;height:100%;width:100%;outline:0;padding:0}
        .quickbar{display:flex;justify-content:space-between;align-items:center;margin:14px 0}.presets,.viewtabs{display:flex;gap:6px;align-items:center}.presets span{font-size:11px;color:var(--muted);margin-right:4px}.quickbar button{padding:8px 11px;font-size:12px}.quickbar button.on{background:#1d4432;color:white;border-color:#1d4432}
        .kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px}.kpis article{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:17px;box-shadow:0 8px 22px rgba(30,50,38,.035)}.kpis span,.kpis small{display:block;color:var(--muted);font-size:11px}.kpis b{display:block;font-size:27px;margin:6px 0;color:#173427}
        .phonePanel{display:grid;grid-template-columns:.7fr 1.3fr;gap:20px;background:#173d2d;color:white;border-radius:18px;padding:20px;margin-bottom:14px}.phonePanel .mini{color:#bdd0c3}.phonePanel h2{font-family:Georgia,serif;font-weight:500;margin:5px 0;font-size:28px}.phonePanel p{margin:0;color:#d5dfd9}.phoneResults{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.phoneResults button{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:9px;text-align:left;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);color:white}.phoneResults small{display:block;color:#c5d4ca}.dot,.houseDot{width:9px;height:9px;border-radius:50%;display:inline-block}.none{padding:14px;background:rgba(255,255,255,.08);border-radius:12px}
        .workspace{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:14px}.mainCard,.sideCard,.miniCard{background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:0 8px 25px rgba(28,45,34,.035)}.mainCard{overflow:hidden}.cardHead{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--line)}.cardHead h2{margin:3px 0 0;font-family:Georgia,serif;font-weight:500;font-size:25px}.quiet{padding:8px 10px;font-size:11px}
        .timeline{overflow:auto}.timelineHead,.timelineRow{display:grid;grid-template-columns:160px minmax(760px,1fr)}.timelineHead{position:sticky;top:0;background:#fafbf8;z-index:2;border-bottom:1px solid var(--line)}.timelineHead>div:not(.unitLabel){min-width:54px}.timelineHead{grid-template-columns:160px repeat(${rangeDays},minmax(54px,1fr))}.dayHead{padding:9px 4px;text-align:center;border-left:1px solid #edf0eb}.dayHead b,.dayHead span{display:block}.dayHead span{font-size:9px;color:var(--muted)}.unitLabel{padding:11px 12px;display:flex;align-items:center;gap:8px;border-right:1px solid var(--line);min-height:58px}.unitLabel b,.unitLabel small{display:block}.unitLabel b{font-size:12px}.unitLabel small{font-size:10px;color:var(--muted)}.cells{display:grid;grid-template-columns:repeat(${rangeDays},minmax(54px,1fr));min-width:760px}.cell{position:relative;min-height:58px;border-left:1px solid #edf0eb;border-bottom:1px solid #edf0eb;background:#fcfdfa}.cell.occupied{background:#f7f9f6}.cell.blocked{background:repeating-linear-gradient(135deg,#ececea,#ececea 6px,#f7f7f5 6px,#f7f7f5 12px)}.bookingBar{position:absolute;z-index:3;left:3px;top:8px;width:118px;min-height:40px;border:0;border-radius:9px;padding:5px 7px;color:white;text-align:left;box-shadow:0 5px 12px rgba(0,0,0,.12);cursor:pointer}.bookingBar b,.bookingBar span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bookingBar b{font-size:10px}.bookingBar span{font-size:8px;opacity:.85}.blockLabel{position:absolute;left:5px;top:19px;font-size:9px;font-weight:700;color:#64645f;white-space:nowrap}
        .sideCard{padding:18px}.sideHead h3{font-family:Georgia,serif;font-size:24px;font-weight:500;margin:4px 0 14px}.rangeSummary{display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}.rangeSummary b,.rangeSummary span{display:block}.rangeSummary span{font-size:10px;color:var(--muted)}.availableList{display:grid;gap:7px;margin-top:10px}.availableList button{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;text-align:left;border:1px solid var(--line);border-radius:11px;background:#fafbf9;padding:9px}.availableList b,.availableList small{display:block}.availableList b{font-size:11px}.availableList small{font-size:9px;color:var(--muted)}.availableList .avail{border-color:#b9d6c2;background:#f4faf6}.availableList .avail>span:last-child{color:#2f855a;font-size:9px;font-weight:800}.availableList .unavail{opacity:.72}.tip{display:flex;gap:8px;margin-top:14px;padding:11px;border-radius:11px;background:#f1f4ec;color:#566159}.tip p{margin:0;font-size:10px;line-height:1.5}
        .matrixWrap,.tableWrap{overflow:auto}.matrix,.bookTable{border-collapse:collapse;width:100%;font-size:11px}.matrix th,.matrix td,.bookTable th,.bookTable td{padding:10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}.matrix th{background:#fafbf8;color:#677269}.matrix th small{display:block}.matrix td:not(:first-child){text-align:center;font-size:9px;font-weight:800}.mFree{background:#edf8f0;color:#2f855a}.mOcc{background:#faeeee;color:#b44848}.mBlock{background:#eeeef0;color:#6b6b72}.bookTable tr{cursor:pointer}.bookTable tr:hover{background:#f8faf7}.bookTable small{display:block;color:var(--muted)}.status{display:inline-block;padding:5px 7px;border-radius:999px;color:white;font-size:9px;text-transform:capitalize}
        .graphWrap{padding:28px}.graph{height:270px;display:flex;align-items:flex-end;gap:9px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);padding:20px 18px 0;position:relative}.axis{position:absolute;top:0;left:-5px;transform:translateX(-100%);font-size:9px;color:var(--muted)}.barCol{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:5px}.bar{width:72%;max-width:38px;background:linear-gradient(#4f8068,#1b4b36);border-radius:7px 7px 2px 2px;position:relative;min-height:5px}.bar span{position:absolute;top:-16px;width:100%;text-align:center;font-size:8px;color:#526058}.barCol small{font-size:9px;color:var(--muted)}.graphLegend{display:flex;justify-content:space-between;margin-top:14px;font-size:10px;color:var(--muted)}.graphLegend .g1{width:9px;height:9px;background:#2d654a;border-radius:3px;display:inline-block;margin-right:5px}
        .lowerGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.miniCard{padding:17px}.miniHead{display:flex;align-items:center;gap:8px;margin-bottom:12px}.movement{display:grid;grid-template-columns:90px repeat(3,1fr);gap:7px;align-items:center;padding:9px 0;border-top:1px solid var(--line)}.movement>span{font-size:10px;text-transform:uppercase;color:var(--muted)}.movement button{border:1px solid var(--line);border-radius:9px;background:#fafbf9;padding:8px;text-align:left}.movement button b,.movement button small{display:block}.movement button b{font-size:10px}.movement button small{font-size:9px;color:var(--muted)}.changes{list-style:none;margin:0;padding:0}.changes li{display:grid;grid-template-columns:65px 1fr auto;gap:8px;padding:10px 0;border-top:1px solid var(--line);font-size:10px}.changes small{color:var(--muted)}
        .drawerBackdrop{position:fixed;z-index:100;inset:0;background:rgba(16,25,20,.32);backdrop-filter:blur(3px);display:flex;justify-content:flex-end}.drawer{width:min(460px,94vw);height:100%;background:white;padding:28px;box-shadow:-20px 0 50px rgba(0,0,0,.15);position:relative;overflow:auto}.close{position:absolute;right:18px;top:18px;border:0;background:#f0f2ee;border-radius:50%;width:38px;height:38px}.drawer h2{font-family:Georgia,serif;font-size:34px;font-weight:500;margin:7px 0 20px}.drawerStats{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}.drawerStats div{padding:13px 0;border-bottom:1px solid var(--line)}.drawerStats span,.drawerStats b{display:block}.drawerStats span{font-size:9px;color:var(--muted);text-transform:uppercase}.drawerStats b{font-size:11px;margin-top:4px}.drawerActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}.drawerActions button{padding:11px;border-radius:10px;border:1px solid var(--line);background:#fafbf9;text-align:left}.drawerActions .danger{color:#a23f3f;background:#fff6f6}.history{margin-top:20px;padding:14px;background:#f7f8f5;border-radius:12px}.history p{font-size:10px;color:#657168;margin:8px 0}
        @media(max-width:1050px){.filters{grid-template-columns:1.5fr repeat(2,1fr)}.kpis{grid-template-columns:repeat(3,1fr)}.workspace{grid-template-columns:1fr}.sideCard{display:grid;grid-template-columns:1fr 1fr;gap:10px}.availableList{grid-column:1/-1}.tip{grid-column:1/-1}.phonePanel{grid-template-columns:1fr}.lowerGrid{grid-template-columns:1fr}}
        @media(max-width:720px){.shell{padding:12px}.topbar{align-items:flex-start;flex-direction:column}.topActions{width:100%}.topActions button{flex:1;justify-content:center}.filters{grid-template-columns:1fr 1fr}.filterGroup.grow{grid-column:1/-1}.quickbar{align-items:flex-start;gap:10px;flex-direction:column}.viewtabs{width:100%;overflow:auto}.kpis{grid-template-columns:repeat(2,1fr)}.kpis article:last-child{grid-column:1/-1}.phoneResults{grid-template-columns:1fr}.sideCard{display:block}.lowerGrid{grid-template-columns:1fr}.movement{grid-template-columns:80px 1fr}.drawerActions{grid-template-columns:1fr}.timelineHead,.timelineRow{grid-template-columns:115px minmax(760px,1fr)}.timelineHead{grid-template-columns:115px repeat(${rangeDays},minmax(54px,1fr))}.unitLabel{padding:8px}.topbar h1{font-size:34px}}
      `}</style>
    </main>
  );
}
