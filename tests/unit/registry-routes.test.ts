import { describe, expect, it } from "vitest";
import { labsEditorial } from "@/data/labs-editorial";
import {
  UNREVIEWED,
  linkableRoute,
  loadDivisions,
  loadProducts,
  mergeRegistryOverlay,
} from "@/lib/registry/load";

/**
 * Products with visibility "public" that PRODUCT_REGISTRY.yaml records without
 * a route path. Empty since the 2026-10-01 registry refinement: artemis-nomad
 * now has a route and dayos is no longer public. Ratchet: never add one silently.
 */
const KNOWN_ROUTELESS_PUBLIC_PRODUCTS: string[] = [];

/**
 * Owners that products reference but loadDivisions() does not return.
 * artemis-labs is recorded under `incubation`, not `divisions`, in
 * DIVISION_REGISTRY.yaml. Ratchet: never add one silently.
 */
const KNOWN_NON_DIVISION_OWNERS = ["artemis-labs"];

describe("registry facts used by /control and /system-map", () => {
  const products = loadProducts();

  it("loads at least ten products", () => {
    expect(products.length).toBeGreaterThanOrEqual(10);
  });

  it("every public product has a canonical route path, except the pinned gaps", () => {
    const missing = products
      .filter((product) => product.visibility === "public" && linkableRoute(product) === null)
      .map((product) => product.id)
      .sort();
    expect(missing).toEqual([...KNOWN_ROUTELESS_PUBLIC_PRODUCTS].sort());
  });

  it("every reviewed product division appears in loadDivisions(), except the pinned owners", () => {
    const divisionIds = new Set(loadDivisions().map((division) => division.id));
    const unknown = [
      ...new Set(
        products
          .map((product) => product.division)
          .filter((id) => id !== UNREVIEWED && !divisionIds.has(id)),
      ),
    ].sort();
    expect(unknown).toEqual([...KNOWN_NON_DIVISION_OWNERS].sort());
  });

  it("mergeRegistryOverlay never emits the same product twice", () => {
    const ids = mergeRegistryOverlay(products, labsEditorial)
      .map((entry) => entry.product?.id)
      .filter((id): id is string => id !== undefined);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mergeRegistryOverlay rejects an overlay that names one product twice", () => {
    const twice = [{ registryId: "civicbid" }, { registryId: "civicbid" }];
    expect(() => mergeRegistryOverlay(products, twice)).toThrow(/twice/);
  });
});
