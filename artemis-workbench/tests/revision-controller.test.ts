import { describe, expect, it, vi } from "vitest";
import {
  WorkbenchRevisionController,
  type WorkbenchConfiguration,
} from "../src";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("WorkbenchRevisionController", () => {
  it("routes configuration changes through one revisioned gateway", () => {
    const controller = new WorkbenchRevisionController<unknown>();
    const mutation = controller.setConfiguration(
      { geometry: { radius: 6200 } },
      "controls.radius",
    );

    expect(mutation.revision).toBe(1);
    expect(mutation.source).toBe("controls.radius");
    expect(mutation.changedPaths).toEqual(["geometry.radius"]);
    expect(controller.snapshot.configuration.geometry.radius).toBe(6200);
    expect(controller.snapshot.configurationFingerprint).toBeNull();
    expect(controller.snapshot.geometryDirty).toBe(true);
    expect(controller.canExport()).toBe(false);
  });

  it("does not increment revision for a semantic no-op", () => {
    const controller = new WorkbenchRevisionController<unknown>();
    const initialRadius = controller.snapshot.configuration.geometry.radius;

    controller.setConfiguration(
      { geometry: { radius: initialRadius } },
      "controls.radius",
    );

    expect(controller.snapshot.revision).toBe(0);
  });

  it("rejects stale builds without throwing", async () => {
    const controller = new WorkbenchRevisionController<{ radius: number }>();
    const firstBuild = deferred<{ radius: number }>();
    const debug = vi.spyOn(console, "debug").mockImplementation(() => undefined);

    controller.setConfiguration({ geometry: { radius: 6000 } }, "test:first");
    const stalePromise = controller.build(async () => firstBuild.promise);

    controller.setConfiguration({ geometry: { radius: 7000 } }, "test:second");
    firstBuild.resolve({ radius: 6000 });

    await expect(stalePromise).resolves.toBeNull();
    expect(debug).toHaveBeenCalledWith(
      "[Build Stale] Revision 1 superseded by 2",
    );
    expect(controller.canExport()).toBe(false);

    debug.mockRestore();
  });

  it("permits export only after the current revision completes", async () => {
    const controller = new WorkbenchRevisionController<{ radius: number }>();
    controller.setConfiguration({ geometry: { radius: 6400 } }, "preset:standard");

    expect(controller.canExport()).toBe(false);

    const completed = await controller.build(async (configuration: WorkbenchConfiguration) => ({
      radius: configuration.geometry.radius,
    }));

    expect(completed?.revision).toBe(1);
    expect(completed?.model.radius).toBe(6400);
    expect(completed?.configurationFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(controller.snapshot.completedRevision).toBe(1);
    expect(controller.snapshot.configurationDirty).toBe(false);
    expect(controller.snapshot.geometryDirty).toBe(false);
    expect(controller.canExport()).toBe(true);
  });
});
