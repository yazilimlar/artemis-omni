// Artemis Tax Atlas — entity/flow data model.
// Fictional demo prototype. Not tax advice. See the on-page disclaimer.

export type EvidenceStatus =
  | "actual"
  | "estimated"
  | "assumption"
  | "missing_backup";

export type TaxEntityType =
  | "individual"
  | "single_member_llc"
  | "partnership"
  | "s_corp"
  | "c_corp"
  | "multi_member_llc";

export type TaxFlowType =
  | "salary"
  | "owner_draw"
  | "distribution"
  | "dividend"
  | "k1_pass_through"
  | "guaranteed_payment"
  | "payroll_tax"
  | "entity_tax"
  | "personal_tax"
  | "retained_cash"
  | "eliminated_internal_flow";

export type TaxJurisdiction = {
  country: string;
  state?: string;
  city?: string;
};

export type TaxAmount = {
  label: string;
  amount: number;
  evidenceStatus: EvidenceStatus;
  notes?: string;
};

export type TaxEntity = {
  id: string;
  name: string;
  entityType: TaxEntityType;
  jurisdiction: TaxJurisdiction;
  income: TaxAmount[];
  deductions: TaxAmount[];
  taxes: TaxAmount[];
  payments: TaxAmount[];
  cashAfterTax: number;
  confidencePercent: number;
};

export type TaxFlow = {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  label: string;
  flowType: TaxFlowType;
  amount: number;
  taxTreatment: string;
  evidenceStatus: EvidenceStatus;
  notes?: string;
};

export type EvidenceItem = {
  id: string;
  label: string;
  value: string;
  status: EvidenceStatus;
  source: string;
  notes?: string;
};

export type TaxScenario = {
  id: string;
  name: string;
  description: string;
  entities: TaxEntity[];
  flows: TaxFlow[];
  evidence: EvidenceItem[];
  assumptions: string[];
};

export type ConsolidatedTaxPosition = {
  externalIncome: number; // new money entering the owner-group (e.g. company revenue)
  internalFlows: number; // owner<->entity transfers (salary, K-1, distributions…)
  eliminatedInternalFlows: number; // = internalFlows, removed to avoid double counting
  externalBusinessExpenses: number; // cash paid to outside parties (vendors, opex)
  totalTax: number;
  totalPayments: number;
  combinedCashAfterTax: number; // externalIncome − externalBusinessExpenses − totalTax
  confidencePercent: number;
};

// Flow types that represent money moving *between* the owner and their own
// entity — internal transfers that must be eliminated in the consolidated view.
export const INTERNAL_FLOW_TYPES: TaxFlowType[] = [
  "salary",
  "owner_draw",
  "distribution",
  "dividend",
  "k1_pass_through",
  "guaranteed_payment",
];
