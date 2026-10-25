import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Rainbow House | Hudson Valley Stay", description: "Explore the Rainbow House guest experience in Marlboro, New York.", robots: { index: false, follow: false } };
const root = "/new-client-environment/stay/rainbow-house-marlboro-v20261025";
const features = [
 ["Hudson Valley", "A quiet base for discovering the Hudson River corridor, wineries, orchards, and nearby towns."],
 ["Private stay", "A separate guest entrance and dedicated parking for an independent arrival."],
 ["Seasonal outdoors", "Enjoy the property's outdoor setting and seasonal pool availability, subject to the listing details."],
];
export default function RainbowHouseExperience() {
 return <main style={{minHeight:"100vh",color:"#f5f2e9",background:"linear-gradient(150deg,#172d2a 0%,#10211f 55%,#1c302c 100%)",fontFamily:"Georgia,serif"}}>
 <div style={{maxWidth:1180,margin:"auto",padding:"28px clamp(22px,5vw,72px) 100px"}}>
 <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,fontFamily:"system-ui,sans-serif",fontSize:13,letterSpacing:1.5}}>
 <Link href={root} style={{color:"#e2d8b9",textDecoration:"none"}}>← ARTEMIS CLIENT ENVIRONMENT</Link><span style={{color:"#c9d5c7"}}>RAINBOW HOUSE · MARLBORO NY</span></nav>
 <section style={{padding:"clamp(90px,13vw,160px) 0 90px",maxWidth:850}}>
 <p style={{fontFamily:"system-ui,sans-serif",fontSize:12,letterSpacing:4,color:"#d8bd83"}}>A HUDSON VALLEY RETREAT</p>
 <h1 style={{fontSize:"clamp(58px,9vw,120px)",fontWeight:400,letterSpacing:"-.065em",lineHeight:.98,margin:"24px 0"}}>A slower kind<br/>of beautiful.</h1>
 <p style={{fontSize:"clamp(18px,2.3vw,24px)",lineHeight:1.7,color:"#d4dfd5",maxWidth:640}}>Discover Rainbow House in Marlboro, New York — river views, space to unwind, and the character of the Hudson Valley.</p>
 <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:38,fontFamily:"system-ui,sans-serif",fontSize:14}}>
 <a href="https://rainbow-house.vercel.app/" style={{padding:"16px 22px",background:"#e3d3a6",color:"#18302c",textDecoration:"none",borderRadius:4,fontWeight:700}}>Explore official listing site ↗</a>
 <Link href={root} style={{padding:"16px 22px",border:"1px solid #779087",color:"#f0e9d9",textDecoration:"none",borderRadius:4}}>About the client platform</Link>
 </div></section>
 <div style={{height:1,background:"#4d6c5e",opacity:.7}}/>
 <section style={{paddingTop:62}}><p style={{fontFamily:"system-ui,sans-serif",fontSize:12,letterSpacing:3,color:"#d8bd83"}}>THE EXPERIENCE</p>
 <h2 style={{fontSize:"clamp(32px,5vw,58px)",fontWeight:400,margin:"14px 0 35px"}}>Stay close to nature.</h2>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16}}>{features.map(([name,description],i)=><article key={name} style={{padding:30,minHeight:225,border:"1px solid #547064",background:"rgba(255,255,255,.035)"}}>
 <span style={{fontFamily:"system-ui,sans-serif",fontSize:12,color:"#d8bd83"}}>0{i+1}</span><h3 style={{fontWeight:400,fontSize:28}}>{name}</h3><p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.75,color:"#c4d0c8"}}>{description}</p></article>)}</div></section>
 <footer style={{marginTop:100,paddingTop:22,borderTop:"1px solid #547064",fontFamily:"system-ui,sans-serif",fontSize:12,color:"#b6c9bb",lineHeight:1.7}}>Preview of a native Artemis-hosted guest experience. No reservation, payment, guest-data collection, or availability claims are implemented here. Confirm all property details on the official listing site.</footer>
 </div></main>;
}