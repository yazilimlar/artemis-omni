/**
 * Artemis product modules (Artemis Core + verticals).
 *
 * Positioning: Artemis Construct / 5D Construction Intelligence is the public
 * beachhead. Artemis Flow remains a module, not the parent company. Modules without
 * a dedicated public route yet are marked `route: null` (roadmap / internal).
 */
export type ProductStatus = "beachhead" | "available" | "module" | "roadmap";

export type Product = {
  slug: string;
  name: string;
  kicker: string;
  status: ProductStatus;
  /** Public route, or null if no dedicated page exists yet. */
  route: string | null;
  summary: string;
  capabilities: string[];
  audience: string;
};

export const products: Product[] = [
  {
    slug: "construct",
    name: "Artemis Construct",
    kicker: "5D Construction Intelligence · Beachhead",
    status: "beachhead",
    route: "/products/construct",
    summary:
      "Heavy civil cost control, PM Forecast, and ERP/CMiC construction analytics — the live 5D cashflow comparison of Bid vs Actuals vs PM Forecast vs system projections.",
    capabilities: [
      "5D cashflow forecasting",
      "ERP / CMiC cost & billing",
      "Field production → actual cost",
      "Executive risk / opportunity reporting",
    ],
    audience: "Heavy civil contractors, infrastructure owners, project controls teams",
  },
  {
    slug: "twin-atlas",
    name: "Artemis Twin / Atlas",
    kicker: "Digital Twin · Geospatial",
    status: "module",
    route: "/products/twin-atlas",
    summary:
      "3D/4D/5D digital-twin and engineering visualization (Twin) plus geospatial and infrastructure map intelligence (Atlas) — the model of record behind the forecast.",
    capabilities: [
      "Geometry, quantities, constructability",
      "Schedule sequencing (4D)",
      "Model-to-money linkage (5D)",
      "Geospatial / map intelligence",
    ],
    audience: "Engineering, VDC, and infrastructure teams",
  },
  {
    slug: "flow",
    name: "Artemis Flow",
    kicker: "Finance · Cashflow · AI CFO",
    status: "module",
    route: "/products/flow",
    summary:
      "The finance, banking, and cashflow intelligence module — an AI CFO layer. The horizontal generalization of the construction Cashflow Intelligence Engine (Budget vs Actuals vs Forecast).",
    capabilities: [
      "Cashflow forecasting & runway",
      "Bank / account aggregation (read-level)",
      "AR / AP and billing/revenue signals",
      "Variance & confidence analytics",
    ],
    audience: "SMB finance leaders (module-level; not the parent brand)",
  },
  {
    slug: "docs",
    name: "Artemis Docs",
    kicker: "Document Intelligence",
    status: "module",
    route: "/products/docs",
    summary:
      "Document intelligence for contracts, bids, and unstructured data — extraction with human review and source-labeled outputs.",
    capabilities: [
      "Contract & bid extraction",
      "Unstructured-data structuring",
      "Human-reviewed exception handling",
      "Traceable source labeling",
    ],
    audience: "Estimating, contracts, and operations teams",
  },
  {
    slug: "connect",
    name: "Artemis Connect",
    kicker: "Integrations · Connectors",
    status: "module",
    route: "/products/connect",
    summary:
      "Controlled connectors to the systems a company already runs — Gmail, Drive, QuickBooks, Shopify, ERP, and banking — governed and audit-aware.",
    capabilities: [
      "Controlled, read-first integrations",
      "ERP / accounting connectors",
      "Governed data flow",
      "Audit-aware access",
    ],
    audience: "IT, operations, and finance",
  },
  {
    slug: "ops",
    name: "Artemis Ops",
    kicker: "Operating Dashboards · Analytics",
    status: "roadmap",
    route: null,
    summary:
      "Operating dashboards and business decision systems (DuckDB-style analytics). Roadmap module — no dedicated public page yet.",
    capabilities: [
      "Operating dashboards",
      "Decision-oriented analytics",
      "Department rollups",
    ],
    audience: "Operations and executive teams",
  },
  {
    slug: "desk",
    name: "Artemis Desk",
    kicker: "Support · Sales · Comms",
    status: "roadmap",
    route: null,
    summary:
      "Customer support, sales assistant, and communications automation. Roadmap module — no dedicated public page yet.",
    capabilities: [
      "Support automation",
      "Sales assistance",
      "Communications workflows",
    ],
    audience: "Customer-facing teams",
  },
];

export function getProduct(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}
