export type CostEvidenceKind = 'RECEIPT' | 'RESERVATION' | 'TARIFF' | 'ESTIMATE';

export interface CostEvidenceBase {
  id: string;
  kind: CostEvidenceKind;
  label: string;
  currency: string;
  source: string;
  observedAtUtc: string;
  evidenceId?: string;
  note?: string;
}

export interface ReceiptCostEvidence extends CostEvidenceBase {
  kind: 'RECEIPT';
  amount: number;
}

export interface ReservationCostEvidence extends CostEvidenceBase {
  kind: 'RESERVATION';
  amount: number;
}

export interface TariffCostEvidence extends CostEvidenceBase {
  kind: 'TARIFF';
  unitRate: number;
  quantity: number;
  unit?: string;
}

export interface EstimateCostEvidence extends CostEvidenceBase {
  kind: 'ESTIMATE';
  minAmount: number;
  maxAmount: number;
}

export type CostEvidence = ReceiptCostEvidence | ReservationCostEvidence | TariffCostEvidence | EstimateCostEvidence;

export interface CostSummary {
  currency: string;
  actualPaid: number;
  bookedCommitted: number;
  tariffKnown: number;
  estimateMin: number;
  estimateMax: number;
}

export function summarizeCosts(items: readonly CostEvidence[]): CostSummary[] {
  const byCurrency = new Map<string, CostSummary>();
  const get = (currency: string) => {
    const existing = byCurrency.get(currency);
    if (existing) return existing;
    const summary: CostSummary = {currency, actualPaid:0, bookedCommitted:0, tariffKnown:0, estimateMin:0, estimateMax:0};
    byCurrency.set(currency, summary);
    return summary;
  };
  for (const item of items) {
    const s = get(item.currency);
    if (item.kind === 'RECEIPT') s.actualPaid += item.amount;
    else if (item.kind === 'RESERVATION') s.bookedCommitted += item.amount;
    else if (item.kind === 'TARIFF') s.tariffKnown += item.unitRate * item.quantity;
    else { s.estimateMin += item.minAmount; s.estimateMax += item.maxAmount; }
  }
  return [...byCurrency.values()];
}
