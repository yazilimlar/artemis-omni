import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { PlaneGeometry } from "three";
import registry from "@/data/scene-registry.json";
import {
  SEGMENTS,
  SIZE,
  colorAt,
  contourRadius,
  gaussian,
  toHex,
  vertexCount,
} from "@/components/scenes/gaussian-surface/surface";

describe("gaussian(x, y, sigma)", () => {
  it("matches exp(-(x² + y²) / 2σ²) at spot-check points (σ = 1)", () => {
    expect(gaussian(0, 0, 1)).toBe(1);
    expect(gaussian(1, 0, 1)).toBeCloseTo(Math.exp(-0.5), 12); // 0.60653066
    expect(gaussian(0, 1, 1)).toBeCloseTo(0.6065306597, 9);
    expect(gaussian(1, 1, 1)).toBeCloseTo(Math.exp(-1), 12); // 0.36787944
    expect(gaussian(2, 2, 1)).toBeCloseTo(Math.exp(-4), 12); // 0.01831564
  });

  it("is symmetric and widens with sigma", () => {
    expect(gaussian(1.3, -0.4)).toBe(gaussian(-1.3, 0.4));
    expect(gaussian(1, 0, 2)).toBeGreaterThan(gaussian(1, 0, 1));
  });

  it("contourRadius inverts the gaussian along an axis", () => {
    for (const z of [0.2, 0.4, 0.6, 0.8]) expect(gaussian(contourRadius(z), 0)).toBeCloseTo(z, 12);
  });
});

describe("surface geometry and colour", () => {
  it("has 4,225 vertices, under the 5,000 budget, matching a real PlaneGeometry", () => {
    expect(vertexCount()).toBe(65 * 65);
    expect(vertexCount()).toBeLessThan(5000);
    expect(new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS).attributes.position.count).toBe(vertexCount());
  });

  it("colours blue at the bottom, cyan in the middle and gold at the top", () => {
    expect(toHex(colorAt(0))).toBe("#006bd6");
    expect(toHex(colorAt(0.5))).toBe("#00d9ff");
    expect(toHex(colorAt(1))).toBe("#d6a84f");
    expect(colorAt(-1)).toEqual(colorAt(0));
    expect(colorAt(2)).toEqual(colorAt(1));
  });
});

describe("gaussian-surface registration", () => {
  const entry = registry.find((scene) => scene.id === "gaussian-surface");

  it("is registered as a 3d, approved public_safe_demo scene", () => {
    expect(entry).toBeDefined();
    expect(entry?.type).toBe("3d");
    expect(entry?.approved_public).toBe(true);
    expect(entry?.visibility).toBe("public_safe_demo");
    expect(entry?.data_mode).toBe("synthetic");
    expect(entry?.route).toBe("/labs/scenes/gaussian-surface");
  });

  it("has a static fallback SVG", () => {
    const svg = fs.readFileSync("public/textures/gaussian-surface/fallback.svg", "utf8");
    expect(svg).toContain("<svg");
  });
});
