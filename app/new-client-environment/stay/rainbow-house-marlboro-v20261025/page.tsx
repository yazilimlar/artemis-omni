import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
 title: "Rainbow House Marlboro | Artemis Client Environment",
 description: "Versioned Rainbow House development environment within Artemis New Live Products for Clients.",
 robots: { index: false, follow: false },
};
const preview = "https://rainbow-house-octopusg-g5tjpthpf-gokmen1313-3041s-projects.vercel.app";
export default function RainbowHouseClientEnvironment() {
 return <main style={{minHeight:"100vh",background:"radial-gradient(circle at 85% 10%,#22565b,transparent 40%),#081923",color:"#ecf5f0",fontFamily:"system-ui,sans-serif",padding:"clamp(24px,5vw,72px)"}}>
  <div style={{maxWidth:1060,margin:"auto"}}>
   <nav style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",fontSize:14}}>
    <Link href="/" style={{color:"#b8e6d6"}}>← Artemis</Link>
    <span style={{letterSpacing:2,color:"#b5d0cf"}}>NEW LIVE PRODUCTS FOR CLIENTS / STAY</span>
   </nav>
   <p style={{marginTop:90,color:"#a7d7c5",letterSpacing:3,fontSize:13}}>CLIENT ENVIRONMENT · VERSION 20261025</p>
   <h1 style={{fontSize:"clamp(42px,7vw,86px)",lineHeight:1.05,letterSpacing:"-.06em",maxWidth:780,margin:"18px 0"}}>Rainbow House<br/>Marlboro</h1>
   <p style={{fontSize:20,lineHeight:1.7,maxWidth:660,color:"#b6cdd0"}}>Hudson Valley hospitality meets a consent-first booking and property intelligence platform. A dedicated client-product workspace, developed independently and reviewed before production integration.</p>
   <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:32}}>
    <a href={preview} style={{background:"#ccead8",color:"#08252b",borderRadius:10,padding:"15px 20px",fontWeight:700,textDecoration:"none"}}>Open Rainbow House preview ↗</a>
    <a href={preview+"/development-lab"} style={{border:"1px solid #648e8a",color:"#d9efea",borderRadius:10,padding:"15px 20px",textDecoration:"none"}}>Explore development lab ↗</a>
   </div>
   <p style={{color:"#9eb8bc",fontSize:13,marginTop:14}}>External preview currently uses Vercel Authentication; this page does not bypass access protection.</p>
   <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18,marginTop:90}}>
    {[
     ["01 / EXPERIENCE","Independent hospitality website","Versioned guest-facing design and content, isolated from Artemis production."],
     ["02 / OPERATIONS","Booking and CRM foundation","Validated booking contracts, consent-gated contact mapping and outbox state logic."],
     ["03 / INTELLIGENCE","Property and tax roadmap","Exact-money primitives and planned private property intelligence workflows."]
    ].map(([tag,title,desc])=><article key={tag} style={{border:"1px solid #31515b",borderRadius:16,padding:24,background:"#102832"}}>
      <p style={{color:"#a5d6c6",fontSize:12,letterSpacing:2}}>{tag}</p><h2 style={{fontSize:22}}>{title}</h2><p style={{color:"#b4cbd0",lineHeight:1.6}}>{desc}</p>
    </article>)}
   </section>
   <footer style={{marginTop:80,borderTop:"1px solid #31515b",paddingTop:25,color:"#8aa9b0",fontSize:13}}>Artemis · New Live Products for Clients · Development gateway only · No real guest CRM data is exposed</footer>
  </div>
 </main>;
}
