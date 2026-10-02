import { describe, expect, it } from "vitest";
import { subdividedIcosahedron } from "@/components/scenes/site-hero/geometry";
import { shouldLoadHero } from "@/components/scenes/site-hero/HomeHeroScene";

describe("site-hero geometry (ADR-016: under 5,000 vertices)", () => {
  const { vertices, edges } = subdividedIcosahedron();

  it("is a once-subdivided icosahedron: 42 vertices, 120 edges", () => {
    expect(vertices).toHaveLength(42);
    expect(edges).toHaveLength(120);
    expect(vertices.length).toBeLessThan(5000);
  });

  it("puts every vertex on the unit sphere and every edge between distinct vertices", () => {
    for (const [x, y, z] of vertices) expect(Math.hypot(x, y, z)).toBeCloseTo(1, 10);
    for (const [a, b] of edges) {
      expect(a).not.toBe(b);
      expect(vertices[a]).toBeDefined();
      expect(vertices[b]).toBeDefined();
    }
  });
});

describe("shouldLoadHero (ADR-016 lazy-load gate)", () => {
  it("loads on a fast connection without reduced motion", () => {
    expect(shouldLoadHero({ reducedMotion: false, effectiveType: "4g" })).toBe(true);
    expect(shouldLoadHero({ reducedMotion: false })).toBe(true); // Network Information API unavailable
  });

  it("keeps the static fallback for reduced motion, save-data, and slow networks", () => {
    expect(shouldLoadHero({ reducedMotion: true, effectiveType: "4g" })).toBe(false);
    expect(shouldLoadHero({ reducedMotion: false, effectiveType: "4g", saveData: true })).toBe(false);
    for (const effectiveType of ["slow-2g", "2g", "3g"]) {
      expect(shouldLoadHero({ reducedMotion: false, effectiveType })).toBe(false);
    }
  });
});
