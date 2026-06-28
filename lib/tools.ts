/**
 * Tools registry. Each interactive tool is a React component under
 * /components/tools and a route under /app/tools/<slug>. Register metadata here
 * so the index page and cross-links stay in sync. Future tools just add an entry.
 */
export type ToolMeta = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: "live" | "beta" | "planned";
};

export const tools: ToolMeta[] = [
  {
    slug: "fuel-price-adjustment",
    title: "Fuel Price Adjustment",
    summary:
      "Model contract fuel-price adjustment with a baseline, deadband, and fuel-sensitive share.",
    category: "Project Controls",
    status: "live",
  },
  {
    slug: "cash-flow-forecast",
    title: "Construction Cash-Flow Forecast",
    summary: "Project monthly cash flow from an S-curve and payment terms.",
    category: "Project Controls",
    status: "planned",
  },
  {
    slug: "earned-value",
    title: "Earned Value Dashboard",
    summary: "Compute CPI, SPI, EAC, and variance from cost and schedule inputs.",
    category: "Project Controls",
    status: "planned",
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug) ?? null;
}
