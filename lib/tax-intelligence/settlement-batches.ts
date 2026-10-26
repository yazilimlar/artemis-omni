/**
 * M2.6 synthetic settlement engine. It deliberately does not replace R1 until
 * tests, accounting review and tenant authorization are verified.
 *
 * Accounting convention: gross charge INCLUDES sales tax. Processor payouts
 * include collected tax unless provider evidence proves tax was withheld.
 * All amounts are integer USD cents and nonnegative magnitudes.
 */
export type SettlementKind = "charge" | "refund" | "processor_fee" | "processor_adjustment" | "tax_withheld" | "payout" | "bank_deposit" | "erp_invoice";
export type SettlementObservation = {
  id: string;
  tenantId: string;
  source: "squarespace" | "td_bank" | "prime_erp";
  sourceId: string;
  kind: SettlementKind;
  cents: number;
  batchId: string;
  linksTo: string[];
  occurredAt: string;
};
export type SettlementBatchResult = {
  batchId: string;
  chargeCents: number;
  refundCents: number;
  feeCents: number;
  adjustmentCents: number;
  taxWithheldCents: number;
  expectedPayoutCents: number;
  actualPayoutCents: number;
  bankDepositCents: number;
  payoutVarianceCents: number;
  bankVarianceCents: number;
  status: "matched" | "pending" | "exception";
  exceptions: string[];
};
export type SettlementReport = {tenantId: string; batches: SettlementBatchResult[]; unmatchedEvidence: string[]};
const total = (xs: SettlementObservation[], kind: SettlementKind) =>
  xs.filter(x=>x.kind===kind).reduce((a,x)=>a+x.cents,0);
export function reconcileSettlementBatches(tenantId: string, observations: SettlementObservation[]): SettlementReport {
  if (!tenantId) throw new Error("Tenant required");
  const ids = new Set<string>(), sourceIds = new Set<string>();
  for (const x of observations) {
    if (x.tenantId !== tenantId) throw new Error("Cross-tenant observation");
    if (!x.id || !x.sourceId || !x.batchId || !Number.isSafeInteger(x.cents) || x.cents < 0)
      throw new Error("Invalid observation");
    if (ids.has(x.id) || sourceIds.has(x.source+":"+x.sourceId)) throw new Error("Duplicate observation");
    if (!Number.isFinite(Date.parse(x.occurredAt))) throw new Error("Invalid event date");
    ids.add(x.id); sourceIds.add(x.source+":"+x.sourceId);
  }
  const byId = new Map(observations.map(x=>[x.id,x]));
  const unmatchedEvidence: string[] = [];
  for (const x of observations) for (const ref of x.linksTo) {
    const target=byId.get(ref);
    if (!target || target.batchId!==x.batchId) unmatchedEvidence.push(x.id+" -> "+ref);
  }
  const groups = new Map<string,SettlementObservation[]>();
  for (const x of observations) groups.set(x.batchId,[...(groups.get(x.batchId)||[]),x]);
  const batches = [...groups].sort(([a],[b])=>a.localeCompare(b)).map(([batchId,xs]):SettlementBatchResult=>{
    const exceptions: string[]=[];
    const charge=total(xs,"charge"), refund=total(xs,"refund"),fee=total(xs,"processor_fee");
    const adjustment=total(xs,"processor_adjustment"),taxWithheld=total(xs,"tax_withheld");
    const payout=total(xs,"payout"),bank=total(xs,"bank_deposit");
    // Adjustments are deductions in R1; signed adjustments require a later schema.
    const expected=charge-refund-fee-adjustment-taxWithheld;
    if (expected<0) exceptions.push("Negative expected payout");
    if (xs.some(x=>x.kind==="payout" && !x.linksTo.some(id=>byId.get(id)?.kind==="charge")))
      exceptions.push("Payout missing charge evidence link");
    if (xs.some(x=>x.kind==="bank_deposit" && !x.linksTo.some(id=>byId.get(id)?.kind==="payout")))
      exceptions.push("Deposit missing payout evidence link");
    if (xs.some(x=>x.linksTo.some(id=>!byId.has(id)||byId.get(id)?.batchId!==batchId)))
      exceptions.push("Unresolved or cross-batch evidence link");
    const hasPayout=xs.some(x=>x.kind==="payout");
    const hasBank=xs.some(x=>x.kind==="bank_deposit");
    if (hasPayout && expected!==payout) exceptions.push("Processor payout variance");
    if (hasBank && payout!==bank) exceptions.push("Bank deposit variance");
    const status=exceptions.length?"exception":!hasPayout||!hasBank?"pending":"matched";
    return {batchId,chargeCents:charge,refundCents:refund,feeCents:fee,adjustmentCents:adjustment,
      taxWithheldCents:taxWithheld,expectedPayoutCents:expected,actualPayoutCents:payout,bankDepositCents:bank,
      payoutVarianceCents:expected-payout,bankVarianceCents:payout-bank,status,exceptions};
  });
  return {tenantId,batches,unmatchedEvidence};
}
