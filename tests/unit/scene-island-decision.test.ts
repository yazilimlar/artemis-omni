import { describe, expect, it } from "vitest";
import {
  decideRender,
  fallbackReason,
  fpsBreached,
  isLowDevice,
  type RenderInputs,
} from "@/components/scenes/SceneIsland";

const keys = ["reducedMotion", "hasWebGL", "lowDevice", "fpsBelowFloor", "errorThrown"] as const;

describe("decideRender: all 32 combinations", () => {
  for (let mask = 0; mask < 32; mask++) {
    const inputs = Object.fromEntries(keys.map((key, bit) => [key, Boolean(mask & (1 << bit))])) as RenderInputs;
    const expected =
      !inputs.reducedMotion && inputs.hasWebGL && !inputs.lowDevice && !inputs.fpsBelowFloor && !inputs.errorThrown
        ? "scene"
        : "fallback";
    it(`${JSON.stringify(inputs)} -> ${expected}`, () => {
      expect(decideRender(inputs)).toBe(expected);
    });
  }
});

describe("fallbackReason chain order (ADR-015)", () => {
  const ok: RenderInputs = { reducedMotion: false, hasWebGL: true, lowDevice: false, fpsBelowFloor: false, errorThrown: false };

  it("reports the first failing check in order", () => {
    expect(fallbackReason({ ...ok, ssr: true, reducedMotion: true })).toBe("ssr");
    expect(fallbackReason({ ...ok, reducedMotion: true, hasWebGL: false })).toBe("reduced_motion");
    expect(fallbackReason({ ...ok, hasWebGL: false, lowDevice: true })).toBe("no_webgl");
    expect(fallbackReason({ ...ok, lowDevice: true, fpsBelowFloor: true })).toBe("low_device");
    expect(fallbackReason({ ...ok, fpsBelowFloor: true, errorThrown: true })).toBe("fps_floor");
    expect(fallbackReason({ ...ok, errorThrown: true })).toBe("error");
    expect(fallbackReason({ ...ok, sessionExpired: true })).toBe("session_expired");
    expect(fallbackReason(ok)).toBeNull();
  });
});

describe("isLowDevice", () => {
  it("downgrades on few cores or little memory where reported", () => {
    expect(isLowDevice({ hardwareConcurrency: 2, deviceMemory: 8 })).toBe(true);
    expect(isLowDevice({ hardwareConcurrency: 8, deviceMemory: 2 })).toBe(true);
    expect(isLowDevice({ hardwareConcurrency: 8, deviceMemory: 8 })).toBe(false);
  });

  it("does not downgrade when deviceMemory is unknown (Safari/Firefox)", () => {
    expect(isLowDevice({ hardwareConcurrency: 8 })).toBe(false);
    expect(isLowDevice({})).toBe(false);
  });
});

describe("fpsBreached", () => {
  it("needs 3 consecutive seconds below the floor", () => {
    expect(fpsBreached([19, 18, 60, 17, 16], 20)).toBe(false);
    expect(fpsBreached([60, 19, 18, 17], 20)).toBe(true);
    expect(fpsBreached([20, 20, 20], 20)).toBe(false);
  });
});
