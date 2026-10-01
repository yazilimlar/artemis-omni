import { describe, expect, it } from "vitest";
import {
  canSeeAllProducts,
  filterVisibleProducts,
  isOwner,
  type UserProfile,
  type UserRole,
} from "@/lib/auth/profile";
import { loadProducts } from "@/lib/registry/load";

function profile(role: UserRole): UserProfile {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    email: "user@example.com",
    role,
    display_name: null,
    created_at: "2026-10-01T00:00:00.000Z",
  };
}

describe("isOwner", () => {
  it("is true only for the owner role", () => {
    expect(isOwner(profile("owner"))).toBe(true);
    expect(isOwner(profile("admin"))).toBe(false);
    expect(isOwner(profile("client"))).toBe(false);
    expect(isOwner(profile("viewer"))).toBe(false);
    expect(isOwner(null)).toBe(false);
  });
});

describe("canSeeAllProducts", () => {
  it("is true for owner and admin only", () => {
    expect(canSeeAllProducts(profile("owner"))).toBe(true);
    expect(canSeeAllProducts(profile("admin"))).toBe(true);
    expect(canSeeAllProducts(profile("client"))).toBe(false);
    expect(canSeeAllProducts(profile("viewer"))).toBe(false);
    expect(canSeeAllProducts(null)).toBe(false);
  });
});

describe("filterVisibleProducts", () => {
  const products = loadProducts();
  const baseline = products.filter((product) =>
    ["public", "public_safe_demo"].includes(product.visibility),
  );

  it("shows owner and admin every registered product", () => {
    expect(filterVisibleProducts(products, profile("owner"))).toEqual(products);
    expect(filterVisibleProducts(products, profile("admin"))).toEqual(products);
  });

  it("shows client, viewer and missing profiles only public and public_safe_demo", () => {
    expect(baseline.length).toBeGreaterThan(0);
    expect(baseline.length).toBeLessThan(products.length);
    for (const subject of [profile("client"), profile("viewer"), null]) {
      expect(filterVisibleProducts(products, subject)).toEqual(baseline);
    }
  });

  it("never shows noindex_review or UNREVIEWED products to non-admin roles", () => {
    const visible = filterVisibleProducts(products, profile("viewer"));
    expect(visible.some((product) => product.visibility === "noindex_review")).toBe(false);
    expect(visible.some((product) => product.visibility === "UNREVIEWED")).toBe(false);
  });
});
