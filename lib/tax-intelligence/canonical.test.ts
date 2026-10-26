import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { settle, type AllocationEdge, type EvidenceNode, type NodeKind } from "./canonical";

// Synthetic fixtures only. M2.7.1/H1 + amendment A1: every fixture digest is
// COMPUTED — SHA-256 over the canonical sorted-key JSON of exactly
// {amountCents,currency,kind,occurredOn,providerEventKey,revision,source,
// tenantId} — and the kernel recomputes and verifies it for every node
// before dedupe/settlement; mismatch throws DIGEST_MISMATCH. Mutation
// helpers (n via its patch argument, mut) always regenerate digests;
// only explicitly labelled tampering tests retain a stale digest.
type DigestFields = {
  amountCents: number; currency: string; kind: string; occurredOn: string;
  providerEventKey: string; revision: number; source: string; tenantId: string;
};
const computeDigest = (f: DigestFields): string =>
  createHash("sha256")
    .update(JSON.stringify({
      amountCents: f.amountCents, currency: f.currency, kind: f.kind,
      occurredOn: f.occurredOn, providerEventKey: f.providerEventKey,
      revision: f.revision, source: f.source, tenantId: f.tenantId,
    }), "utf8")
    .digest("hex");

const T = "tenant-a";
type P = Partial<EvidenceNode> & { kind: NodeKind; amountCents: number };
const n = (id: string, p: P): EvidenceNode => {
  const { digestSha256, ...rest } = p;
  const base = {
    id,
    tenantId: T,
    legalEntityId: null as string | null,
    source: "synthetic",
    providerEventKey: `evt-${id}`,
    revision: 1,
    occurredOn: "2026-01-15",
    currency: "USD" as const,
    ...rest,
  };
  return { ...base, digestSha256: digestSha256 ?? computeDigest(base) };
};
/** Fixture mutation helper: applies a patch and REGENERATES the digest. */
const mut = (nd: EvidenceNode, patch: Partial<EvidenceNode>): EvidenceNode => {
  const merged = { ...nd, ...patch };
  return { ...merged, digestSha256: patch.digestSha256 ?? computeDigest(merged) };
};
const e = (id: string, fromId: string, toId: string, relation: AllocationEdge["relation"], amountCents: number, evidenceRef?: string): AllocationEdge => ({
  id, tenantId: T, fromId, toId, relation, amountCents, evidenceRef: evidenceRef ?? `stmt:${id}`,
});
/** Amendment A2 grounded payout_to_bank reference, from endpoint nodes. */
const gref = (payout: EvidenceNode, bank: EvidenceNode): string =>
  `bank-match:${payout.providerEventKey}:${bank.providerEventKey}`;
/** Grounded reference for fixtures whose nodes use the default evt-<id> keys. */
const bref = (payoutId: string, bankId: string): string => `bank-match:evt-${payoutId}:evt-${bankId}`;
const codes = (r: ReturnType<typeof settle>) => r.exceptions.map((x) => x.code);

/** T06 base fixture: merch 10000 + tax 700 - fee 300, payout 10400, no bank. */
const t06 = () => ({
  nodes: [
    n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
    n("tax", { kind: "charge_tax_collected", amountCents: 700 }),
    n("fee", { kind: "fee", amountCents: 300 }),
    n("payout", { kind: "payout", amountCents: 10400 }),
  ],
  edges: [
    e("e-m", "merch", "payout", "charge_to_payout", 10000),
    e("e-t", "tax", "payout", "charge_to_payout", 700),
    e("e-f", "fee", "payout", "fee_to_payout", 300),
  ],
});

describe("M2.7 canonical kernel — acceptance T01-T26 (schema R2)", () => {
  it("T01 orphan wash: unlinked refund never enters the identity and cannot match", () => {
    const f = t06();
    f.nodes.push(n("orphan-refund", { kind: "refund_merchandise", amountCents: 10400 }));
    const r = settle(T, f.nodes, f.edges);
    expect(r.status).not.toBe("matched");
    expect(r.status).toBe("exception");
    expect(r.expectedPayoutCents).toBe(10400);
    const un = r.exceptions.find((x) => x.code === "UNEXPLAINED_NODE");
    expect(un?.nodeIds).toContain("orphan-refund");
  });

  it("T02 wrong-charge link: payout allocated beyond the wrong charge's capacity is an exception", () => {
    const nodes = [
      n("wrong-charge", { kind: "charge_merchandise", amountCents: 5000 }),
      n("true-charge", { kind: "charge_merchandise", amountCents: 10400 }),
      n("payout", { kind: "payout", amountCents: 10400 }),
    ];
    const edges = [e("e-wrong", "wrong-charge", "payout", "charge_to_payout", 10400)];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("exception");
    expect(codes(r)).toContain("OVER_ALLOCATION");
  });

  it("T03 one charge split 4000 + 6000 across two payouts conserves and matches", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("payout-a", { kind: "payout", amountCents: 4000 }),
      n("payout-b", { kind: "payout", amountCents: 6000 }),
      n("bank-a", { kind: "bank_deposit", amountCents: 4000 }),
      n("bank-b", { kind: "bank_deposit", amountCents: 6000 }),
    ];
    const edges = [
      e("e-a", "merch", "payout-a", "charge_to_payout", 4000),
      e("e-b", "merch", "payout-b", "charge_to_payout", 6000),
      e("e-ba", "payout-a", "bank-a", "payout_to_bank", 4000, bref("payout-a", "bank-a")),
      e("e-bb", "payout-b", "bank-b", "payout_to_bank", 6000, bref("payout-b", "bank-b")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("matched");
    expect(r.remainderByNodeId["merch"]).toBe(0);
    expect(r.expectedPayoutCents).toBe(10000);
    expect(r.observedPayoutCents).toBe(10000);
    expect(r.observedDepositCents).toBe(10000);
  });

  it("T04 partial allocation 4000 of 10000 is pending with remainder 6000", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("payout", { kind: "payout", amountCents: 4000 }),
    ];
    const edges = [e("e-p", "merch", "payout", "charge_to_payout", 4000)];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("pending");
    expect(r.remainderByNodeId["merch"]).toBe(6000);
  });

  it("T05 seller credit increases and seller debit decreases expected payout by exactly 1000 across runs", () => {
    const withAdj = (kind: "seller_credit" | "seller_debit", rel: "credit_to_payout" | "debit_to_payout") => {
      const f = t06();
      f.nodes.push(n("adj", { kind, amountCents: 500 }));
      f.edges.push(e("e-adj", "adj", "payout", rel, 500));
      return settle(T, f.nodes, f.edges).expectedPayoutCents;
    };
    const credit = withAdj("seller_credit", "credit_to_payout");
    const debit = withAdj("seller_debit", "debit_to_payout");
    expect(credit).toBe(10900);
    expect(debit).toBe(9900);
    expect(credit - debit).toBe(1000);
  });

  it("T06 cash oracle A: 10000 + 700 - 300 not withheld = expected payout 10400", () => {
    const f = t06();
    const r = settle(T, f.nodes, f.edges);
    expect(r.expectedPayoutCents).toBe(10400);
    expect(r.observedPayoutCents).toBe(10400);
  });

  it("T07 cash oracle B: same + tax_withheld 700 = expected payout 9700", () => {
    const f = t06();
    f.nodes.push(n("withheld", { kind: "tax_withheld", amountCents: 700 }));
    f.edges.push(e("e-w", "withheld", "payout", "withheld_to_payout", 700));
    f.nodes = f.nodes.map((x) => (x.id === "payout" ? mut(x, { amountCents: 9700 }) : x));
    const r = settle(T, f.nodes, f.edges);
    expect(r.expectedPayoutCents).toBe(9700);
    expect(r.observedPayoutCents).toBe(9700);
  });

  it("T08 oracle rejection: kernel result for T06 inputs is never R1's 9000", () => {
    const f = t06();
    const r = settle(T, f.nodes, f.edges);
    // R1 baseline computed gross - fees - tax = 10000 - 300 - 700 = 9000 by
    // subtracting collected tax as if withheld. That is the rejected oracle.
    expect(10000 - 300 - 700).toBe(9000);
    expect(r.expectedPayoutCents).not.toBe(9000);
    expect(r.expectedPayoutCents).toBe(10400);
  });

  it("T09 ERP amount mismatch is an exception (ERP_AMOUNT_MISMATCH)", () => {
    const nodes = [
      n("order", { kind: "order", amountCents: 10000 }),
      n("erp", { kind: "erp_invoice", amountCents: 9000 }),
    ];
    const edges = [e("e-erp", "erp", "order", "erp_to_order", 9000)];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("exception");
    expect(codes(r)).toContain("ERP_AMOUNT_MISMATCH");
  });

  it("T10a illegal relation/kind pair is a coded exception, not a throw", () => {
    const nodes = [
      n("fee", { kind: "fee", amountCents: 300 }),
      n("bank", { kind: "bank_deposit", amountCents: 300 }),
    ];
    const edges = [e("e-bad", "fee", "bank", "payout_to_bank", 300)];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("exception");
    const ill = r.exceptions.find((x) => x.code === "ILLEGAL_EDGE");
    expect(ill?.edgeIds).toContain("e-bad");
  });

  it("T10b cycle among cash-consumption edges is a coded exception, not a throw", () => {
    const nodes = [
      n("payout-a", { kind: "payout", amountCents: 1000 }),
      n("payout-b", { kind: "payout", amountCents: 1000 }),
    ];
    const edges = [
      e("e-ab", "payout-a", "payout-b", "payout_to_bank", 1000),
      e("e-ba", "payout-b", "payout-a", "payout_to_bank", 1000),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("exception");
    const cyc = r.exceptions.find((x) => x.code === "CASH_CYCLE");
    expect(cyc).toBeDefined();
    expect(cyc?.edgeIds).toEqual(expect.arrayContaining(["e-ab", "e-ba"]));
  });

  it("T10c zero, negative, and unsafe edge amounts throw (malformed input, C3)", () => {
    const f = t06();
    expect(() => settle(T, f.nodes, [e("e-zero", "merch", "payout", "charge_to_payout", 0)])).toThrow();
    expect(() => settle(T, f.nodes, [e("e-neg", "merch", "payout", "charge_to_payout", -5)])).toThrow();
    expect(() => settle(T, f.nodes, [e("e-unsafe", "merch", "payout", "charge_to_payout", 2 ** 53)])).toThrow();
  });

  it("T11 replay of the same provider key + revision + digest is deduped", () => {
    const f = t06();
    const single = settle(T, f.nodes, f.edges);
    const doubled = settle(T, [...f.nodes, ...f.nodes], f.edges);
    expect(doubled.expectedPayoutCents).toBe(single.expectedPayoutCents);
    expect(doubled.observedPayoutCents).toBe(single.observedPayoutCents);
    expect(doubled.observedDepositCents).toBe(single.observedDepositCents);
    expect(doubled.status).toBe(single.status);
  });

  it("T12 same provider key + revision with a different valid payload throws DIGEST_CONFLICT", () => {
    const a = n("node-a", { kind: "charge_merchandise", amountCents: 100 });
    // Same key+revision as a, different amount (different internally
    // consistent payload, digest regenerated by mut) -> conflict, not mismatch.
    const b = mut(n("node-b", { kind: "charge_merchandise", amountCents: 200 }), { providerEventKey: a.providerEventKey, source: a.source });
    expect(b.digestSha256).not.toBe(a.digestSha256);
    expect(() => settle(T, [a, b], [])).toThrow(/DIGEST_CONFLICT/);
  });

  it("T13 impossible calendar date 2026-02-31 throws (strict round-trip)", () => {
    const bad = n("bad-date", { kind: "charge_merchandise", amountCents: 100, occurredOn: "2026-02-31" });
    expect(() => settle(T, [bad], [])).toThrow();
    const badMonth = n("bad-month", { kind: "charge_merchandise", amountCents: 100, occurredOn: "2026-13-01" });
    expect(() => settle(T, [badMonth], [])).toThrow();
  });

  it("T14 unsafe sum across two MAX_SAFE_INTEGER charges throws", () => {
    const M = Number.MAX_SAFE_INTEGER;
    const nodes = [
      n("big-a", { kind: "charge_merchandise", amountCents: M }),
      n("big-b", { kind: "charge_merchandise", amountCents: M }),
      n("payout", { kind: "payout", amountCents: M }),
    ];
    const edges = [
      e("e-a", "big-a", "payout", "charge_to_payout", M),
      e("e-b", "big-b", "payout", "charge_to_payout", M),
    ];
    expect(() => settle(T, nodes, edges)).toThrow();
  });

  it("T15 non-USD currency throws", () => {
    const eur = n("eur", { kind: "charge_merchandise", amountCents: 100, currency: "EUR" as EvidenceNode["currency"] });
    expect(() => settle(T, [eur], [])).toThrow();
  });

  it("T16 cross-tenant node throws; cross-tenant edge throws", () => {
    const foreign = n("foreign", { kind: "charge_merchandise", amountCents: 100, tenantId: "tenant-b" });
    expect(() => settle(T, [foreign], [])).toThrow(/Cross-tenant/);
    const f = t06();
    const foreignEdge = { ...e("e-x", "merch", "payout", "charge_to_payout", 100), tenantId: "tenant-b" };
    expect(() => settle(T, f.nodes, [foreignEdge])).toThrow(/Cross-tenant/);
  });

  it("T17 zero-only scope can never be matched (ZERO_ONLY_MATCH)", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 0 }),
      n("payout", { kind: "payout", amountCents: 0 }),
      n("bank", { kind: "bank_deposit", amountCents: 0 }),
    ];
    // NOTE: literal zero-amount edges would throw under C3, so the edges
    // present here carry 1 cent; the zero-only rule is asserted on node scope.
    const edges = [
      e("e-z1", "merch", "payout", "charge_to_payout", 1),
      e("e-z2", "payout", "bank", "payout_to_bank", 1, bref("payout", "bank")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).not.toBe("matched");
    expect(codes(r)).toContain("ZERO_ONLY_MATCH");
  });

  it("T18 payout observed without any bank deposit is pending, deposit not fabricated", () => {
    const f = t06();
    const r = settle(T, f.nodes, f.edges);
    expect(r.status).toBe("pending");
    expect(r.observedDepositCents).toBe(0);
  });

  it("T19 refunds reduce expected payout by exactly 1070 and refunded tax is explicit", () => {
    const f = t06();
    f.nodes.push(n("refund-m", { kind: "refund_merchandise", amountCents: 1000 }));
    f.nodes.push(n("refund-t", { kind: "refund_tax", amountCents: 70 }));
    f.edges.push(e("e-rm", "refund-m", "payout", "refund_to_payout", 1000));
    f.edges.push(e("e-rt", "refund-t", "payout", "refund_to_payout", 70));
    const r = settle(T, f.nodes, f.edges);
    expect(r.expectedPayoutCents).toBe(10400 - 1070);
    expect(r.taxArithmetic.refundedTaxCents).toBe(70);
    expect(r.taxArithmetic.collectedCents).toBe(700);
  });

  it("T20 tax arithmetic positions and no income/liability field anywhere on the result", () => {
    const f1 = t06();
    f1.nodes.push(n("withheld", { kind: "tax_withheld", amountCents: 700 }));
    f1.edges.push(e("e-w", "withheld", "payout", "withheld_to_payout", 700));
    const r1 = settle(T, f1.nodes, f1.edges);
    expect(r1.taxArithmetic.positionCents).toBe(0);
    const f2 = t06();
    f2.nodes = f2.nodes.filter((x) => x.id !== "fee");
    f2.edges = f2.edges.filter((x) => x.id !== "e-f");
    f2.nodes = f2.nodes.map((x) => (x.id === "payout" ? mut(x, { amountCents: 10700 }) : x));
    const r2 = settle(T, f2.nodes, f2.edges);
    expect(r2.taxArithmetic.positionCents).toBe(700);
    const keys: string[] = [];
    const walk = (v: unknown) => {
      if (v && typeof v === "object") for (const [k, val] of Object.entries(v)) { keys.push(k); walk(val); }
    };
    walk(r1); walk(r2);
    expect(keys.some((k) => /taxableIncome|liability/i.test(k))).toBe(false);
    expect(keys).toContain("taxArithmetic");
  });

  it("T21 C1 evidence edges consume nothing: order tied, payout identity unchanged", () => {
    const nodes = [
      n("order", { kind: "order", amountCents: 10000 }),
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("tax", { kind: "charge_tax_collected", amountCents: 700 }),
      n("fee", { kind: "fee", amountCents: 300 }),
      n("payout", { kind: "payout", amountCents: 10400 }),
      n("bank", { kind: "bank_deposit", amountCents: 10400 }),
    ];
    const edges = [
      e("e-oc", "order", "merch", "order_to_charge", 10000),
      e("e-ot", "order", "tax", "order_to_charge_tax", 700),
      e("e-m", "merch", "payout", "charge_to_payout", 10000),
      e("e-t", "tax", "payout", "charge_to_payout", 700),
      e("e-f", "fee", "payout", "fee_to_payout", 300),
      e("e-b", "payout", "bank", "payout_to_bank", 10400, bref("payout", "bank")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("matched");
    expect(r.expectedPayoutCents).toBe(10400);
    expect(codes(r)).not.toContain("OVER_ALLOCATION");
    expect(r.remainderByNodeId["merch"]).toBe(0);
    // Variant: tax evidence edge asserted alongside the full merchandise edge
    // must not draw on the order's merchandise capacity (no false 10700 > 10000).
    const r2 = settle(T, nodes, [...edges].reverse());
    expect(r2.status).toBe("matched");
    expect(codes(r2)).not.toContain("OVER_ALLOCATION");
  });

  it("T22 C2 withheld + remittance edge: payout 9700 (not 9000), no over-allocation, tax position 0", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("tax", { kind: "charge_tax_collected", amountCents: 700 }),
      n("fee", { kind: "fee", amountCents: 300 }),
      n("withheld", { kind: "tax_withheld", amountCents: 700 }),
      n("remitted", { kind: "tax_remitted", amountCents: 700 }),
      n("payout", { kind: "payout", amountCents: 9700 }),
      n("bank", { kind: "bank_deposit", amountCents: 9700 }),
    ];
    const edges = [
      e("e-m", "merch", "payout", "charge_to_payout", 10000),
      e("e-t", "tax", "payout", "charge_to_payout", 700),
      e("e-f", "fee", "payout", "fee_to_payout", 300),
      e("e-w", "withheld", "payout", "withheld_to_payout", 700),
      e("e-wr", "withheld", "remitted", "withheld_to_remittance", 700),
      e("e-b", "payout", "bank", "payout_to_bank", 9700, bref("payout", "bank")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.expectedPayoutCents).toBe(9700);
    expect(codes(r)).not.toContain("OVER_ALLOCATION");
    expect(r.taxArithmetic.withheldCents).toBe(700);
    expect(r.taxArithmetic.directlyRemittedCents).toBe(0);
    expect(r.taxArithmetic.positionCents).toBe(0);
    expect(r.status).toBe("matched");
  });

  it("T23 C2 pathway: undistinguished remittance is TAX_PATHWAY_UNKNOWN with null position; direct remittance computes", () => {
    const base = t06();
    base.nodes.push(n("withheld", { kind: "tax_withheld", amountCents: 700 }));
    base.edges.push(e("e-w", "withheld", "payout", "withheld_to_payout", 700));
    base.nodes.push(n("remitted", { kind: "tax_remitted", amountCents: 700 }));
    const r = settle(T, base.nodes, base.edges);
    expect(r.status).toBe("exception");
    expect(codes(r)).toContain("TAX_PATHWAY_UNKNOWN");
    expect(r.taxArithmetic.pathwayUnknown).toBe(true);
    expect(r.taxArithmetic.positionCents).toBeNull();
    // Contrast: no withheld in scope + explicit direct-remittance provenance.
    const f2 = t06();
    f2.nodes.push(n("remitted-direct", { kind: "tax_remitted", amountCents: 200, metadataRef: "direct-remittance:stmt-9" }));
    const r2 = settle(T, f2.nodes, f2.edges);
    expect(r2.taxArithmetic.pathwayUnknown).toBe(false);
    expect(r2.taxArithmetic.directlyRemittedCents).toBe(200);
    expect(r2.taxArithmetic.positionCents).toBe(700 - 200);
  });

  it("T24 C4 cross-set misattribution: aggregate balance must not certify a match", () => {
    const nodes = [
      n("merch-a", { kind: "charge_merchandise", amountCents: 10000 }),
      n("tax-a", { kind: "charge_tax_collected", amountCents: 700 }),
      n("merch-b", { kind: "charge_merchandise", amountCents: 10000 }),
      n("tax-b", { kind: "charge_tax_collected", amountCents: 700 }),
      n("payout", { kind: "payout", amountCents: 10400 }),
      n("bank", { kind: "bank_deposit", amountCents: 10400 }),
    ];
    nodes.push(n("fee-b", { kind: "fee", amountCents: 300 }));
    const edges = [
      e("e-mb", "merch-b", "payout", "charge_to_payout", 10000),
      e("e-tb", "tax-b", "payout", "charge_to_payout", 700),
      e("e-fb", "fee-b", "payout", "fee_to_payout", 300),
      // Bank edge is grounded (A2) so the only failure here is the C4
      // misattribution itself, not deposit attribution.
      e("e-b", "payout", "bank", "payout_to_bank", 10400, bref("payout", "bank")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).not.toBe("matched");
    expect(r.remainderByNodeId["merch-a"]).toBe(10000);
    expect(r.remainderByNodeId["tax-a"]).toBe(700);
  });

  it("T25a C5 two revisions without supersedesRevision throws CONFLICTING_REVISION", () => {
    const rev1 = n("rev-node", { kind: "charge_merchandise", amountCents: 5000 });
    const rev2 = mut(n("rev-node-2", { kind: "charge_merchandise", amountCents: 10000 }), { providerEventKey: rev1.providerEventKey, source: rev1.source, revision: 2 });
    expect(() => settle(T, [rev1, rev2], [])).toThrow(/CONFLICTING_REVISION/);
  });

  it("T25b C5 explicit supersession: only revision 2 settles", () => {
    const rev1 = n("rev-node", { kind: "charge_merchandise", amountCents: 5000 });
    const rev2 = mut(n("rev-node-2", { kind: "charge_merchandise", amountCents: 10000 }), { providerEventKey: rev1.providerEventKey, source: rev1.source, revision: 2, supersedesRevision: 1 });
    const payout = n("payout", { kind: "payout", amountCents: 10000 });
    const edges = [e("e-r2", "rev-node-2", "payout", "charge_to_payout", 10000)];
    const both = settle(T, [rev1, rev2, payout], edges);
    const only2 = settle(T, [rev2, payout], edges);
    expect(both.expectedPayoutCents).toBe(only2.expectedPayoutCents);
    expect(both.observedPayoutCents).toBe(only2.observedPayoutCents);
    expect(both.expectedPayoutCents).toBe(10000);
  });

  it("T25c C5 distinct provider keys are never merged, even with identical amounts", () => {
    // Distinct providerEventKeys -> distinct computed digests; identity is
    // keyed on (source, providerEventKey, revision), never on digest alone,
    // so two equal-amount events under different keys both settle.
    const a = n("evt-a", { kind: "charge_merchandise", amountCents: 4000 });
    const b = n("evt-b", { kind: "charge_merchandise", amountCents: 4000 });
    const payout = n("payout", { kind: "payout", amountCents: 8000 });
    const edges = [
      e("e-a", "evt-a", "payout", "charge_to_payout", 4000),
      e("e-b", "evt-b", "payout", "charge_to_payout", 4000),
    ];
    const r = settle(T, [a, b, payout], edges);
    expect(r.expectedPayoutCents).toBe(8000);
    expect(r.observedPayoutCents).toBe(8000);
  });

  it("T26 C5/H1 digest verification: kernel recomputes canonical SHA-256; tampering with retained digest throws DIGEST_MISMATCH", () => {
    const good = n("canon", { kind: "charge_merchandise", amountCents: 2500, providerEventKey: "evt-canonical" });
    expect(good.digestSha256).toMatch(/^[0-9a-f]{64}$/);
    // The fixture digest is exactly the canonical sorted-key SHA-256.
    expect(good.digestSha256).toBe(computeDigest(good));
    expect(() => settle(T, [good], [])).not.toThrow();
    // Intentional tampering (labelled): payload field mutated, original
    // digest RETAINED (no regeneration). Each must throw DIGEST_MISMATCH,
    // distinct from DIGEST_CONFLICT.
    const tampers: EvidenceNode[] = [
      { ...good, amountCents: 9999 },
      { ...good, occurredOn: "2026-01-16" },
      { ...good, providerEventKey: "evt-forged" },
      { ...good, kind: "fee" },
      { ...good, tenantId: "tenant-b" },
    ];
    for (const nd of tampers) expect(() => settle(T, [nd], [])).toThrow(/DIGEST_MISMATCH/);
    // Malformed digest format remains a throw (format validated first).
    expect(() => settle(T, [{ ...good, digestSha256: "XYZ-not-hex" }], [])).toThrow();
    expect(() => settle(T, [{ ...good, digestSha256: good.digestSha256.toUpperCase() }], [])).toThrow();
  });
});

describe("M2.7.1 hardening — H2 deposit attribution, H3 entity isolation, H4 runtime relations", () => {
  // Shared crossed-payouts fixture for H2: merch 10000 split over two 5000
  // payouts and two 5000 deposits, with custom provider keys.
  const h2nodes = () => [
    n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
    n("payout-1", { kind: "payout", amountCents: 5000, providerEventKey: "pay-001" }),
    n("payout-2", { kind: "payout", amountCents: 5000, providerEventKey: "pay-002" }),
    n("bank-1", { kind: "bank_deposit", amountCents: 5000, providerEventKey: "bank-001" }),
    n("bank-2", { kind: "bank_deposit", amountCents: 5000, providerEventKey: "bank-002" }),
  ];
  const h2edges = (nodes: EvidenceNode[], refFor: (p: EvidenceNode, b: EvidenceNode) => string) => {
    const byId = new Map(nodes.map((x) => [x.id, x]));
    const P = (id: string) => byId.get(id)!;
    return [
      e("e-m1", "merch", "payout-1", "charge_to_payout", 5000),
      e("e-m2", "merch", "payout-2", "charge_to_payout", 5000),
      // Crossed mapping: payout-1 -> bank-2, payout-2 -> bank-1.
      e("e-x1", "payout-1", "bank-2", "payout_to_bank", 5000, refFor(P("payout-1"), P("bank-2"))),
      e("e-x2", "payout-2", "bank-1", "payout_to_bank", 5000, refFor(P("payout-2"), P("bank-1"))),
    ];
  };

  it("H2a crossed payouts/deposits with grounded refs are matched (crossing alone is not a defect)", () => {
    const nodes = h2nodes();
    const r = settle(T, nodes, h2edges(nodes, (p, b) => gref(p, b)));
    expect(codes(r)).not.toContain("DEPOSIT_ATTRIBUTION_UNVERIFIED");
    expect(r.status).toBe("matched");
    expect(r.observedPayoutCents).toBe(10000);
    expect(r.observedDepositCents).toBe(10000);
  });

  it("H2b crossed payouts/deposits with wrong refs are not matched (DEPOSIT_ATTRIBUTION_UNVERIFIED)", () => {
    const nodes = h2nodes();
    // Wrong references: each crossed edge carries the ref of the STRAIGHT
    // pairing, not of its actual endpoints.
    const r = settle(T, nodes, h2edges(nodes, (p, b) => `bank-match:${p.providerEventKey}:${p.providerEventKey.replace("pay", "bank")}`));
    expect(r.status).not.toBe("matched");
    const ex = r.exceptions.filter((x) => x.code === "DEPOSIT_ATTRIBUTION_UNVERIFIED");
    expect(ex.flatMap((x) => x.edgeIds)).toEqual(expect.arrayContaining(["e-x1", "e-x2"]));
  });

  it("H2c a duplicated reference cannot ground a second payout/deposit pair", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("payout-1", { kind: "payout", amountCents: 5000, providerEventKey: "pay-001" }),
      n("payout-2", { kind: "payout", amountCents: 5000, providerEventKey: "pay-002" }),
      n("bank-1", { kind: "bank_deposit", amountCents: 5000, providerEventKey: "bank-001" }),
      n("bank-2", { kind: "bank_deposit", amountCents: 5000, providerEventKey: "bank-002" }),
    ];
    const byId = new Map(nodes.map((x) => [x.id, x]));
    const dup = gref(byId.get("payout-1")!, byId.get("bank-1")!);
    const edges = [
      e("e-m1", "merch", "payout-1", "charge_to_payout", 5000),
      e("e-m2", "merch", "payout-2", "charge_to_payout", 5000),
      e("e-d1", "payout-1", "bank-1", "payout_to_bank", 5000, dup),
      // Same reference string duplicated onto a different endpoint pair.
      e("e-d2", "payout-2", "bank-2", "payout_to_bank", 5000, dup),
    ];
    const r = settle(T, nodes, edges);
    expect(r.status).not.toBe("matched");
    const ex = r.exceptions.filter((x) => x.code === "DEPOSIT_ATTRIBUTION_UNVERIFIED");
    expect(ex.flatMap((x) => x.edgeIds)).toContain("e-d2");
    expect(ex.flatMap((x) => x.edgeIds)).not.toContain("e-d1");
  });

  it("H2d partial allocation with aggregate equality but one ungrounded edge is not matched", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000 }),
      n("payout", { kind: "payout", amountCents: 10000, providerEventKey: "pay-100" }),
      n("bank-1", { kind: "bank_deposit", amountCents: 6000, providerEventKey: "bank-601" }),
      n("bank-2", { kind: "bank_deposit", amountCents: 4000, providerEventKey: "bank-401" }),
    ];
    const byId = new Map(nodes.map((x) => [x.id, x]));
    const edges = [
      e("e-m", "merch", "payout", "charge_to_payout", 10000),
      e("e-g1", "payout", "bank-1", "payout_to_bank", 6000, gref(byId.get("payout")!, byId.get("bank-1")!)),
      e("e-u2", "payout", "bank-2", "payout_to_bank", 4000, "stmt:ungrounded"),
    ];
    const r = settle(T, nodes, edges);
    // Aggregate arithmetic is perfect (deposits total == payout)...
    expect(r.observedDepositCents).toBe(r.observedPayoutCents);
    // ...but arithmetic cannot certify attribution.
    expect(r.status).not.toBe("matched");
    const ex = r.exceptions.filter((x) => x.code === "DEPOSIT_ATTRIBUTION_UNVERIFIED");
    expect(ex.flatMap((x) => x.edgeIds)).toContain("e-u2");
    expect(ex.flatMap((x) => x.edgeIds)).not.toContain("e-g1");
  });

  it("H3a known/known differing legalEntityId endpoints: CROSS_ENTITY_ALLOCATION, edge excluded", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000, legalEntityId: "entity-1" }),
      n("payout", { kind: "payout", amountCents: 10000, legalEntityId: "entity-2" }),
    ];
    const edges = [e("e-xent", "merch", "payout", "charge_to_payout", 10000)];
    const r = settle(T, nodes, edges);
    expect(r.status).toBe("exception");
    const ex = r.exceptions.find((x) => x.code === "CROSS_ENTITY_ALLOCATION");
    expect(ex).toBeDefined();
    expect(ex?.edgeIds).toContain("e-xent");
    expect(ex?.nodeIds).toEqual(expect.arrayContaining(["merch", "payout"]));
    // Excluded from every computation: identity sees no components,
    // the charge's full amount remains unallocated.
    expect(r.expectedPayoutCents).toBe(0);
    expect(r.remainderByNodeId["merch"]).toBe(10000);
  });

  it("H3b UNKNOWN legal entity in scope: entityScope CONTAINS_UNKNOWN, matched stays arithmetic-only", () => {
    const f = t06(); // helper default: legalEntityId null (UNKNOWN) everywhere
    const r = settle(T, f.nodes, f.edges);
    expect(r.entityScope).toBe("CONTAINS_UNKNOWN");
  });

  it("H3c single known entity throughout: entityScope VERIFIED_SINGLE_ENTITY and a clean match", () => {
    const nodes = [
      n("merch", { kind: "charge_merchandise", amountCents: 10000, legalEntityId: "entity-1" }),
      n("tax", { kind: "charge_tax_collected", amountCents: 700, legalEntityId: "entity-1" }),
      n("fee", { kind: "fee", amountCents: 300, legalEntityId: "entity-1" }),
      n("payout", { kind: "payout", amountCents: 10400, legalEntityId: "entity-1" }),
      n("bank", { kind: "bank_deposit", amountCents: 10400, legalEntityId: "entity-1" }),
    ];
    const edges = [
      e("e-m", "merch", "payout", "charge_to_payout", 10000),
      e("e-t", "tax", "payout", "charge_to_payout", 700),
      e("e-f", "fee", "payout", "fee_to_payout", 300),
      e("e-b", "payout", "bank", "payout_to_bank", 10400, bref("payout", "bank")),
    ];
    const r = settle(T, nodes, edges);
    expect(r.entityScope).toBe("VERIFIED_SINGLE_ENTITY");
    expect(r.status).toBe("matched");
  });

  it("H4 unknown relation string at runtime: coded ILLEGAL_EDGE, excluded, no throw / no TypeError", () => {
    const f = t06();
    const bogus = { ...e("e-bogus", "merch", "payout", "charge_to_payout", 1), relation: "bogus_relation" as unknown as AllocationEdge["relation"] };
    let r: ReturnType<typeof settle> | undefined;
    expect(() => { r = settle(T, f.nodes, [...f.edges, bogus]); }).not.toThrow();
    expect(r!.status).toBe("exception");
    const ill = r!.exceptions.find((x) => x.code === "ILLEGAL_EDGE");
    expect(ill?.edgeIds).toContain("e-bogus");
    // Excluded from identity/conservation: T06 numbers are untouched.
    expect(r!.expectedPayoutCents).toBe(10400);
  });
});
