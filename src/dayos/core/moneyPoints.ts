import type { EvidenceAuthority } from './evidenceAuthority';

export type MoneyFlowDirection = 'INFLOW' | 'OUTFLOW';

export type FinancialRole =
  | 'BILLABLE_LABOR'
  | 'REIMBURSABLE_EXPENSE'
  | 'PROJECT_DIRECT_COST'
  | 'GENERAL_OVERHEAD'
  | 'PERSONAL_OUT_OF_POCKET'
  | 'UNEXPECTED_CONTINGENCY';

export type EconomicLifecycleState =
  | 'EARNED'
  | 'BILLED'
  | 'COLLECTED'
  | 'DISPUTED'
  | 'WRITTEN_OFF'
  | 'NOT_APPLICABLE';

export interface ProjectAllocationRef {
  projectId: string;
  projectCode?: string;
  costCode?: string;
  clientId?: string;
  clientName?: string;
}

export type MoneyDerivation =
  | {
      kind: 'LABOR';
      hours: number;
      ratePerHourMinor: number;
      rateCardRef: string;
      timeRecordRef: string;
    }
  | {
      kind: 'EXPENSE';
      expenseAmountMinor: number;
      receiptEvidenceRef?: string;
    }
  | {
      kind: 'FIXED_FEE';
      agreementRef: string;
    }
  | {
      kind: 'ADJUSTMENT';
      reason: string;
      sourceRef: string;
    };

export interface EconomicStateTransition {
  id: string;
  from?: EconomicLifecycleState;
  to: EconomicLifecycleState;
  occurredAtSec: number;
  authority: EvidenceAuthority;
  source: string;
  confidence: number;
  evidenceRefs?: string[];
}

/**
 * DayOS economic record contract.
 *
 * "Money Point" is the user-facing concept. This record is the underlying
 * auditable economic object. Lifecycle changes are appended to stateHistory;
 * aggregators should use currentState and must never sum lifecycle snapshots
 * as if EARNED, BILLED, and COLLECTED were independent revenue events.
 *
 * Amounts are stored in integer minor units (for example, USD cents) to avoid
 * floating-point accounting errors. This module intentionally contains no
 * aggregation or inference logic yet; it freezes the contract while live
 * calendar/Flight Deck integration is completed.
 */
export interface MoneyPointRecord {
  id: string;
  operatingEventRef?: string;

  direction: MoneyFlowDirection;
  amountMinor: number;
  currency: string;
  role: FinancialRole;
  derivation: MoneyDerivation;

  projectRef?: ProjectAllocationRef;

  paymentAccountRef?: string;
  payerRef?: string;
  payeeRef?: string;

  isBillable: boolean;
  isReimbursable: boolean;
  reimbursementStatus?: 'NOT_APPLICABLE' | 'OUTSTANDING' | 'SUBMITTED' | 'PAID' | 'DISPUTED';

  currentState: EconomicLifecycleState;
  stateHistory: EconomicStateTransition[];

  authority: EvidenceAuthority;
  confidence: number;
  source: string;
  evidenceRefs?: string[];

  recordedAtSec: number;
  effectiveAtSec: number;
}
