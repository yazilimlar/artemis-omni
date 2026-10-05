/**
 * Editorial overlay for /products (site audit F-1). Same pattern as
 * data/labs-editorial.ts: registry facts live in ENGINEERING/PRODUCT_REGISTRY.yaml,
 * this file holds the reviewed narrative. `registryId: null` marks editorial-only
 * modules that have no Product Registry entry yet (none of these seven do).
 *
 * Positioning: Artemis Construct / 5D Construction Intelligence is the public
 * beachhead. Artemis Flow remains a module, not the parent company. Modules without
 * a dedicated public route yet are marked `route: null` (roadmap / internal).
 */
export type ProductStatus = "beachhead" | "available" | "module" | "roadmap";

export type ProductEditorial = {
  slug: string;
  registryId: string | null;
  name: string;
  kicker: string;
  status: ProductStatus;
  /** Public route, or null if no dedicated page exists yet. */
  route: string | null;
  summary: string;
  capabilities: string[];
  audience: string;
};

export const productsEditorial: ProductEditorial[] = [
  {
    slug: "construct",
    registryId: null,
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
    registryId: null,
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
    registryId: null,
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
    registryId: null,
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
    registryId: null,
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
];

export function getProductEditorial(slug: string): ProductEditorial | null {
  return productsEditorial.find((p) => p.slug === slug) ?? null;
}
