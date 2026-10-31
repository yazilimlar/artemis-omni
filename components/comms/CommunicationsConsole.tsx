"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
type Result = {ok?:boolean;requestId?:string;error?:string;status?:string};
export function CommunicationsConsole() {
 const [category,setCategory]=useState("General inquiry");
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [message,setMessage]=useState("");
 const [result,setResult]=useState<Result|null>(null);
 const [busy,setBusy]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault(); setBusy(true);setResult(null);
  try { const response=await fetch("/api/communications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({category,name,email,message,website:""})});
    const data=await response.json() as Result;setResult(data);if(response.ok&&data.ok)setMessage("");
  }catch{setResult({error:"Unable to reach the messaging service. Please try again."});}finally{setBusy(false);}
 }
 return <div className="mx-auto max-w-6xl px-6 py-16">
  <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">ARTEMIS / Communications / R2 Preview</p>
  <h1 className="display-serif mt-4 text-5xl text-foreground">One conversation. Traceable decisions.</h1>
  <p className="mt-5 max-w-3xl text-lg text-muted-foreground">A governed communications entry point for engineering, partnerships and operational support. Every accepted inquiry receives a reference ID. This preview never exposes private mobile recipients.</p>
  <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
   <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-background/60 p-7">
    <h2 className="text-2xl font-semibold">Send ARTEMIS a message</h2>
    <label className="block text-sm">Message type<select className="mt-2 w-full rounded-lg border border-border bg-background p-3" value={category} onChange={e=>setCategory(e.target.value)}><option>General inquiry</option><option>Engineering collaboration</option><option>Technical support</option><option>Project pilot</option></select></label>
    <label className="block text-sm">Your name<input required maxLength={120} autoComplete="name" className="mt-2 w-full rounded-lg border border-border bg-background p-3" value={name} onChange={e=>setName(e.target.value)}/></label>
    <label className="block text-sm">Reply email<input required type="email" maxLength={254} autoComplete="email" className="mt-2 w-full rounded-lg border border-border bg-background p-3" value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label className="block text-sm">Message<textarea required minLength={10} maxLength={4000} rows={6} className="mt-2 w-full rounded-lg border border-border bg-background p-3" value={message} onChange={e=>setMessage(e.target.value)}/></label>
    <button disabled={busy} className="rounded-lg bg-gold px-6 py-3 font-semibold text-lunar disabled:opacity-50">{busy?"Submitting…":"Send message"}</button>
    {result&&<p role="status" aria-live="polite" className="rounded-lg border border-border p-4">{result.ok?`Received. Reference: ${result.requestId}. Notification: ${result.status}.`:result.error}</p>}
    <p className="text-xs text-muted-foreground">Do not include passwords, confidential bid data or sensitive personal information.</p>
   </form>
   <aside className="space-y-5">
    <section className="rounded-2xl border border-border bg-navy-deep/40 p-6"><h2 className="text-xl font-semibold">Communication channels</h2><ul className="mt-4 space-y-4 text-sm text-muted-foreground"><li><strong className="text-foreground">Website</strong> — validated intake and reference ID</li><li><strong className="text-foreground">Email</strong> — Resend notification after durable storage</li><li><strong className="text-foreground">GitHub</strong> — engineering issues and review workflow</li><li><strong className="text-foreground">WhatsApp / SMS</strong> — private escalation; not activated in this preview</li></ul></section>
    <section className="rounded-2xl border border-border p-6"><h2 className="text-xl font-semibold">Engineering coordination</h2><p className="mt-3 text-sm text-muted-foreground">Use GitHub for versioned engineering tasks. Avoid posting private client material in public issues.</p><a className="mt-4 inline-block text-gold underline" href="https://github.com/yazilimlar/artemis-omni/issues" target="_blank" rel="noopener noreferrer">Open ARTEMIS issues</a></section>
    <Link href="/" className="inline-block text-gold underline">Return to ARTEMIS</Link>
   </aside>
  </div>
 </div>;
}
