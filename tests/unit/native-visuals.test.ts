import { describe, expect, it } from "vitest";
import { getProduct, loadDivisions, loadProducts } from "@/lib/registry/load";

/** First cohort of ADR-017 `native_visuals` (applied 2026-10-04). */
const PRODUCTS: Record<string, string[]> = {
  civicbid: ["map", "timeline", "table", "evidence-graph"],
  "construction-intelligence": ["geometry", "quantity-table", "cashflow-waterfall", "schedule-sequence"],
  "utility-field-claims": ["map", "table", "evidence-graph"],
  artemisix19: ["storyboard", "prompt-chain", "gallery"],
  "turkiye-atlas": ["map", "kml-layer", "spatial-timeline"],
};
const DIVISIONS: Record<string, string[]> = {
  "infrastructure-construction": ["geometry", "quantity-table", "cashflow-waterfall", "schedule-sequence"],
  "atlas-places": ["map", "kml-layer", "spatial-timeline"],
  "finance-decision-systems": ["plot", "dashboard", "variance-table", "cashflow-waterfall"],
  "knowledge-academy": ["taxonomy-tree", "timeline", "content-index"],
  "natural-systems": ["taxonomy-tree", "specimen-plate", "seasonal-cycle"],
};

describe("native_visuals (ADR-017)", () => {
  it("loadProducts returns native_visuals where set", () => {
    for (const [id, visuals] of Object.entries(PRODUCTS)) {
      expect(getProduct(id)?.native_visuals, id).toEqual(visuals);
    }
  });

  it("the five updated products have non-empty arrays", () => {
    const withVisuals = loadProducts().filter((p) => p.native_visuals !== undefined);
    expect(withVisuals.map((p) => p.id).sort()).toEqual(Object.keys(PRODUCTS).sort());
    for (const p of withVisuals) expect(p.native_visuals?.length, p.id).toBeGreaterThan(0);
  });

  it("products without native_visuals return undefined", () => {
    const others = loadProducts().filter((p) => !(p.id in PRODUCTS));
    expect(others.length).toBeGreaterThan(0);
    for (const p of others) expect(p.native_visuals, p.id).toBeUndefined();
  });

  it("loadDivisions returns native_visuals where set, and the five have non-empty arrays", () => {
    const divisions = loadDivisions();
    for (const [id, visuals] of Object.entries(DIVISIONS)) {
      const division = divisions.find((d) => d.id === id);
      expect(division, id).toBeDefined();
      expect(division?.native_visuals, id).toEqual(visuals);
      expect(division?.native_visuals?.length).toBeGreaterThan(0);
    }
  });

  it("divisions without native_visuals return undefined", () => {
    const others = loadDivisions().filter((d) => !(d.id in DIVISIONS));
    expect(others.length).toBeGreaterThan(0);
    for (const d of others) expect(d.native_visuals, d.id).toBeUndefined();
  });
});
