export type SourceKind = "squarespace" | "td_bank" | "prime_erp";
export type Money = { currency: "USD"; cents: number };
export type Observation = {
  id: string;
  tenantId: string;
  source: SourceKind;
  sourceId: string;
  kind: "order" | "charge" | "fee" | "sales_tax" | "payout" | "bank_deposit" | "erp_invoice" | "supplier_payment" | "refund";
  amount: Money;
  occurredAt: string;
  linksTo: string[];
};
export type Reconciliation = {
  tenantId: string;
  observations: Observation[];
  discrepancies: string[];
  orderGrossCents: number;
  processorFeesCents: number;
  salesTaxCents: number;
  netExpectedPayoutCents: number;
  observedPayoutCents: number;
  observedDepositsCents: number;
  payoutVarianceCents: number;
  bankVarianceCents: number;
  revenueEventCount: number;
};
const sum = (xs: Observation[], kind: Observation["kind"]) =>
  xs.filter(x => x.kind === kind).reduce((a, x) => a + x.amount.cents, 0);
/**
 * Synthetic-only deterministic vertical slice. Amounts are positive magnitudes.
 * Sales tax is excluded from expected merchant payout, not asserted as income.
 * Never infer a match from equal amounts alone; linksTo is an explicit evidence edge.
 */
export function reconcile(tenantId: string, input: Observation[]): Reconciliation {
  if (!tenantId || !input.length) throw new Error("Tenant and observations required");
  if (input.some(x => x.tenantId !== tenantId)) throw new Error("Cross-tenant observation");
  if (input.some(x => x.amount.currency !== "USD" || !Number.isSafeInteger(x.amount.cents) || x.amount.cents < 0))
    throw new Error("Invalid money");
  const ids = new Set<string>(), sourceKeys = new Set<string>();
  for (const x of input) {
    if (ids.has(x.id) || sourceKeys.has(x.source + ":" + x.sourceId)) throw new Error("Duplicate source observation");
    ids.add(x.id); sourceKeys.add(x.source + ":" + x.sourceId);
  }
  const discrepancies: string[] = [];
  for (const x of input) for (const link of x.linksTo) if (!ids.has(link)) discrepancies.push("Unresolved evidence edge: " + x.id + " -> " + link);
  const gross = sum(input,"order");
  const fees = sum(input,"fee");
  const tax = sum(input,"sales_tax");
  const refunds = sum(input,"refund");
  const expected = gross - fees - tax - refunds;
  const payouts = sum(input,"payout");
  const deposits = sum(input,"bank_deposit");
  if (expected < 0) discrepancies.push("Negative expected payout");
  if (expected !== payouts) discrepancies.push("Processor payout mismatch");
  if (payouts !== deposits) discrepancies.push("Bank deposit mismatch");
  if (input.some(x => x.kind === "bank_deposit" && !x.linksTo.some(id => input.some(y => y.id === id && y.kind === "payout"))))
    discrepancies.push("Bank deposit lacks explicit payout evidence link");
  return {tenantId,observations:input,discrepancies,orderGrossCents:gross,processorFeesCents:fees,
    salesTaxCents:tax,netExpectedPayoutCents:expected,observedPayoutCents:payouts,
    observedDepositsCents:deposits,payoutVarianceCents:expected-payouts,bankVarianceCents:payouts-deposits,
    revenueEventCount:input.filter(x=>x.kind==="order").length};
}
