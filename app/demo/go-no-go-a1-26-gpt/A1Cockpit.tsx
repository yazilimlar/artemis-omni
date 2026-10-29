"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import A2Operations from "./A2Operations";
import {
  ArrowLeft, ArrowRight, Check, ChevronDown,
  CircleAlert, Clock3, Download, FileCheck2, Fingerprint,
  Gauge, Layers3, LockKeyhole, Pause, Play, Plus, RotateCcw,
  ShieldAlert, ShieldCheck, TimerReset, Workflow,
} from "lucide-react";

type Project = {
  id: string; name: string; package: string; lead: string; source: string;
  deadline: string | null; value: number | null; completed: boolean[];
  scores: (number | null)[]; notes: string[];
};
type Entry = {
  seq: number; atUtc: string; kind: string; projectId: string;
  message: string; previousHash: string; hash: string;
};
type Tab = "overview" | "operations" | "assessment" | "activity" | "protocol";

const gateNames = [
  "Invitation & identity verified",
  "Scope and estimating memo evidenced",
  "Risk and compliance review complete",
  "Five discipline reviews recorded",
  "Two executives + written parent approval",
];
const criteria = [
  "Relevant market experience", "Client relationship", "Influencer relationship",
  "Geographic proximity", "Qualified competition", "Trade partner relationships",
];
const initialProjects: Project[] = [
  { id: "A1-001", name: "Botanical Garden", package: "Mechanical opportunity · illustrative", lead: "Unassigned", source: "Demonstration fixture", deadline: null, value: null, completed: [false,false,false,false,false], scores: [null,null,null,null,null,null], notes: [] },
  { id: "A1-002", name: "350 Park", package: "Mechanical opportunity · illustrative", lead: "Unassigned", source: "Demonstration fixture", deadline: null, value: null, completed: [false,false,false,false,false], scores: [null,null,null,null,null,null], notes: [] },
  { id: "A1-003", name: "2 WTC", package: "Independent estimate · illustrative", lead: "Unassigned", source: "Demonstration fixture", deadline: null, value: null, completed: [false,false,false,false,false], scores: [null,null,null,null,null,null], notes: [] },
];

const surface = "rounded-2xl border border-[#283b58] bg-[#101e32]";
const field = "w-full rounded-lg border border-[#3b526e] bg-[#0a1626] px-3 py-2 text-sm text-[#e9f0f7] outline-none focus:border-[#e5b861] focus:ring-2 focus:ring-[#e5b861]/20";
const button = "inline-flex items-center justify-center gap-2 rounded-lg border border-[#4b6280] px-3.5 py-2 text-sm font-semibold transition-colors hover:border-[#e5b861] hover:text-[#e5b861] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b861] disabled:cursor-not-allowed disabled:opacity-35";

function formatDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}
function status(completed: boolean[]) {
  return completed.every(Boolean) ? "SIMULATED READY" : completed.some(Boolean) ? "IN REVIEW" : "INTAKE HOLD";
}
async function sha(text: string) {
  if (!globalThis.crypto?.subtle) throw new Error("Secure-context SHA-256 unavailable");
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256",bytes);
  return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,"0")).join("");
}

export default function A1Cockpit() {
  const [projects,setProjects] = useState<Project[]>(initialProjects);
  const [selected,setSelected] = useState("A1-001");
  const [tab,setTab] = useState<Tab>("overview");
  const [events,setEvents] = useState<Entry[]>([]);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [clock,setClock] = useState(0);
  const [running,setRunning] = useState<{projectId:string;task:string;start:number}|null>(null);
  const [task,setTask] = useState("Document and scope review");
  const [note,setNote] = useState("");
  const [viewDetail,setViewDetail] = useState(true);
  const project = projects.find(p=>p.id===selected) ?? projects[0];
  const scores = project.scores.filter((n):n is number=>n!==null);
  const score = scores.length===6 ? scores.reduce((a,b)=>a+b,0) : null;
  const completedGates = projects.reduce((s,p)=>s+p.completed.filter(Boolean).length,0);

  useEffect(()=>{ const i=setInterval(()=>setClock(Date.now()),1000);setClock(Date.now());return ()=>clearInterval(i); },[]);
  const append = useCallback(async (kind:string,projectId:string,description:string)=>{
    if (busy) return;
    setBusy(true);setMessage("");
    try {
      const last=events[events.length-1];const previousHash=last?.hash??"GENESIS";
      const record={seq:events.length+1,atUtc:new Date().toISOString(),kind,projectId,message:description,previousHash};
      const hash=await sha(JSON.stringify(record));
      setEvents(current=>[...current,{...record,hash}]);
    } catch {setMessage("Event not recorded: SHA-256 requires a secure browser context.");}
    finally {setBusy(false);}
  },[busy,events]);
  const updateProject=(change:(p:Project)=>Project)=>setProjects(current=>current.map(p=>p.id===selected?change(p):p));
  const toggleGate=async(index:number)=>{
    const next=!project.completed[index];
    if(index>0&&next&&!project.completed.slice(0,index).every(Boolean)){
      setMessage("Dependency gate held: complete every preceding gate first.");return;
    }
    updateProject(p=>({...p,completed:p.completed.map((v,i)=>i===index?next:i>index&&!next?false:v)}));
    await append("SIMULATED_GATE",selected,`${gateNames[index]}: ${next?"marked complete for demonstration":"reset with downstream gates invalidated"}. No actual approval.`);
  };
  const changeScore=async(index:number,value:string)=>{
    const newValue=value===""?null:Number(value);
    updateProject(p=>({...p,scores:p.scores.map((v,i)=>i===index?newValue:v)}));
    await append("SCORE_EDIT",selected,`${criteria[index]} set to ${newValue??"UNKNOWN"} (synthetic advisory input)`);
  };
  const toggleTimer=async()=>{
    if(running){
      const secs=Math.max(0,(Date.now()-running.start)/1000);
      await append("TIMER_STOP",running.projectId,`${running.task} · elapsed ${secs.toFixed(3)}s · demo device clock`);
      setRunning(null);
    }else{
      if(!task.trim())return;
      await append("TIMER_START",selected,task.trim());
      setRunning({projectId:selected,task:task.trim(),start:Date.now()});
    }
  };
  const saveNote=async()=>{
    if(!note.trim())return;
    await append("NOTE",selected,note.trim());
    updateProject(p=>({...p,notes:[...p.notes,note.trim()]}));setNote("");
  };
  const exportRecord=()=>{
    const data={schema:"artemis-wdf-a1-demo/1",label:"SYNTHETIC SESSION ONLY — NOT WDF DATA",generatedAtUtc:new Date().toISOString(),projects,events,limitations:["No server persistence","No user identity verification","Device clock not authoritative","No binding approvals"]};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;
    a.download="WDF_A1_GPT_SYNTHETIC_SESSION.json";a.click();URL.revokeObjectURL(url);
  };
  const reset=()=>{setProjects(initialProjects);setEvents([]);setRunning(null);setMessage("Demo reset. No prior event was stored on a server.");};
  const liveSeconds=running?Math.max(0,(clock-running.start)/1000):0;

  return <main className="min-h-screen bg-[#07111f] text-[#e9f0f7] selection:bg-[#e5b861] selection:text-[#07111f]">
    <div className="border-b border-[#273b54] bg-[#0b192b]">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-5 py-3">
        <Link href="/demo" className={button+" text-xs"}><ArrowLeft size={15}/> Demo Center</Link>
        <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#e5b861]">Artemis · Infrastructure Intelligence · GPT Edition</p><p className="text-sm text-[#aebfd2]">WDF Go / No-Go A1 · Decision & Estimating Cockpit</p></div>
        <span className="rounded-full border border-[#d8aa57]/50 bg-[#e5b861]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f2cb82]">Synthetic demo · No live WDF data</span>
      </div>
    </div>
    <div className="mx-auto max-w-[1600px] px-4 pb-14 pt-7 sm:px-6">
      <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#91a9c3]"><Layers3 size={14}/> A1 / Pilot Registry / 2026</p>
          <h1 className="max-w-[920px] text-3xl font-semibold tracking-tight sm:text-5xl">Bid decisions built on <span className="text-[#e5b861]">evidence.</span></h1>
          <p className="mt-4 max-w-[780px] text-sm leading-7 text-[#a7bad0] sm:text-base">Explore a staged bid portfolio, dependency-locked review gates, advisory competitiveness scoring and a SHA-256-linked activity trail. Every interaction is illustrative and lasts only in this browser session.</p>
        </div>
        <div className="flex flex-wrap gap-2"><button onClick={exportRecord} className={button+" border-[#e5b861] text-[#e5b861]"}><Download size={16}/> Export demo record</button><button onClick={reset} className={button}><RotateCcw size={16}/> Reset</button></div>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Layers3 size={19}/>} label="Illustrative opportunities" value="03" sub="All project values unknown"/>
        <Metric icon={<Gauge size={19}/>} label="Readiness gates" value={`${completedGates}/15`} sub="Demo checks only"/>
        <Metric icon={<Fingerprint size={19}/>} label="Atomic session events" value={String(events.length).padStart(2,"0")} sub="Hash-linked · memory only"/>
        <Metric icon={<Clock3 size={19}/>} label="Current timer" value={formatDuration(liveSeconds)} sub={running?`${running.task} · running`:"No session underway"}/>
      </div>
      <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className={surface+" h-fit p-4"}>
          <div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8da6c3]">Opportunity register</p><span className="text-xs text-[#e5b861]">A1.0</span></div>
          <div className="space-y-2">{projects.map(p=><button key={p.id} onClick={()=>setSelected(p.id)} className={`w-full rounded-xl border px-3 py-3 text-left transition ${selected===p.id?"border-[#e5b861] bg-[#e5b861]/10":"border-[#263a54] bg-[#0b182a] hover:border-[#7188a5]"}`}>
            <span className="flex items-center justify-between text-[11px] font-semibold text-[#91aac3]"><span>{p.id}</span><ArrowRight size={13}/></span>
            <span className="mt-1 block text-base font-semibold">{p.name}</span><span className="mt-1 block text-xs text-[#97aac1]">{p.package}</span>
            <span className="mt-3 inline-block rounded bg-[#253a51] px-2 py-1 text-[10px] font-bold tracking-wide text-[#e9b969]">{status(p.completed)}</span>
          </button>)}</div>
          <div className="mt-5 border-t border-[#2b3f59] pt-4 text-xs leading-5 text-[#91a6be]"><ShieldAlert className="mb-2 text-[#e5b861]" size={18}/> These names are demonstration labels. No confidential drawings, bid values, wages, bonding or financial records are loaded.</div>
        </aside>
        <section className="min-w-0">
          <div className={surface+" overflow-hidden"}>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#2d4260] bg-[#13253c] px-5 py-5">
              <div><p className="text-xs uppercase tracking-[.18em] text-[#97aec8]">Selected opportunity · {project.id}</p><h2 className="mt-1 text-2xl font-semibold">{project.name}</h2><p className="mt-1 text-sm text-[#a9bad0]">{project.package}</p></div>
              <div className="text-right"><span className="rounded-full border border-[#bd8b3c] px-3 py-1 text-xs font-semibold text-[#efc77c]">{status(project.completed)}</span><p className="mt-2 text-xs text-[#90a7bf]">Decision authority: none in demo</p></div>
            </div>
            <nav aria-label="A1 sections" className="flex gap-1 overflow-x-auto border-b border-[#2b405b] px-3 pt-2">{(["overview","operations","assessment","activity","protocol"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab===t?"border-[#e5b861] text-[#e5b861]":"border-transparent text-[#93aac4] hover:text-white"}`}>{t==="operations"?"Operations A2":t}</button>)}</nav>
            {message&&<div role="status" className="mx-5 mt-4 rounded-lg border border-[#d2a55a] bg-[#624620]/25 px-4 py-3 text-sm text-[#f0cf91]">{message}</div>}
            <div className="p-5 sm:p-6">
              <div className={tab==="operations"?"":"hidden"}><A2Operations projectId={selected} onEvent={append}/></div>
              {tab==="overview"&&<div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                <div><SectionTitle title="Decision dependency matrix" subtitle="A later gate cannot be marked complete before its predecessors. This is a UI simulation, not a recorded WDF sign-off."/>
                  <div className="space-y-2">{gateNames.map((name,i)=>{
                    const locked=i>0&&!project.completed.slice(0,i).every(Boolean);
                    return <button key={name} onClick={()=>toggleGate(i)} disabled={busy||locked} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left ${project.completed[i]?"border-[#297c67] bg-[#0c483b]/35":"border-[#334961] bg-[#0b192a]"} ${locked?"opacity-55":"hover:border-[#e5b861]"}`}>
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${project.completed[i]?"bg-[#1f8a6b] text-white":"bg-[#243c58] text-[#a7bed8]"}`}>{project.completed[i]?<Check size={16}/>:locked?<LockKeyhole size={14}/>:String(i)}</span>
                      <span className="min-w-0 flex-1"><strong className="block text-sm">Gate {i}: {name}</strong><span className="mt-1 block text-xs text-[#95adc6]">{project.completed[i]?"Simulated complete":locked?"Locked by preceding gate":"Awaiting demonstration input"}</span></span>
                      <span className="text-[10px] uppercase tracking-wider text-[#9bb0c7]">{project.completed[i]?"Done":locked?"Lock":"Hold"}</span>
                    </button>;
                  })}</div>
                </div>
                <div className="space-y-3"><SectionTitle title="Evidence health" subtitle="No sources authenticated"/>
                  <Health label="Bid deadline" value="UNKNOWN"/><Health label="WDF package value" value="UNKNOWN"/><Health label="Estimating memo" value="NOT PROVIDED"/><Health label="Document/addenda register" value="NOT PROVIDED"/><Health label="Authorizations" value="NOT RECORDED"/>
                  <div className="rounded-xl border border-[#775d32] bg-[#3a2b16]/30 p-4 text-xs leading-5 text-[#ead1a7]"><CircleAlert size={19} className="mb-2"/> No score, demonstration gate or click grants permission to bid.</div>
                </div>
              </div>}
              {tab==="assessment"&&<div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                <div><SectionTitle title="Competitiveness assessment" subtitle="Six advisory criteria scored 0–3. Unknown is not zero. Scores never override compliance or approval gates."/>
                  <div className="overflow-x-auto"><table className="w-full min-w-[460px] text-sm"><thead className="text-left text-[11px] uppercase tracking-wider text-[#91a8c0]"><tr><th className="pb-3">Criterion</th><th className="pb-3">Demo rating</th><th className="pb-3">Evidence</th></tr></thead><tbody>{criteria.map((c,i)=><tr key={c} className="border-t border-[#2b3d55]"><td className="py-3 pr-3">{c}</td><td className="py-3 pr-3"><select className={field+" max-w-[130px]"} value={project.scores[i]??""} onChange={e=>changeScore(i,e.target.value)} disabled={busy}><option value="">Unknown</option>{[0,1,2,3].map(v=><option value={v} key={v}>{v}</option>)}</select></td><td className="py-3 text-xs text-[#dfb873]">Synthetic only</td></tr>)}</tbody></table></div>
                </div><div><SectionTitle title="Advisory score" subtitle="Not a bid decision"/>
                  <div className="rounded-xl border border-[#38506b] bg-[#0c1a2d] p-5 text-center"><p className="text-5xl font-semibold tabular-nums text-[#e5b861]">{score===null?"—":score}<span className="text-lg text-[#8fa8c4]"> / 18</span></p><p className="mt-2 text-xs text-[#9eb3cb]">{score===null?`${6-scores.length} criterion/criteria missing`:"Illustrative rating only"}</p></div>
                  <div className="mt-3 rounded-xl border border-[#2b435e] p-4 text-xs leading-6 text-[#a8bcd3]">The original score bands and implied win probabilities are not validated historical probabilities. This prototype deliberately has no Go-score threshold.</div>
                </div></div>}
              {tab==="activity"&&<div className="grid gap-6 lg:grid-cols-[1fr_290px]">
                <div><SectionTitle title="Atomic activity ledger" subtitle="Every interaction records UTC and a SHA-256 link to the prior event, in this browser session only."/>
                  <div className="mb-3 flex flex-wrap gap-2"><button className={button} onClick={()=>setViewDetail(v=>!v)}><ChevronDown size={15}/>{viewDetail?"Compact":"Expanded"} log</button><button className={button} onClick={exportRecord}><Download size={15}/> Export JSON</button></div>
                  <div className="space-y-2">{events.length===0?<div className="rounded-xl border border-dashed border-[#405571] px-6 py-12 text-center text-sm text-[#9eb5cd]">No events recorded. Start a demo timer, add a note or change a gate.</div>:events.slice().reverse().map(e=><div key={e.seq} className="rounded-xl border border-[#324a65] bg-[#0b192a] p-3"><div className="flex flex-wrap items-center gap-2 text-xs"><span className="font-mono text-[#e5b861]">#{String(e.seq).padStart(3,"0")}</span><strong>{e.kind}</strong><span className="ml-auto font-mono text-[#9db3cb]">{e.atUtc}</span></div><p className="mt-2 text-sm text-[#d0dcec]">{e.projectId} · {e.message}</p>{viewDetail&&<p className="mt-2 break-all font-mono text-[10px] text-[#829bb7]">{e.hash}</p>}</div>)}</div>
                </div><div><SectionTitle title="Activity capture" subtitle="Measured by the visitor's device clock"/>
                  <label className="mb-2 block text-xs text-[#a3b8d1]">Task</label><input value={task} onChange={e=>setTask(e.target.value)} disabled={Boolean(running)} className={field} maxLength={100}/>
                  <div className="mt-3 rounded-xl border border-[#455b73] bg-[#0c1b2e] p-5 text-center"><TimerReset className="mx-auto text-[#e5b861]" size={23}/><p className="mt-2 font-mono text-3xl tabular-nums">{formatDuration(liveSeconds)}</p><p className="mt-1 text-xs text-[#93aac4]">{running?`${running.projectId} · timer open`:"Timer stopped"}</p></div>
                  <button disabled={busy||(!running&&!task.trim())} onClick={toggleTimer} className={button+" mt-3 w-full border-[#e5b861] bg-[#d9ac5e] text-[#101827] hover:bg-[#efc881] hover:text-[#07111f]"}>{running?<><Pause size={16}/>Stop session</>:<><Play size={16}/>Start session</>}</button>
                  <label className="mb-2 mt-6 block text-xs text-[#a3b8d1]">Append a note</label><textarea value={note} onChange={e=>setNote(e.target.value)} className={field+" min-h-24 resize-y"} maxLength={600} placeholder="A synthetic observation, decision question or evidence reference"/><button disabled={!note.trim()||busy} onClick={saveNote} className={button+" mt-2 w-full"}><Plus size={16}/> Append event</button>
                </div></div>}
              {tab==="protocol"&&<div><SectionTitle title="A1 system boundaries" subtitle="The route demonstrates a decision architecture; it is not WDF's operational record or timekeeping system."/>
                <div className="grid gap-3 md:grid-cols-2">{[
                  ["Intake & provenance","One canonical opportunity ID, source/revision identity, and explicit unknowns."],
                  ["Hard-stop logic","Failures, missing evidence and time constraints cannot be overruled by an advisory score."],
                  ["Decision rights","Five review recommendations, two distinct executives, and separate Tutor Perini written authorization are required in the real protocol."],
                  ["Temporal integrity","UTC event chronology, SHA-256 chaining and revision invalidation are modeled; browser history is not tamper-proof corporate evidence."],
                  ["No hidden live data","No payroll, project budgets, rate cards, financial statements, documents or real bid approvals."],
                  ["Controlled promotion","A private backend, organization SSO, backups, evidence access and WDF sign-off are prerequisites to operational use."],
                ].map(([title,desc])=><div key={title} className="rounded-xl border border-[#2f435c] bg-[#0b192a] p-4"><FileCheck2 size={19} className="mb-3 text-[#e5b861]"/><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#9eb5cd]">{desc}</p></div>)}</div>
              </div>}
            </div>
          </div>
        </section>
      </div>
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#273d56] pt-6 text-xs text-[#8ea6c1]"><p>WDF-EST-OPS-A1-001 · GPT demonstration · George Oktem · Mount Vernon, NY · 2026</p><p className="flex items-center gap-2"><ShieldCheck size={16}/> TEST / SYNTHETIC / NO AUTHORITY TO BID</p></footer>
    </div>
  </main>;
}

function Metric({icon,label,value,sub}:{icon:React.ReactNode;label:string;value:string;sub:string}){
  return <div className={surface+" flex items-start gap-3 p-4"}><span className="rounded-xl bg-[#21374e] p-2.5 text-[#e5b861]">{icon}</span><div><p className="text-xs text-[#9fb3ca]">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-[#819ab5]">{sub}</p></div></div>;
}
function SectionTitle({title,subtitle}:{title:string;subtitle:string}){
  return <div className="mb-5"><h3 className="flex items-center gap-2 text-lg font-semibold"><Workflow size={18} className="text-[#e5b861]"/>{title}</h3><p className="mt-1 text-sm leading-6 text-[#90a9c5]">{subtitle}</p></div>;
}
function Health({label,value}:{label:string;value:string}){
  return <div className="flex justify-between gap-3 border-b border-[#2b3e56] pb-3 text-xs"><span className="text-[#9db4cf]">{label}</span><span className="font-semibold text-[#f1be73]">{value}</span></div>;
}
