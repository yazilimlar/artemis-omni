'use client';

import Image from 'next/image';
import { ArrowUpRight, CalendarDays, Leaf, ShieldCheck } from 'lucide-react';
import type { PinarHouse } from '@/lib/pinarevleri/houses';

export default function HouseIdentityCard({ house }: { house: PinarHouse }) {
  return (
    <article id={`house-${house.id}`} className="card">
      <div className="photo"><Image src={house.image} alt={`${house.name} botanical house atmosphere`} fill sizes="(max-width:900px) 100vw, 38vw" /></div>
      <div className="body">
        <div className="meta"><span>{house.type}</span><span>{house.botanical}</span></div>
        <div className="botanical"><Leaf size={18}/>{house.englishName}</div>
        <h3>{house.name}</h3>
        <h4>{house.focus}</h4>
        <p>{house.vibe}</p>
        <div className="status">
          <span><CalendarDays size={15}/> Calendar integration prepared</span>
          <span><ShieldCheck size={15}/> Listing mapping pending owner verification</span>
        </div>
        {house.booking.airbnbUrl ? <a href={house.booking.airbnbUrl} target="_blank" rel="noreferrer">View listing <ArrowUpRight size={14}/></a> : <span className="pending">Direct listing link will appear after owner verification</span>}
      </div>
      <style jsx>{`
        .card{scroll-margin-top:90px;display:grid;grid-template-columns:.9fr 1.1fr;min-height:420px;border:1px solid rgba(255,255,255,.12);border-radius:26px;overflow:hidden;background:linear-gradient(150deg,rgba(255,255,255,.075),rgba(255,255,255,.018))}.photo{position:relative;min-height:420px}.photo :global(img){object-fit:cover}.body{padding:38px;display:flex;flex-direction:column;justify-content:center}.meta{display:flex;justify-content:space-between;font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.48}.botanical{display:flex;align-items:center;gap:7px;margin-top:48px;color:#dce9ac;font-size:10px;letter-spacing:.16em;text-transform:uppercase}.body h3{font-family:Georgia,serif;font-size:46px;font-weight:400;margin:10px 0 6px}.body h4{font-size:14px;line-height:1.55;font-weight:500;margin:0 0 14px;color:#f2eee4}.body p{font-size:13px;line-height:1.7;color:rgba(242,238,228,.64);margin:0}.status{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.status span,.pending{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:8px 10px;font-size:9px;color:rgba(242,238,228,.64)}.body a{margin-top:18px;display:inline-flex;align-items:center;gap:6px;color:#dce9ac;text-decoration:none;font-size:10px}.pending{margin-top:18px;align-self:flex-start;opacity:.7}@media(max-width:760px){.card{grid-template-columns:1fr}.photo{min-height:280px}.body{padding:26px}.body h3{font-size:38px}.botanical{margin-top:28px}}
      `}</style>
    </article>
  );
}
