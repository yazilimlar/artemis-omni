import { describe, expect, it } from "vitest";
import { labsEditorial } from "@/data/labs-editorial";
import {
  getProduct,
  isPubliclyListed,
  linkableRoute,
  loadDivisions,
  loadProducts,
  mergeRegistryOverlay,
} from "@/lib/registry/load";

/**
 * Publicly listed products that PRODUCT_REGISTRY.yaml records without a
 * route path (null or UNREVIEWED) as of the 2026-10-01 registry sync. This is a
 * ratchet: remove an id once its route is registered; never add one silently.
 */
const KNOWN_ROUTELESS_PUBLIC_PRODUCTS = [
  "atlas-handcrafted-guru-selection", // canonical_route: null (rescue, no route yet)
  "artemis-nomad", // canonical_route: UNREVIEWED (two levara-l28 surfaces)
  "dayos", // canonical_route: null (static assets only, no app/ route)
];

describe("product registry loader", () => {
  it("loads at least ten products with unique ids", () => {
    const products = loadProducts();
    expect(products.length).toBeGreaterThanOrEqual(10);
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
  });

  it("accepts UNREVIEWED as a field value", () => {
    expect(getProduct("geometric-workbench")?.visibility).toBe("UNREVIEWED");
  });

  it("loads divisions from DIVISION_REGISTRY.yaml", () => {
    expect(loadDivisions().map((division) => division.id)).toContain("core-platform");
  });

  it("every publicly listed product has a canonical route path, except the known gaps", () => {
    const missing = loadProducts()
      .filter((product) => isPubliclyListed(product) && linkableRoute(product) === null)
      .map((product) => product.id)
      .sort();
    expect(missing).toEqual([...KNOWN_ROUTELESS_PUBLIC_PRODUCTS].sort());
  });
});

describe("/labs registry and editorial merge", () => {
  const products = loadProducts();
  const entries = mergeRegistryOverlay(products, labsEditorial);

  it("produces exactly one entry per publicly listed registry product", () => {
    for (const product of products.filter(isPubliclyListed)) {
      expect(entries.filter((entry) => entry.product?.id === product.id)).toHaveLength(1);
    }
  });

  it("keeps every editorial entry, including editorial-only ones", () => {
    expect(entries.filter((entry) => entry.editorial !== null)).toHaveLength(labsEditorial.length);
    const george = entries.find((entry) => entry.editorial?.title === "George Aegean Quest");
    expect(george?.product).toBeNull();
  });

  it("attaches each editorial entry to its registry product", () => {
    for (const editorial of labsEditorial.filter((entry) => entry.registryId !== null)) {
      const matches = entries.filter((entry) => entry.product?.id === editorial.registryId);
      expect(matches).toHaveLength(1);
      expect(matches[0].editorial).toBe(editorial);
    }
  });

  it("rejects editorial entries that name an unknown registry id", () => {
    expect(() =>
      mergeRegistryOverlay(products, [{ registryId: "no-such-product" }]),
    ).toThrow(/unknown registry id/);
  });
});
