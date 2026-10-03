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

describe("product registry loader", () => {
  it("loads at least ten products with unique ids", () => {
    const products = loadProducts();
    expect(products.length).toBeGreaterThanOrEqual(10);
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
  });

  it("accepts UNREVIEWED as a field value", () => {
    expect(getProduct("dayos")?.maturity).toBe("UNREVIEWED");
  });

  it("loads divisions from DIVISION_REGISTRY.yaml", () => {
    expect(loadDivisions().map((division) => division.id)).toContain("core-platform");
  });

  it("lists a product only when it is public, routed, and has a reviewed lifecycle", () => {
    for (const product of loadProducts()) {
      const expected =
        product.visibility === "public" &&
        typeof product.canonical_route === "string" &&
        product.canonical_route.startsWith("/") &&
        product.lifecycle !== "UNREVIEWED";
      expect(isPubliclyListed(product), product.id).toBe(expected);
    }
  });

  it("excludes public_safe_demo, routeless, and UNREVIEWED-lifecycle products", () => {
    for (const id of [
      "utility-field-claims", // public_safe_demo
      "tax-architecture-2026", // public_safe_demo (still rendered via editorial)
      "dayos", // noindex_review
      "artemis-nomad", // canonical_route UNREVIEWED
      "pinar-evleri", // lifecycle UNREVIEWED
      "diana-moonshot", // lifecycle UNREVIEWED
      "bidroom-exemplary-contractor", // lifecycle UNREVIEWED
    ]) {
      const product = getProduct(id);
      expect(product, id).toBeDefined();
      expect(isPubliclyListed(product!), id).toBe(false);
    }
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

  it("adds default cards only for products that pass the listing rule", () => {
    const defaults = entries.filter((entry) => entry.editorial === null);
    expect(defaults.length).toBeGreaterThan(0);
    for (const entry of defaults) {
      expect(entry.product && isPubliclyListed(entry.product), entry.product?.id).toBe(true);
      expect(linkableRoute(entry.product!)).not.toBeNull();
    }
  });

  it("keeps every editorial entry, even when its registry entry would not be listed", () => {
    const workbench = entries.find((entry) => entry.product?.id === "geometric-workbench");
    expect(workbench?.editorial).not.toBeNull();
    expect(isPubliclyListed(workbench!.product!)).toBe(false);
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
