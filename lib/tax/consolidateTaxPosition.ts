import {
  INTERNAL_FLOW_TYPES,
  type ConsolidatedTaxPosition,
  type TaxAmount,
  type TaxScenario,
} from "@/types/tax-architecture";

const sumAmounts = (items: TaxAmount[] | undefined): number =>
  items?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

/**
 * Reconcile the owner + entity into a single, non-double-counted position.
 *
 * Structural honesty rules:
 * - `externalIncome` counts each entity's income only to the extent it did NOT
 *   arrive as an internal transfer from another entity in the scenario. A salary
 *   or K-1 the owner receives from their own company is money that already
 *   existed as company revenue, so it is not new external money.
 * - `eliminatedInternalFlows` is the total of those owner<->entity transfers.
 * - tax, payments, and retained cash are simple sums across entities (they are
 *   already entity-specific, so no elimination is needed).
 */
export function consolidateTaxPosition(
  scenario: TaxScenario
): ConsolidatedTaxPosition {
  const entityIds = new Set(scenario.entities.map((e) => e.id));

  const totalTax = scenario.entities.reduce(
    (sum, entity) => sum + sumAmounts(entity.taxes),
    0
  );

  const totalPayments = scenario.entities.reduce(
    (sum, entity) => sum + sumAmounts(entity.payments),
    0
  );

  const externalIncome = scenario.entities.reduce((sum, entity) => {
    const entityIncome = sumAmounts(entity.income);
    const incomingInternalFlows = scenario.flows
      .filter(
        (flow) =>
          flow.toEntityId === entity.id &&
          entityIds.has(flow.fromEntityId) &&
          INTERNAL_FLOW_TYPES.includes(flow.flowType)
      )
      .reduce((flowSum, flow) => flowSum + flow.amount, 0);

    return sum + Math.max(entityIncome - incomingInternalFlows, 0);
  }, 0);

  const internalFlows = scenario.flows
    .filter(
      (flow) =>
        entityIds.has(flow.fromEntityId) &&
        entityIds.has(flow.toEntityId) &&
        INTERNAL_FLOW_TYPES.includes(flow.flowType)
    )
    .reduce((sum, flow) => sum + flow.amount, 0);

  // Cash paid to genuinely external parties (vendors/opex). Owner-compensation
  // that a company deducts (salary/guaranteed payments) is an INTERNAL transfer,
  // not money leaving the owner-group, so it is excluded here.
  const deductibleInternalComp = scenario.flows
    .filter(
      (flow) =>
        entityIds.has(flow.fromEntityId) &&
        entityIds.has(flow.toEntityId) &&
        (flow.flowType === "salary" || flow.flowType === "guaranteed_payment")
    )
    .reduce((sum, flow) => sum + flow.amount, 0);

  const businessEntityDeductions = scenario.entities
    .filter((entity) => entity.entityType !== "individual")
    .reduce((sum, entity) => sum + sumAmounts(entity.deductions), 0);

  const externalBusinessExpenses = Math.max(
    businessEntityDeductions - deductibleInternalComp,
    0
  );

  // Honest combined cash: new external money, less real outside spend, less all
  // tax. This deliberately does NOT sum each entity's cashAfterTax, which would
  // double-count the same dollars as they move owner<->entity.
  const combinedCashAfterTax =
    externalIncome - externalBusinessExpenses - totalTax;

  const confidencePercent =
    scenario.entities.reduce(
      (sum, entity) => sum + entity.confidencePercent,
      0
    ) / Math.max(scenario.entities.length, 1);

  return {
    externalIncome,
    internalFlows,
    eliminatedInternalFlows: internalFlows,
    externalBusinessExpenses,
    totalTax,
    totalPayments,
    combinedCashAfterTax,
    confidencePercent: Math.round(confidencePercent),
  };
}
