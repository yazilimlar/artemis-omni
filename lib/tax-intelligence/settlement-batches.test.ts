import {describe,it,expect} from "vitest";
import {reconcileSettlementBatches,type SettlementObservation} from "./settlement-batches";
const obs=(id:string,kind:SettlementObservation["kind"],cents:number,linksTo:string[]=[],batchId="batch-a"):SettlementObservation=>({
 id,kind,cents,linksTo,batchId,tenantId:"great-order",source:kind==="bank_deposit"?"td_bank":kind==="erp_invoice"?"prime_erp":"squarespace",sourceId:id,occurredAt:"2026-01-03"
});
describe("M2.6 batch-aware settlement",()=>{
 const base=[obs("charge","charge",10700),obs("fee","processor_fee",300,["charge"]),obs("payout","payout",10400,["charge"]),obs("bank","bank_deposit",10400,["payout"])];
 it("includes sales tax in processor payout unless provider withholds it",()=>{const r=reconcileSettlementBatches("great-order",base);expect(r.batches[0].status).toBe("matched");expect(r.batches[0].expectedPayoutCents).toBe(10400)});
 it("supports split payouts across distinct batches",()=>{const b=base.map(x=>({...x,batchId:"batch-b",id:x.id+"-b",sourceId:x.sourceId+"-b",linksTo:x.linksTo.map(y=>y+"-b")}));const r=reconcileSettlementBatches("great-order",[...base,...b]);expect(r.batches).toHaveLength(2);expect(r.batches.every(x=>x.status==="matched")).toBe(true)});
 it("accounts for refunds and tax withheld explicitly",()=>{const r=reconcileSettlementBatches("great-order",[obs("charge","charge",10700),obs("refund","refund",1000,["charge"]),obs("tax","tax_withheld",700,["charge"]),obs("payout","payout",9000,["charge"]),obs("bank","bank_deposit",9000,["payout"])]);expect(r.batches[0].status).toBe("matched")});
 it("reports a pending batch without inventing a bank deposit",()=>{const r=reconcileSettlementBatches("great-order",base.filter(x=>x.id!=="bank"));expect(r.batches[0].status).toBe("pending")});
 it("rejects a foreign tenant",()=>expect(()=>reconcileSettlementBatches("great-order",[...base,{...obs("foreign","charge",1),tenantId:"other"}])).toThrow(/Cross-tenant/));
 it("rejects duplicate provider observations",()=>expect(()=>reconcileSettlementBatches("great-order",[...base,{...base[0],id:"new"}])).toThrow(/Duplicate/));
 it("flags bank variance",()=>{const xs=base.map(x=>x.id==="bank"?{...x,cents:10300}:x);expect(reconcileSettlementBatches("great-order",xs).batches[0].exceptions).toContain("Bank deposit variance")});
 it("flags cross-batch evidence",()=>{const xs=base.map(x=>x.id==="bank"?{...x,linksTo:["charge-b"]}:x);expect(reconcileSettlementBatches("great-order",xs).unmatchedEvidence).toContain("bank -> charge-b")});
});
