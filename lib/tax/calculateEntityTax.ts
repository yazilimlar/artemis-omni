import type { TaxAmount, TaxEntity } from "@/types/tax-architecture";

const sumAmounts = (items: TaxAmount[]): number =>
  items.reduce((sum, item) => sum + item.amount, 0);

export type EntityTaxResult = {
  revenue: number;
  deductions: number;
  taxableBase: number;
  totalTax: number;
  totalPayments: number;
  remainingDueOrRefund: number;
  cashAfterTax: number;
};

export function calculateEntityTax(entity: TaxEntity): EntityTaxResult {
  const revenue = sumAmounts(entity.income);
  const deductions = sumAmounts(entity.deductions);
  const taxableBase = Math.max(revenue - deductions, 0);
  const totalTax = sumAmounts(entity.taxes);
  const totalPayments = sumAmounts(entity.payments);

  return {
    revenue,
    deductions,
    taxableBase,
    totalTax,
    totalPayments,
    remainingDueOrRefund: totalTax - totalPayments,
    cashAfterTax: entity.cashAfterTax,
  };
}
