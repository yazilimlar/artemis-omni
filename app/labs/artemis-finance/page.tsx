import type { Metadata } from "next";
import { parseCents, outstanding, journalBalanced, cardPurchasePosting, cardPaymentPosting, managementElimination, illustrativeProvision } from "@/lib/finance/universal-kernel";
export const metadata: Metadata = { title: "ARTEMIS Financial Intelligence Lab", robots: { index: false, follow: false } };
const format=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
export default function FinanceLab(){
 const sample=managementElimination(10000000,1200000,5500000,1200000);
 const payable=outstanding({id:'demo',entityId:'demo',amountCents:350000,paidCents:50000,dueDate:null,kind:'school-tax',evidenceIds:[]});
 const purchase=cardPurchasePosting(parseCents('125.50'));
 const payment=cardPaymentPosting(parseCents('125.50'));
 return <main style={{maxWidth:1050,margin:'auto',padding:'64px 24px',fontFamily:'system-ui'}}>
 <p style={{letterSpacing:3,fontSize:12}}>GREAT ORDER LLC · ARTEMIS</p>
 <h1 style={{fontSize:'clamp(2rem,5vw,3.6rem)',fontWeight:650}}>Financial Intelligence Lab</h1>
 <p>Public demonstration only. All figures below are synthetic. No account, tax return, or financial record is connected or stored.</p>
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,margin:'32px 0'}}>
 {[["External revenue",format(sample.consolidatedRevenue)],["Operating result",format(sample.operatingResult)],["Internal charges eliminated",format(sample.eliminatedInternalRevenue)],["Illustrative provision at 25%",format(illustrativeProvision(sample.operatingResult,.25))],["School-tax payable (example)",format(payable)],["Card postings balanced",journalBalanced(purchase)&&journalBalanced(payment)?'Yes':'No']].map(([name,value])=><article key={name} style={{border:'1px solid #77889955',borderRadius:14,padding:22}}><p>{name}</p><strong style={{fontSize:25}}>{value}</strong></article>)}
 </section>
 <h2>Financial scope and controls</h2>
 <ul><li>Individual: W-2, 1099, 1098, credit card and property tax records</li><li>Great Order LLC: taxpayer boundary and statutory reporting</li><li>aGOraXai, ARTEMIS and Apolloa: cost centers until legal status is verified</li><li>Rainbow House: property ledger, allocations, depreciation review</li><li>Payables and accruals: due dates, evidence, settlement and reversals</li><li>Quarterly reporting: P&amp;L, balance sheet, cash flow, reconciliation</li></ul>
 <p><strong>Privacy gate:</strong> Real documents and balances must not be entered on this public route. Authenticated owner storage, official filing imports and reminder delivery are pending implementation.</p>
 </main>;
}
