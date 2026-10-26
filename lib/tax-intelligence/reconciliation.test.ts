import { describe, expect, it } from "vitest";
import { reconcile, type Observation } from "./reconciliation";

const m = (cents: number) => ({currency: "USD" as const,cents});
const fixture: Observation[] = [
  {id:"order-1",tenantId:"great-order",source:"squarespace",sourceId:"o-1",kind:"order",amount:m(10000),occurredAt:"2026-01-01",linksTo:[]},
  {id:"fee-1",tenantId:"great-order",source:"squarespace",sourceId:"f-1",kind:"fee",amount:m(300),occurredAt:"2026-01-01",linksTo:["order-1"]},
  {id:"tax-1",tenantId:"great-order",source:"squarespace",sourceId:"t-1",kind:"sales_tax",amount:m(700),occurredAt:"2026-01-01",linksTo:["order-1"]},
  {id:"payout-1",tenantId:"great-order",source:"squarespace",sourceId:"p-1",kind:"payout",amount:m(9000),occurredAt:"2026-01-03",linksTo:["order-1"]},
  {id:"bank-1",tenantId:"great-order",source:"td_bank",sourceId:"b-1",kind:"bank_deposit",amount:m(9000),occurredAt:"2026-01-04",linksTo:["payout-1"]},
  {id:"erp-1",tenantId:"great-order",source:"prime_erp",sourceId:"i-1",kind:"erp_invoice",amount:m(10000),occurredAt:"2026-01-01",linksTo:["order-1"]}
];
describe("M2.5 conText reconciliation",()=>{
  it("reconciles a synthetic order without counting the ERP invoice as another sale",()=>{
    const r=reconcile("great-order",fixture);
    expect(r.netExpectedPayoutCents).toBe(9000);
    expect(r.bankVarianceCents).toBe(0);
    expect(r.revenueEventCount).toBe(1);
    expect(r.discrepancies).toEqual([]);
  });
  it("rejects cross-tenant evidence",()=>{
    expect(()=>reconcile("great-order",[...fixture,{...fixture[0],id:"foreign",sourceId:"foreign",tenantId:"personal"}])).toThrow(/Cross-tenant/);
  });
  it("rejects duplicate provider records",()=>{
    expect(()=>reconcile("great-order",[...fixture,{...fixture[0],id:"other"}])).toThrow(/Duplicate/);
  });
  it("flags payout-to-bank discrepancies",()=>{
    const altered=fixture.map(x=>x.id==="bank-1"?{...x,amount:m(8900)}:x);
    expect(reconcile("great-order",altered).discrepancies).toContain("Bank deposit mismatch");
  });
  it("flags an unlinked deposit",()=>{
    const altered=fixture.map(x=>x.id==="bank-1"?{...x,linksTo:[]}:x);
    expect(reconcile("great-order",altered).discrepancies).toContain("Bank deposit lacks explicit payout evidence link");
  });
});
