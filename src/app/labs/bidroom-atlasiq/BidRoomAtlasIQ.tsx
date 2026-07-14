"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  FileCheck2,
  Filter,
  Layers3,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

const portals = [
  ["Federal", "Nationwide", "SAM.gov Contract Opportunities", "https://sam.gov/content/opportunities", "API / portal", "Federal solicitations and notices"],
  ["New York", "State", "NYS Contract Reporter", "https://www.nyscr.ny.gov/", "Portal", "State agencies and authorities"],
  ["New York", "NYC", "NYC City Record", "https://a856-cityrecord.nyc.gov/", "Open data / portal", "City notices, awards, addenda"],
  ["New York", "NYC", "PASSPort", "https://passport.cityofnewyork.us/", "Portal", "Solicitations and vendor actions"],
  ["New Jersey", "State", "NJSTART", "https://www.njstart.gov/bso/", "Portal", "State bids and vendor registration"],
  ["Pennsylvania", "State", "PA eMarketplace", "https://www.emarketplace.state.pa.us/", "Portal", "State solicitations and awards"],
  ["Connecticut", "State", "CTsource", "https://portal.ct.gov/das/ctsource", "Portal", "State procurement opportunities"],
  ["Massachusetts", "State", "COMMBUYS", "https://www.commbuys.com/bso/", "Portal", "Commonwealth and local bids"],
  ["Maryland", "State", "eMMA", "https://emma.maryland.gov/", "Portal", "State and local opportunities"],
  ["Virginia", "State", "eVA", "https://eva.virginia.gov/", "Portal", "Commonwealth procurement"],
  ["North Carolina", "State", "Interactive Purchasing System", "https://www.ips.state.nc.us/", "Portal", "State solicitations"],
  ["Georgia", "State", "Georgia Procurement Registry", "https://ssl.doas.state.ga.us/gpr/", "Portal", "State and local notices"],
  ["Florida", "State", "MyFloridaMarketPlace", "https://vendor.myfloridamarketplace.com/", "Portal", "State procurement"],
  ["Texas", "State", "Electronic State Business Daily", "https://www.txsmartbuy.com/esbd", "Portal", "State agency opportunities"],
  ["California", "State", "Cal eProcure", "https://caleprocure.ca.gov/", "Portal", "State contracts and bids"],
  ["Illinois", "State", "BidBuy", "https://www.bidbuy.illinois.gov/", "Portal", "State solicitations"],
  ["District of Columbia", "City", "DC Office of Contracting and Procurement", "https://contracts.ocp.dc.gov/", "Portal", "District solicitations"],
  ["Pennsylvania", "Philadelphia", "eContract Philly", "https://philawx.phila.gov/econtract/", "Portal", "City contracts"],
  ["Illinois", "Chicago", "Chicago Procurement Services", "https://www.chicago.gov/city/en/depts/dps.html", "Portal", "City bids and compliance"],
  ["Massachusetts", "Boston", "Boston Supplier Portal", "https://www.boston.gov/departments/procurement", "Portal", "City procurement"],
] as const;

const opportunities = [
  {title:"Bridge substructure rehabilitation and drilled foundation work",jurisdiction:"Federal",place:"Nationwide",agency:"Transportation owner",scope:["Foundation Piles","Concrete Demolition","Core Drilling"],bid:"IFB",permit:["Environmental","Lane closure"],qual:["Bonding","Past performance","DBE"],addenda:2,docs:["Specifications","Plans","Geotechnical report"],fit:94,confidence:76},
  {title:"Flood protection wall, waterproofing, and ground improvement",jurisdiction:"New York",place:"NYC",agency:"Capital agency",scope:["Waterproofing","Jet Grout","Foundation Piles"],bid:"Competitive sealed bid",permit:["NYC DOB","DEP discharge","Street opening"],qual:["M/WBE","Prevailing wage","Insurance"],addenda:4,docs:["Addenda","Bid schedule","Structural drawings"],fit:93,confidence:82},
  {title:"Transit station accessibility and structural opening package",jurisdiction:"New York",place:"NYC",agency:"Transit authority",scope:["Core Drilling","Concrete Demolition","Waterproofing"],bid:"Design-Build subcontract",permit:["Railroad protection","Night work"],qual:["Prequalification","Union labor","Safety record"],addenda:1,docs:["RFP","Reference drawings","Division 01"],fit:91,confidence:70},
  {title:"Wastewater facility concrete rehabilitation and leak remediation",jurisdiction:"New Jersey",place:"State",agency:"Water authority",scope:["Concrete Demolition","Waterproofing","Core Drilling"],bid:"Public works low bid",permit:["Confined space","Wastewater discharge"],qual:["Public works registration","Bonding","OSHA"],addenda:3,docs:["Technical specifications","Bid forms","Addendum log"],fit:89,confidence:74},
  {title:"Deep foundation and excavation support for public facility",jurisdiction:"Pennsylvania",place:"State",agency:"Public building authority",scope:["Foundation Piles","Jet Grout"],bid:"Prime construction",permit:["Building permit","Erosion control"],qual:["Prequalification","Bonding","Minority participation"],addenda:0,docs:["Geotechnical report","Pile schedule","General conditions"],fit:88,confidence:68},
  {title:"Tunnel water infiltration mitigation and injection grouting",jurisdiction:"Massachusetts",place:"State",agency:"Transit owner",scope:["Waterproofing","Jet Grout","Core Drilling"],bid:"RFP / best value",permit:["Transit access","Environmental"],qual:["Technical proposal","Past performance","Safety plan"],addenda:5,docs:["Scope of work","Addenda","Proposal instructions"],fit:87,confidence:79},
  {title:"Municipal garage selective demolition and membrane replacement",jurisdiction:"Illinois",place:"Chicago",agency:"City department",scope:["Concrete Demolition","Waterproofing"],bid:"Invitation for bids",permit:["Demolition permit","Dust control"],qual:["City vendor registration","M/WBE","Insurance"],addenda:2,docs:["Demolition drawings","Membrane details","Bid tab"],fit:84,confidence:66},
  {title:"Airport pavement penetrations and utility relocation support",jurisdiction:"Texas",place:"State",agency:"Airport owner",scope:["Core Drilling","Concrete Demolition"],bid:"Construction services IFB",permit:["Airside badging","FAA coordination"],qual:["Airport experience","Bonding","DBE"],addenda:1,docs:["Plans","Phasing requirements","Security requirements"],fit:81,confidence:64},
];

const filterValues = {
  scope:["All","Core Drilling","Concrete Demolition","Waterproofing","Jet Grout","Foundation Piles"],
  bid:["All","IFB","Competitive sealed bid","Public works low bid","RFP / best value","Design-Build subcontract","Prime construction","Invitation for bids","Construction services IFB"],
  qualification:["All","Bonding","Prequalification","M/WBE","DBE","Prevailing wage","Union labor","Past performance","Insurance"],
  permit:["All","Environmental","NYC DOB","Street opening","Building permit","Demolition permit","Railroad protection","Airside badging"],
};

const pipeline = [
  ["1", "Capture", "Preserve source files, URLs, timestamps and SHA-256 hashes."],
  ["2", "Classify", "Identify notice, addendum, drawing, specification, bid form and report types."],
  ["3", "Extract", "Create clause, sheet, quantity, permit, qualification and commercial-term records."],
  ["4", "Cross-link", "Connect drawings, specifications, bid items, addenda and controlling evidence."],
  ["5", "Verify", "Run specialist and adversarial model reviews before human approval."],
];

export default function BidRoomAtlasIQ(){
  const [q,setQ]=useState("");
  const [scope,setScope]=useState("All");
  const [state,setState]=useState("All");
  const [bid,setBid]=useState("All");
  const [qual,setQual]=useState("All");
  const [permit,setPermit]=useState("All");
  const [addenda,setAddenda]=useState(false);
  const [night,setNight]=useState(false);

  const states=["All",...Array.from(new Set(opportunities.map(o=>o.jurisdiction)))];
  const results=useMemo(()=>opportunities.filter(o=>{
    const hay=[o.title,o.agency,o.place,...o.scope,...o.qual,...o.permit,...o.docs].join(" ").toLowerCase();
    return (!q||hay.includes(q.toLowerCase()))&&(scope==="All"||o.scope.includes(scope))&&(state==="All"||o.jurisdiction===state)&&(bid==="All"||o.bid===bid)&&(qual==="All"||o.qual.includes(qual))&&(permit==="All"||o.permit.includes(permit))&&(!addenda||o.addenda>0);
  }),[q,scope,state,bid,qual,permit,addenda]);

  const page = night ? "bg-[#071426] text-[#f8f5ec]" : "bg-[#f4f7f9] text-[#102033]";
  const panel = night ? "border-[#31506d] bg-[#0d2035] text-[#f8f5ec]" : "border-[#17324d] bg-white text-[#102033]";
  const soft = night ? "border-[#31506d] bg-[#122b47]" : "border-[#b8c8d6] bg-[#eaf1f5]";

  return <main className={`min-h-screen ${page}`}>
    <section className="border-b-4 border-[#ddb04e] bg-[#071426] text-white">
      <div className="mx-auto max-w-[1480px] px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#8de8ff]">Federated public-works opportunity intelligence</p>
            <h1 className="mt-3 text-4xl font-black sm:text-6xl">BidRoom AtlasIQ</h1>
            <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[#d9e4ec]">Evidence-linked search and document understanding for bids, drawings, specifications, terms, addenda, permits, qualifications and specialty-scope risk.</p>
          </div>
          <button onClick={()=>setNight(v=>!v)} className="inline-flex items-center gap-2 border-2 border-[#00cfff] bg-[#102b46] px-4 py-2 font-mono text-xs font-black uppercase text-white hover:bg-[#173a5d] focus:outline-none focus:ring-2 focus:ring-[#f2d06b]">
            {night?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}{night?"Day mode":"Night mode"}
          </button>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[["20","source portals"],["15","states / districts"],["5","specialty scopes"],["8","normalized opportunities"],["1","evidence schema"]].map(([n,l])=><div key={l} className="border border-[#52708f] bg-[#102b46] p-4"><div className="text-3xl font-black text-[#f2d06b]">{n}</div><div className="font-mono text-[.65rem] uppercase tracking-wide text-[#d9e4ec]">{l}</div></div>)}</div>
      </div>
    </section>

    <section className="mx-auto max-w-[1480px] px-5 py-7">
      <div className={`border-2 p-4 shadow-[4px_4px_0_#ddb04e] ${panel}`}>
        <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#007fa8]"><Sparkles className="h-4 w-4"/> Smart filters</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="relative xl:col-span-2"><Search className="absolute left-3 top-3 h-4 w-4 text-[#526477]"/><input value={q} onChange={e=>setQ(e.target.value)} className="w-full border-2 border-[#31506d] bg-white py-2.5 pl-10 pr-3 text-[#102033] placeholder:text-[#66788a] focus:border-[#00cfff] focus:outline-none focus:ring-2 focus:ring-[#00cfff]/30" placeholder="Search scope, specification term, permit, agency, qualification, or document"/></label>
          <Select label="Scope" value={scope} set={setScope} values={filterValues.scope}/><Select label="Jurisdiction" value={state} set={setState} values={states}/><Select label="Bid type" value={bid} set={setBid} values={filterValues.bid}/><Select label="Qualification" value={qual} set={setQual} values={filterValues.qualification}/><Select label="Permit" value={permit} set={setPermit} values={filterValues.permit}/>
          <label className={`flex min-h-11 items-center gap-2 border-2 px-3 text-sm font-semibold ${soft}`}><input type="checkbox" checked={addenda} onChange={e=>setAddenda(e.target.checked)} className="h-4 w-4 accent-[#007fa8]"/> Has addenda</label>
        </div>
      </div>

      <section className={`mt-6 border-2 p-5 ${panel}`}>
        <div className="flex items-center gap-2"><Layers3 className="h-5 w-5 text-[#007fa8]"/><h2 className="text-2xl font-black">AtlasIQ Evidence Engine</h2></div>
        <p className="mt-2 max-w-4xl text-sm opacity-80">The next processing layer converts a bid package into a traceable digital record rather than a single AI summary.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">{pipeline.map(([n,t,d])=><div key={n} className={`border-2 p-4 ${soft}`}><div className="font-mono text-xs font-black text-[#007fa8]">STEP {n}</div><h3 className="mt-2 font-black">{t}</h3><p className="mt-2 text-xs leading-relaxed opacity-80">{d}</p></div>)}</div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Status title="Document register" value="Ready for adapter integration"/>
          <Status title="Multi-model review" value="Structured schema defined"/>
          <Status title="Human approval gate" value="Required before confirmed status"/>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-black">Normalized opportunity records</h2><span className="font-mono text-xs font-bold text-[#007fa8]">{results.length} matches</span></div>
          <div className="grid gap-4 lg:grid-cols-2">{results.map(o=><article key={o.title} className={`border-2 p-5 shadow-[4px_4px_0_#17324d] ${panel}`}><div className="flex justify-between gap-3"><div><p className="font-mono text-[.65rem] font-bold uppercase text-[#526477]">{o.jurisdiction} · {o.place} · {o.agency}</p><h3 className="mt-2 text-lg font-black">{o.title}</h3></div><div className="h-fit border-2 border-[#087f5b] bg-[#e7f8f1] px-2 py-1 text-center text-[#075b43]"><b className="text-xl">{o.fit}</b><div className="font-mono text-[.55rem]">FIT</div></div></div><div className="mt-3 flex flex-wrap gap-1.5">{o.scope.map(s=><span key={s} className="border border-[#007fa8] bg-[#e3f7fc] px-2 py-1 font-mono text-[.62rem] font-bold text-[#006482]">{s}</span>)}</div><dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><Data k="Bid type" v={o.bid}/><Data k="Addenda" v={`${o.addenda} tracked`}/><Data k="Qualifications" v={o.qual.join(", ")}/><Data k="Permits / approvals" v={o.permit.join(", ")}/></dl><div className={`mt-3 border p-3 text-xs ${soft}`}><b>Documents understood:</b> {o.docs.join(" · ")}</div><div className="mt-3 font-mono text-[.65rem] text-[#526477]">Extraction confidence: {o.confidence}/100 · verify against controlling documents</div></article>)}</div>
        </div>
        <aside className="space-y-4"><div className="border-2 border-[#b58a20] bg-[#fff5c9] p-4 text-[#102033]"><div className="flex items-center gap-2 font-mono text-xs font-black uppercase"><Filter className="h-4 w-4"/> Canonical extraction schema</div><ul className="mt-3 space-y-2 text-sm">{["Notice identity, agency, jurisdiction, due date","Scope ontology and CSI / owner-language synonyms","Bid type, award basis, contract vehicle","Mandatory pre-bid meeting and site visit","Licenses, registrations, bonding, insurance","Permits, access approvals, environmental controls","Prevailing wage, union, M/WBE, DBE and local goals","Plans, specifications, bid schedule and quantities","Addendum version, changed clauses and due-date deltas","Commercial terms, retainage, damages and payment","Risk flags, exclusions, assumptions and confidence"].map(x=><li key={x}>• {x}</li>)}</ul></div><div className={`border-2 p-4 ${panel}`}><div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#087f5b]"><ShieldCheck className="h-4 w-4"/> Document intelligence rules</div><ol className="mt-3 space-y-2 text-sm"><li>1. Preserve original files and hashes.</li><li>2. Version every addendum and compare clauses.</li><li>3. Separate stated facts from inferred scope.</li><li>4. Attach page-level evidence to each field.</li><li>5. Never overwrite the controlling portal record.</li><li>6. Lower confidence when dates or eligibility conflict.</li></ol></div></aside>
      </div>

      <section className="mt-8 border-2 border-[#ddb04e] bg-[#071426] p-5 text-white"><h2 className="text-2xl font-black">Federated source registry</h2><p className="mt-2 max-w-3xl text-sm text-[#d9e4ec]">Discovery, retrieval, normalization and compliance interpretation remain separate so jurisdictions can be added systematically.</p><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{portals.map(p=><a key={p[2]} href={p[3]} target="_blank" rel="noreferrer" className="border border-[#52708f] bg-[#102b46] p-4 text-white hover:border-[#00cfff] hover:bg-[#173a5d] focus:outline-none focus:ring-2 focus:ring-[#f2d06b]"><div className="flex justify-between gap-2 font-bold">{p[2]}<ExternalLink className="h-4 w-4"/></div><div className="mt-1 font-mono text-[.65rem] uppercase text-[#8de8ff]">{p[0]} · {p[1]} · {p[4]}</div><p className="mt-2 text-xs text-[#d9e4ec]">{p[5]}</p></a>)}</div></section>
    </section>

    <footer className={`border-t-2 border-[#17324d] ${night?"bg-[#0d2035] text-[#d9e4ec]":"bg-white text-[#526477]"}`}><div className="mx-auto flex max-w-[1480px] gap-3 px-5 py-4 text-xs"><FileCheck2 className="h-4 w-4 shrink-0 text-[#087f5b]"/><p>Public-safe prototype. Official portals and controlling documents remain authoritative. Demonstration records illustrate the normalized evidence model.</p></div></footer>
  </main>
}

function Select({label,value,set,values}:{label:string,value:string,set:(v:string)=>void,values:readonly string[]}){return <label className="text-xs font-bold uppercase text-[#526477]">{label}<select value={value} onChange={e=>set(e.target.value)} className="mt-1 w-full border-2 border-[#31506d] bg-white p-2.5 text-sm normal-case text-[#102033] focus:border-[#00cfff] focus:outline-none focus:ring-2 focus:ring-[#00cfff]/30">{values.map(v=><option key={v}>{v}</option>)}</select></label>}
function Data({k,v}:{k:string,v:string}){return <div className="border border-[#b8c8d6] bg-[#eaf1f5] p-2 text-[#102033]"><dt className="font-mono uppercase text-[#526477]">{k}</dt><dd className="mt-1 font-semibold leading-snug">{v}</dd></div>}
function Status({title,value}:{title:string,value:string}){return <div className="border-2 border-[#31506d] bg-[#102b46] p-4 text-white"><div className="font-mono text-[.65rem] font-black uppercase text-[#8de8ff]">{title}</div><div className="mt-2 flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-[#f2d06b]"/>{value}</div></div>}
