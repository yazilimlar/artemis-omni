import type { TaxScenario } from "@/types/tax-architecture";

// FICTIONAL demo data only. Numbers are illustrative and internally consistent
// for visualization — they are not a real return and not tax advice.
export const taxDemoScenarios: TaxScenario[] = [
  {
    id: "owner-scorp-demo",
    name: "Owner + S Corporation",
    description:
      "A fictional owner/operator running an S corporation: company revenue flows into expenses, owner salary, and pass-through income, then into personal and entity tax and retained cash.",
    entities: [
      {
        id: "individual-owner",
        name: "Individual Owner",
        entityType: "individual",
        jurisdiction: { country: "US", state: "NY" },
        income: [
          {
            label: "Owner salary (W-2)",
            amount: 120000,
            evidenceStatus: "assumption",
            notes: "Demo salary; internal transfer from the company.",
          },
          {
            label: "Pass-through income (K-1)",
            amount: 130000,
            evidenceStatus: "assumption",
            notes: "Simplified S-corp pass-through of remaining profit.",
          },
        ],
        deductions: [
          {
            label: "Standard / personal deductions",
            amount: 30000,
            evidenceStatus: "assumption",
          },
        ],
        taxes: [
          {
            label: "Federal income tax",
            amount: 38000,
            evidenceStatus: "estimated",
          },
          {
            label: "State income tax",
            amount: 9000,
            evidenceStatus: "estimated",
          },
          {
            label: "Payroll tax (employee share on salary)",
            amount: 9180,
            evidenceStatus: "estimated",
          },
        ],
        payments: [
          {
            label: "Withholding + estimates",
            amount: 50000,
            evidenceStatus: "estimated",
          },
        ],
        // 120k + 130k receipts − 56,180 tax = ~193,820; rounded demo figure.
        cashAfterTax: 193820,
        confidencePercent: 62,
      },
      {
        id: "company-entity",
        name: "Operating Company (S Corp)",
        entityType: "s_corp",
        jurisdiction: { country: "US", state: "NY" },
        income: [
          {
            label: "Gross revenue",
            amount: 750000,
            evidenceStatus: "estimated",
          },
        ],
        deductions: [
          {
            label: "Operating expenses",
            amount: 500000,
            evidenceStatus: "estimated",
          },
          {
            label: "Owner salary (deductible)",
            amount: 120000,
            evidenceStatus: "assumption",
          },
        ],
        taxes: [
          {
            label: "State entity tax + fees",
            amount: 9000,
            evidenceStatus: "assumption",
            notes: "S corps are mostly pass-through; this is a demo state fee.",
          },
        ],
        payments: [
          {
            label: "Entity estimated payments",
            amount: 6000,
            evidenceStatus: "estimated",
          },
        ],
        // 750k − 500k opex − 120k salary − 9k fee = 121k retained/distributable.
        cashAfterTax: 121000,
        confidencePercent: 58,
      },
    ],
    flows: [
      {
        id: "salary-flow",
        fromEntityId: "company-entity",
        toEntityId: "individual-owner",
        label: "Owner salary",
        flowType: "salary",
        amount: 120000,
        taxTreatment: "Deductible to company; wages taxable to the owner.",
        evidenceStatus: "assumption",
      },
      {
        id: "k1-flow",
        fromEntityId: "company-entity",
        toEntityId: "individual-owner",
        label: "Pass-through profit (K-1)",
        flowType: "k1_pass_through",
        amount: 130000,
        taxTreatment:
          "Remaining profit passes through to the owner's personal return (simplified).",
        evidenceStatus: "assumption",
      },
      {
        id: "personal-tax-flow",
        fromEntityId: "individual-owner",
        toEntityId: "tax-authority",
        label: "Personal tax",
        flowType: "personal_tax",
        amount: 56180,
        taxTreatment: "Federal + state + payroll, simplified demo estimate.",
        evidenceStatus: "estimated",
      },
      {
        id: "entity-tax-flow",
        fromEntityId: "company-entity",
        toEntityId: "tax-authority",
        label: "Entity tax / fees",
        flowType: "entity_tax",
        amount: 9000,
        taxTreatment: "Simplified state entity-level tax and fees.",
        evidenceStatus: "assumption",
      },
    ],
    evidence: [
      {
        id: "w2-evidence",
        label: "Owner W-2 wages",
        value: "$120,000",
        status: "assumption",
        source: "Demo input",
        notes: "Replace with payroll records in production.",
      },
      {
        id: "revenue-evidence",
        label: "Business revenue",
        value: "$750,000",
        status: "estimated",
        source: "Demo input",
      },
      {
        id: "expenses-evidence",
        label: "Business expenses",
        value: "$500,000",
        status: "estimated",
        source: "Demo input",
      },
      {
        id: "depreciation-evidence",
        label: "Depreciation",
        value: "Not provided",
        status: "missing_backup",
        source: "No schedule attached",
      },
      {
        id: "distributions-evidence",
        label: "Owner distributions",
        value: "$130,000",
        status: "assumption",
        source: "Demo input",
      },
      {
        id: "state-rate-evidence",
        label: "State tax rate",
        value: "Blended assumption",
        status: "assumption",
        source: "Demo input",
      },
    ],
    assumptions: [
      "Fictional demo data only.",
      "Simplified flat estimates are used for visualization, not computed from a real return.",
      "This is not tax advice or a filing calculation.",
      "Actual treatment depends on entity structure, jurisdiction, elections, records, timing, and taxpayer-specific facts.",
    ],
  },
];

export const defaultTaxScenario = taxDemoScenarios[0];
