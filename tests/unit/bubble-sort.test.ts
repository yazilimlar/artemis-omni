import { describe, expect, it } from "vitest";
import registry from "@/data/scene-registry.json";
import {
  BAR_COUNT,
  BASE_SEED,
  generateBubbleSortSteps,
  shuffled,
  swapsThrough,
} from "@/components/scenes/bubble-sort/algorithm";
import { CANVAS_2D_SCENES } from "@/components/scenes/SceneIsland";
// Plain .mjs build script; types are inferred through allowJs.
import { SCENE_TYPES, validateScenes } from "../../scripts/validate-scenes.mjs";

describe("generateBubbleSortSteps", () => {
  it("sorts [3,1,2]: the final step is fully sorted", () => {
    const steps = generateBubbleSortSteps([3, 1, 2]);
    expect(steps[steps.length - 1].array).toEqual([1, 2, 3]);
    expect(steps[steps.length - 1].sortedFrom).toBe(0);
    expect(steps.map((s) => s.comparing)).toEqual([[0, 1], [1, 2], [0, 1]]);
    expect(steps.map((s) => s.swapped)).toEqual([true, true, false]);
  });

  it("is deterministic: the same input gives the same output", () => {
    const input = shuffled(BAR_COUNT, BASE_SEED);
    expect(generateBubbleSortSteps(input)).toEqual(generateBubbleSortSteps([...input]));
  });

  it("makes n(n-1)/2 comparisons in the worst case (20 items)", () => {
    const reversed = Array.from({ length: 20 }, (_, i) => 20 - i);
    const steps = generateBubbleSortSteps(reversed);
    expect(steps).toHaveLength((20 * 19) / 2);
    expect(steps[steps.length - 1].array).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(swapsThrough(steps, steps.length - 1)).toBe(190); // every comparison swaps when reversed
  });

  it("does not mutate its input and handles tiny arrays", () => {
    const input = [2, 1];
    generateBubbleSortSteps(input);
    expect(input).toEqual([2, 1]);
    expect(generateBubbleSortSteps([1])).toEqual([]);
    expect(generateBubbleSortSteps([])).toEqual([]);
  });

  it("always ends sorted for the scene's seeded shuffles", () => {
    for (let round = 0; round < 5; round++) {
      const steps = generateBubbleSortSteps(shuffled(BAR_COUNT, BASE_SEED + round));
      expect(steps[steps.length - 1].array).toEqual(Array.from({ length: BAR_COUNT }, (_, i) => i + 1));
    }
  });
});

describe("shuffled", () => {
  it("is a reproducible permutation of 1..n that differs by seed", () => {
    const a = shuffled(20, BASE_SEED);
    expect(a).toEqual(shuffled(20, BASE_SEED));
    expect([...a].sort((x, y) => x - y)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(a).not.toEqual(shuffled(20, BASE_SEED + 1));
    expect(a).not.toEqual(Array.from({ length: 20 }, (_, i) => i + 1)); // not already sorted
  });
});

describe("bubble-sort registration", () => {
  const entry = registry.find((scene) => scene.id === "bubble-sort");

  it("is registered as a canvas-2d, approved public_safe_demo scene", () => {
    expect(entry).toBeDefined();
    expect(entry?.type).toBe("canvas-2d");
    expect(entry?.approved_public).toBe(true);
    expect(entry?.visibility).toBe("public_safe_demo");
    expect(entry?.data_mode).toBe("synthetic");
  });

  it("the whole registry validates, and the island knows every canvas-2d scene", () => {
    expect(validateScenes(registry, process.cwd())).toEqual([]);
    const canvasIds = registry.filter((s) => (s as { type?: string }).type === "canvas-2d").map((s) => s.id);
    expect([...CANVAS_2D_SCENES].sort()).toEqual(canvasIds.sort());
  });

  it("the validator accepts 3d and canvas-2d and rejects other types", () => {
    expect(SCENE_TYPES).toEqual(["3d", "canvas-2d"]);
    const bad = { ...entry, type: "manim" };
    const errors = validateScenes([bad], process.cwd());
    expect(errors.some((e: string) => e.includes('unknown type "manim"'))).toBe(true);
  });
});
