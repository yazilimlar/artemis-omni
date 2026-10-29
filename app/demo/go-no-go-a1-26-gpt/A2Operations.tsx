"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarClock, Check, ChevronRight, Clock3, ListTodo, MapPinned, Play, Square, Users } from "lucide-react";

type WorkStatus = "TODO" | "IN_PROGRESS" | "DONE";
type Task = { id:string; projectId:string; title:string; parent?:string; owner:string; due:string; start:string; status:WorkStatus; progress:number };
type Member = { id:string; role:string; seen:string; availability:string };

const members:Member[]=[
  {id:"Estimator A",role:"Mechanical estimating",seen:"Demo marker · 09:15 ET",availability:"Allocated"},
  {id:"Coordinator B",role:"Bid intake & documents",seen:"Demo marker · 08:42 ET",availability:"Available"},
  {id:"Reviewer C",role:"Execution & manpower",seen:"Demo marker · 10:08 ET",availability:"Review queue"},
  {id:"Lead D",role:"Commercial / risk",seen:"Demo marker · 08:57 ET",availability:"Available"},
];
const firstTasks:Task[]=[
  {id:"BOT-01",projectId:"A1-001",title:"Invitation and scope register",owner:"Coordinator B",start:"2026-10-29",due:"2026-11-02",status:"IN_PROGRESS",progress:45},
  {id:"BOT-02",projectId:"A1-001",title:"Mechanical takeoff",owner:"Estimator A",start:"2026-10-30",due:"2026-11-06",status:"TODO",progress:0},
  {id:"BOT-02a",projectId:"A1-001",parent:"BOT-02",title:"Equipment schedule cross-check",owner:"Estimator A",start:"2026-10-30",due:"2026-11-03",status:"TODO",progress:0},
  {id:"BOT-03",projectId:"A1-001",title:"Compliance and capacity review",owner:"Reviewer C",start:"2026-11-04",due:"2026-11-09",status:"TODO",progress:0},
  {id:"PK-01",projectId:"A1-002",title:"Document version register",owner:"Coordinator B",start:"2026-10-29",due:"2026-11-03",status:"IN_PROGRESS",progress:25},
  {id:"PK-02",projectId:"A1-002",title:"Preliminary HVAC estimate",owner:"Estimator A",start:"2026-11-02",due:"2026-11-12",status:"TODO",progress:0},
  {id:"PK-03",projectId:"A1-002",title:"Contract and resource review",owner:"Lead D",start:"2026-11-09",due:"2026-11-16",status:"TODO",progress:0},
  {id:"WTC-01",projectId:"A1-003",title:"Drawing and RFI reconciliation",owner:"Coordinator B",start:"2026-10-29",due:"2026-11-04",status:"IN_PROGRESS",progress:30},
  {id:"WTC-02",projectId:"A1-003",title:"Floor / phase quantity model",owner:"Estimator A",start:"2026-11-02",due:"2026-11-13",status:"TODO",progress:0},
  {id:"WTC-02a",projectId:"A1-003",parent:"WTC-02",title:"Equipment and distribution split",owner:"Estimator A",start:"2026-11-05",due:"2026-11-11",status:"TODO",progress:0},
  {id:"WTC-03",projectId:"A1-003",title:"Independent cost validation",owner:"Lead D",start:"2026-11-11",due:"2026-11-18",status:"TODO",progress:0},
];
const projectLabels:Record<string,string>={"A1-001":"Botanical Garden","A1-002":"350 Park","A1-003":"2 WTC"};
const dayMs=86400000;
const horizonStart=Date.parse("2026-10-29T00:00:00Z");
const horizonDays=23;
const gold="#e5b861";
const inputStyle="rounded-lg border border-[#425a75] bg-[#0a1728] px-3 py-2 text-sm text-white outline-none focus:border-[#e5b861]";

function countdown(due:string,now:number){
  // A2 fixture dates straddle the 2026 New York DST change on November 1.
  const nyOffset=due<"2026-11-01"?"-04:00":"-05:00";
  const delta=Date.parse(`${due}T23:59:59${nyOffset}`)-now;
  if(!Number.isFinite(delta))return "Date unknown";
  if(delta<=0)return `OVERDUE ${Math.ceil(Math.abs(delta)/dayMs)}d`;
  const days=Math.floor(delta/dayMs),hours=Math.floor(delta%dayMs/3600000),mins=Math.floor(delta%3600000/60000);
  return `${days}d ${String(hours).padStart(2,"0")}h ${String(mins).padStart(2,"0")}m`;
}
const fmt=(n:number)=>`${String(Math.floor(n/3600)).padStart(2,"0")}:${String(Math.floor(n%3600/60)).padStart(2,"0")}:${String(Math.floor(n%60)).padStart(2,"0")}`;

export default function A2Operations({projectId,onEvent}:{projectId:string;onEvent:(kind:string,project:string,message:string)=>Promise<void>}){
  const [tasks,setTasks]=useState<Task[]>(firstTasks);
  const [filter,setFilter]=useState<"SELECTED"|"ALL">("SELECTED");
  const [member,setMember]=useState("ALL");
  const [now,setNow]=useState(0);
  const [taskTitle,setTaskTitle]=useState("");
  const [taskOwner,setTaskOwner]=useState(members[0].id);
  const [taskDue,setTaskDue]=useState("2026-11-15");
  const [active,setActive]=useState<{taskId:string;started:number}|null>(null);
  const [recent,setRecent]=useState<string[]>(["A2 synthetic schedule initialized; no live identity feed is connected."]);
  useEffect(()=>{setNow(Date.now());const i=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(i)},[]);
  const visible=tasks.filter(t=>(filter==="ALL"||t.projectId===projectId)&&(member==="ALL"||t.owner===member));
  const done=visible.filter(t=>t.status==="DONE").length;
  const open=visible.filter(t=>t.status!=="DONE").length;
  const selected=tasks.filter(t=>t.projectId===projectId);
  const latestDue=selected.filter(t=>t.status!=="DONE").map(t=>t.due).sort()[0];
  const ownerSummary=useMemo(()=>members.map(m=>{
    const assigned=tasks.filter(t=>t.owner===m.id),open=assigned.filter(t=>t.status!=="DONE");
    const next=open.map(t=>t.due).sort()[0];
    return {...m,count:open.length,done:assigned.length-open.length,next};
  }),[tasks]);
  const change=(id:string,status:WorkStatus)=>{
    const target=tasks.find(t=>t.id===id);if(!target)return;
    setTasks(curr=>curr.map(t=>t.id===id?{...t,status,progress:status==="DONE"?100:status==="IN_PROGRESS"?Math.max(10,t.progress):0}:t));
    const m=`${id} ${status.replace("_"," ")} by demo operator`;
    setRecent(x=>[m,...x].slice(0,6));void onEvent("A2_TASK_STATUS",target.projectId,m);
  };
  const add=()=>{
    if(!taskTitle.trim()||!taskDue)return;
    const id=`SIM-${String(tasks.length+1).padStart(3,"0")}`;
    setTasks(x=>[...x,{id,projectId,title:taskTitle.trim(),owner:taskOwner,start:new Date().toISOString().slice(0,10),due:taskDue,status:"TODO",progress:0}]);
    const m=`${id} created (synthetic) for ${taskOwner} due ${taskDue}`;
    setRecent(x=>[m,...x].slice(0,6));void onEvent("A2_TASK_CREATE",projectId,m);setTaskTitle("");
  };
  const timer=(task:Task)=>{
    if(active){
      const elapsed=Math.max(0,(Date.now()-active.started)/1000);
      const prior=tasks.find(t=>t.id===active.taskId);
      void onEvent("A2_TIMER_STOP",prior?.projectId??projectId,`${active.taskId} session elapsed ${elapsed.toFixed(3)}s (demo device clock)`);
      setRecent(x=>[`${active.taskId} timer stopped · ${fmt(elapsed)}`,...x].slice(0,6));setActive(null);
    } else {
      setActive({taskId:task.id,started:Date.now()});
      void onEvent("A2_TIMER_START",task.projectId,`${task.id} timer started by demo operator`);
    }
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-semibold">Operations command deck <span className="text-[#e5b861]">A2</span></h3><p className="mt-1 text-sm text-[#9bb2cd]">Illustrative assignments and dates. No company identity, location or timesheet integrations are connected.</p></div><span className="rounded-lg border border-[#a77c3e] bg-[#a77c3e]/10 px-3 py-2 text-xs font-bold text-[#edc687]">SIMULATED — NOT LIVE TELEMETRY</span></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MiniStat label="Open tasks" value={String(open)} icon={<ListTodo size={17}/>}/><MiniStat label="Completed tasks" value={String(done)} icon={<Check size={17}/>}/>
      <MiniStat label="Selected next due" value={latestDue??"None"} icon={<CalendarClock size={17}/>}/>
      <MiniStat label="Selected countdown" value={latestDue?countdown(latestDue,now):"—"} icon={<Clock3 size={17}/>}/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
        <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3"><h4 className="mr-auto flex items-center gap-2 font-semibold"><ListTodo size={17} color={gold}/> Task and subtask register</h4>
            <select aria-label="Project filter" value={filter} onChange={e=>setFilter(e.target.value as "SELECTED"|"ALL")} className={inputStyle}><option value="SELECTED">Selected project</option><option value="ALL">All three projects</option></select>
            <select aria-label="Assignee filter" value={member} onChange={e=>setMember(e.target.value)} className={inputStyle}><option value="ALL">All workers</option>{members.map(m=><option key={m.id}>{m.id}</option>)}</select>
          </div>
          <div className="space-y-2">{visible.map(t=><div key={t.id} className="rounded-lg border border-[#263f5b] bg-[#112339] px-3 py-3">
            <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] text-[#e5b861]">{t.id}</span>{t.parent&&<span className="text-[10px] text-[#8da8c3]">↳ subtask of {t.parent}</span>}<span className="ml-auto text-[11px] text-[#8da8c3]">{projectLabels[t.projectId]}</span></div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">{t.title}</p><p className="mt-1 text-xs text-[#97abc4]">{t.owner} · due {t.due}</p></div><span className={`font-mono text-xs ${t.status==="DONE"?"text-[#72cfad]":"text-[#f0c17d]"}`}>{t.status==="DONE"?"COMPLETE":countdown(t.due,now)}</span></div>
            <div className="mt-3 flex flex-wrap items-center gap-2"><div className="mr-auto h-1.5 min-w-[70px] flex-1 overflow-hidden rounded bg-[#263c56]"><div className="h-full bg-[#e5b861]" style={{width:`${t.progress}%`}}/></div><span className="text-[10px] text-[#a7bad0]">{t.progress}%</span>
              <select aria-label={`Status ${t.id}`} className={inputStyle+" !py-1 !text-xs"} value={t.status} onChange={e=>change(t.id,e.target.value as WorkStatus)}><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Completed</option></select>
              <button title={`Timer for ${t.id}`} onClick={()=>timer(t)} disabled={active!==null&&active.taskId!==t.id} className="rounded border border-[#50647f] px-2 py-1.5 text-[#e5b861] disabled:opacity-25">{active?.taskId===t.id?<Square size={13}/>:<Play size={13}/>}</button>
            </div>
          </div>)}{visible.length===0&&<p className="py-8 text-center text-sm text-[#8da6c1]">No tasks match the selected filters.</p>}</div>
        </section>
        <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><h4 className="mb-1 flex items-center gap-2 font-semibold"><Activity size={17} color={gold}/> Gantt-style schedule monitoring</h4><p className="mb-4 text-xs text-[#91a9c4]">Demo horizon: Oct 29 – Nov 20, 2026 · scheduled bars, not verified commitments.</p>
          <div className="overflow-x-auto"><div className="min-w-[610px]"><div className="mb-3 grid grid-cols-[185px_1fr] text-[11px] text-[#9fb5ce]"><span>Work package</span><div className="flex justify-between"><span>Oct 29</span><span>Nov 05</span><span>Nov 12</span><span>Nov 20</span></div></div>
            {visible.map(t=>{const left=Math.max(0,(Date.parse(`${t.start}T00:00:00Z`)-horizonStart)/dayMs/horizonDays*100);const width=Math.min(100-left,Math.max(2,(Date.parse(`${t.due}T00:00:00Z`)-Date.parse(`${t.start}T00:00:00Z`))/dayMs/horizonDays*100));return <div key={t.id} className="mb-2 grid grid-cols-[185px_1fr] items-center gap-2 text-xs"><span className="truncate" title={t.title}>{t.id} · {t.title}</span><div className="relative h-5 rounded bg-[linear-gradient(90deg,transparent_24.7%,#263e56_25%,transparent_25.3%,transparent_49.7%,#263e56_50%,transparent_50.3%,transparent_74.7%,#263e56_75%,transparent_75.3%)]"><div className={`absolute top-1 h-3 rounded-sm ${t.status==="DONE"?"bg-[#36a783]":t.status==="IN_PROGRESS"?"bg-[#e5b861]":"bg-[#607b9e]"}`} style={{left:`${left}%`,width:`${width}%`}} title={`${t.start} to ${t.due}`}/></div></div>})}
          </div></div></section>
      </div>
      <aside className="space-y-5">
        <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><h4 className="mb-3 flex items-center gap-2 font-semibold"><Users size={17} color={gold}/> Team assignment board</h4>
          <p className="mb-3 text-xs text-[#91a9c4]">Fictional role labels. Last-login markers below are invented for demo display; no identity provider queried.</p>
          {ownerSummary.map(m=><div key={m.id} className="border-t border-[#2b425d] py-3"><div className="flex justify-between gap-3"><strong className="text-sm">{m.id}</strong><span className="text-xs text-[#edc27b]">{m.availability}</span></div><p className="mt-1 text-xs text-[#91a8c1]">{m.role}</p><p className="mt-1 text-[11px] text-[#7892ad]">Last sign-in: {m.seen}</p><p className="mt-2 text-xs">{m.count} open · {m.done} complete</p>{m.next&&<p className="mt-1 font-mono text-[11px] text-[#d8b876]">Next deadline {countdown(m.next,now)}</p>}</div>)}
        </section>
        <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><h4 className="mb-3 flex items-center gap-2 font-semibold"><CalendarClock size={17} color={gold}/> Add simulated task</h4>
          <label className="block text-xs text-[#a9bdd4]">Task name<input value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} maxLength={100} className={inputStyle+" mt-1 w-full"}/></label>
          <label className="mt-3 block text-xs text-[#a9bdd4]">Worker<select value={taskOwner} onChange={e=>setTaskOwner(e.target.value)} className={inputStyle+" mt-1 w-full"}>{members.map(m=><option key={m.id}>{m.id}</option>)}</select></label>
          <label className="mt-3 block text-xs text-[#a9bdd4]">Illustrative due date<input type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)} className={inputStyle+" mt-1 w-full"}/></label>
          <button disabled={!taskTitle.trim()||!taskDue} onClick={add} className="mt-4 w-full rounded-lg bg-[#e5b861] px-4 py-2 text-sm font-semibold text-[#101827] disabled:opacity-30">Create demo task</button>
          <p className="mt-3 text-xs text-[#8ca5bf]">{active?`${active.taskId} timer active · ${fmt((now-active.started)/1000)}`:"No task timer active"}</p>
        </section>
      </aside>
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><h4 className="mb-1 flex items-center gap-2 font-semibold"><MapPinned size={17} color={gold}/> Illustrative geographic context</h4><p className="mb-3 text-xs text-[#91a9c4]">Schematic NYC region only. Not GPS, live tracking or surveyed project coordinates.</p>
        <svg role="img" aria-label="Illustrative schematic of New York project regions" viewBox="0 0 600 310" className="w-full rounded-lg border border-[#30445e] bg-[#081927]">
          <path d="M0 0 H238 Q282 75 235 160 T252 310 H0Z" fill="#102d44"/><path d="M238 0 Q282 75 235 160 T252 310" stroke="#4385a2" strokeWidth="18" fill="none" opacity=".7"/>
          <path d="M290 0 L345 310 M355 0 L407 310 M430 0 L485 310 M255 72 L600 112 M268 148 L600 172 M270 225 L600 250" stroke="#28405a" strokeWidth="10"/>
          <path d="M290 0 L345 310 M355 0 L407 310 M430 0 L485 310 M255 72 L600 112 M268 148 L600 172 M270 225 L600 250" stroke="#566f88" strokeDasharray="2 6" strokeWidth="1.5"/>
          <text x="38" y="155" fill="#7bafc7" fontSize="18" transform="rotate(-90 38 155)">Hudson River · schematic</text>
          {[{x:415,y:65,id:"A1-001",label:"Garden demo"},{x:462,y:170,id:"A1-002",label:"Park demo"},{x:345,y:255,id:"A1-003",label:"WTC demo"}].map(p=><g key={p.id}><circle cx={p.x} cy={p.y} r="10" fill={p.id===projectId?"#e5b861":"#6cb6c5"} stroke="#091627" strokeWidth="4"/><text x={p.x+15} y={p.y-9} fill="#e3edf8" fontSize="14">{p.label}</text></g>)}
        </svg>
      </section>
      <section className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><h4 className="mb-1 flex items-center gap-2 font-semibold"><Activity size={17} color={gold}/> Process & recent actions</h4><p className="mb-4 text-xs text-[#91a9c4]">Derived from the synthetic task board. Real approvals remain outside this display.</p>
        <div className="flex flex-wrap items-center gap-1">{["Intake","Takeoff","Review","Decision","Archive"].map((stage,i)=><div key={stage} className="flex items-center gap-1"><span className={`rounded-lg border px-2 py-2 text-[11px] ${i===0?"border-[#d1a85e] bg-[#d1a85e]/15 text-[#f0d091]":"border-[#37516f] bg-[#10243a] text-[#a5bad2]"}`}>{stage}</span>{i<4&&<ChevronRight size={12} className="text-[#728aa5]"/>}</div>)}</div>
        <div className="mt-4 space-y-2">{recent.map((a,i)=><p key={`${i}-${a}`} className="rounded-md border border-[#293e55] px-3 py-2 text-xs text-[#a9bed7]">{a}</p>)}</div>
      </section>
    </div>
    <p className="border-t border-[#2b415b] pt-3 text-xs text-[#8da7c3]">A2 demo uses fixed scenario dates, fictional team identities and device-time updates. “Live” refers only to updating countdown displays and this browser session. Real tracking requires WDF-approved identity, task, labor and location systems.</p>
  </div>;
}

function MiniStat({label,value,icon}:{label:string;value:string;icon:React.ReactNode}){
  return <div className="rounded-xl border border-[#30465f] bg-[#0b192a] p-4"><div className="mb-2 flex items-center gap-2 text-xs text-[#95adc7]">{icon}{label}</div><p className="font-mono text-xl font-semibold text-[#f1d49c]">{value}</p></div>;
}
