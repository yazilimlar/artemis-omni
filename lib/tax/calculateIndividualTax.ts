import type { TaxAmount, TaxEntity } from "@/types/tax-architecture";

const sumAmounts = (items: TaxAmount[]): number =>
  items.reduce((sum, item) => sum + item.amount, 0);

export type IndividualTaxResult = {
  grossIncome: number;
  deductions: number;
  taxableBase: number;
  totalTax: number;
  totalPayments: number;
  remainingDueOrRefund: number; // positive = still due, negative = refund
  cashAfterTax: number;
};

export function calculateIndividualTax(entity: TaxEntity): IndividualTaxResult {
  const grossIncome = sumAmounts(entity.income);
  const deductions = sumAmounts(entity.deductions);
  const taxableBase = Math.max(grossIncome - deductions, 0);
  const totalTax = sumAmounts(entity.taxes);
  const totalPayments = sumAmounts(entity.payments);

  return {
    grossIncome,
    deductions,
    taxableBase,
    totalTax,
    totalPayments,
    remainingDueOrRefund: totalTax - totalPayments,
    cashAfterTax: entity.cashAfterTax,
  };
}
