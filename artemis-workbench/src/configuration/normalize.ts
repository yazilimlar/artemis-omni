import type {
  ConfigurationPatch,
  WorkbenchConfiguration,
} from "./types";

function assertFinitePositive(value: number, path: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${path} must be a finite positive number`);
  }
  return value;
}

function assertFrequency(value: number): number {
  if (!Number.isInteger(value) || value < 1 || value > 64) {
    throw new RangeError("geometry.frequency must be an integer from 1 through 64");
  }
  return value;
}

export function normalizeConfiguration(
  current: WorkbenchConfiguration,
  patch: ConfigurationPatch,
): WorkbenchConfiguration {
  const geometry = {
    radius: assertFinitePositive(
      patch.geometry?.radius ?? current.geometry.radius,
      "geometry.radius",
    ),
    frequency: assertFrequency(
      patch.geometry?.frequency ?? current.geometry.frequency,
    ),
    classType: patch.geometry?.classType ?? current.geometry.classType,
  } as const;

  const fabrication = {
    materialId: patch.fabrication?.materialId ?? current.fabrication.materialId,
    panelThicknessMm: assertFinitePositive(
      patch.fabrication?.panelThicknessMm ?? current.fabrication.panelThicknessMm,
      "fabrication.panelThicknessMm",
    ),
    strutProfileId:
      patch.fabrication?.strutProfileId ?? current.fabrication.strutProfileId,
  } as const;

  const display = {
    showPanels: patch.display?.showPanels ?? current.display.showPanels,
    showNodes: patch.display?.showNodes ?? current.display.showNodes,
    showDimensions:
      patch.display?.showDimensions ?? current.display.showDimensions,
  } as const;

  return Object.freeze({
    geometry: Object.freeze(geometry),
    fabrication: Object.freeze(fabrication),
    display: Object.freeze(display),
  });
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const record = value as Readonly<Record<string, unknown>>;
  const body = Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",");
  return `{${body}}`;
}

export async function configurationFingerprint(
  configuration: WorkbenchConfiguration,
): Promise<string> {
  const payload = new TextEncoder().encode(stableStringify(configuration));
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
