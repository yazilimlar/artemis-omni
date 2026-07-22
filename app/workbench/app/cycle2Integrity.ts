export type ConfigurationPatch = Readonly<Record<string, unknown>>;

export interface Cycle2Snapshot {
  revision: number;
  completedGeometryRevision: number;
  configDirty: boolean;
  geometryDirty: boolean;
  lastMutationSource: string;
  fingerprint: string | null;
}

export interface Cycle2Controller {
  setConfiguration: (patch: ConfigurationPatch, source: string) => number;
  canExport: () => boolean;
  getSnapshot: () => Cycle2Snapshot;
  destroy: () => void;
}

declare global {
  interface Window {
    ARTEMIS_CYCLE2?: Cycle2Controller;
  }
}

const CONFIG_SELECTOR = "input[id],input[name],select[id],select[name],textarea[id],textarea[name]";
const EXPORT_PATTERN = /\b(step|3mf|dxf|svg|csv|metadata|manufacturing package|export|download|save file)\b/i;
const MUTATION_PATTERN = /\b(reset|default|preset|import|load project|open project|restore)\b/i;
const REBUILD_DEBOUNCE_MS = 140;
const PROGRAMMATIC_SCAN_MS = 180;

type ConfigControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function controlKey(control: ConfigControl): string | null {
  return control.id || control.name || null;
}

function isInput(control: ConfigControl): control is HTMLInputElement {
  return control.tagName.toUpperCase() === "INPUT";
}

function readControlValue(control: ConfigControl): unknown {
  if (isInput(control)) {
    if (control.type === "checkbox" || control.type === "radio") return control.checked;
    if (control.type === "number" || control.type === "range") {
      const numeric = Number(control.value);
      return Number.isFinite(numeric) ? numeric : control.value;
    }
  }
  return control.value;
}

function writeControlValue(control: ConfigControl, value: unknown): void {
  if (isInput(control) && (control.type === "checkbox" || control.type === "radio")) {
    control.checked = Boolean(value);
    return;
  }
  control.value = String(value ?? "");
}

function normalizeConfiguration(document: Document): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  const controls = document.querySelectorAll<ConfigControl>(CONFIG_SELECTOR);
  for (const control of controls) {
    if (control.disabled || control.dataset.cycle2Ignore === "true") continue;
    const key = controlKey(control);
    if (!key) continue;
    normalized[key] = readControlValue(control);
  }
  return Object.fromEntries(Object.entries(normalized).sort(([a], [b]) => a.localeCompare(b)));
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function asElement(target: EventTarget | null): Element | null {
  if (!target || typeof target !== "object" || !("closest" in target)) return null;
  return target as Element;
}

function describeElement(element: Element | null): string {
  if (!element) return "unknown";
  const html = element as HTMLElement;
  return [html.id, html.getAttribute("name"), html.getAttribute("title"), html.textContent]
    .filter(Boolean)
    .join(" ")
    .trim() || html.tagName.toLowerCase();
}

function isConfigurationControl(target: EventTarget | null): target is ConfigControl {
  if (!target || typeof target !== "object" || !("tagName" in target)) return false;
  const tagName = String((target as Element).tagName).toUpperCase();
  return tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
}

function isExportElement(element: Element | null): boolean {
  if (!element) return false;
  const actionable = element.closest("button,a,[role='button'],input[type='button'],input[type='submit']");
  return EXPORT_PATTERN.test(describeElement(actionable));
}

function isMutationAction(element: Element | null): boolean {
  if (!element) return false;
  const actionable = element.closest("button,a,[role='button'],input[type='button'],input[type='submit']");
  return MUTATION_PATTERN.test(describeElement(actionable));
}

function applyDocumentStatus(document: Document, snapshot: Cycle2Snapshot): void {
  const root = document.documentElement;
  root.dataset.configurationRevision = String(snapshot.revision);
  root.dataset.geometryRevision = String(snapshot.completedGeometryRevision);
  root.dataset.configurationDirty = String(snapshot.configDirty);
  root.dataset.geometryDirty = String(snapshot.geometryDirty);
  root.dataset.lastMutationSource = snapshot.lastMutationSource;
  root.dataset.configurationFingerprint = snapshot.fingerprint ?? "pending";
}

export function installCycle2Integrity(frame: HTMLIFrameElement): Cycle2Controller | null {
  let runtimeWindow: Window;
  let runtimeDocument: Document;
  try {
    if (!frame.contentWindow || !frame.contentDocument) return null;
    runtimeWindow = frame.contentWindow;
    runtimeDocument = frame.contentDocument;
    void runtimeWindow.location.href;
  } catch {
    return null;
  }

  runtimeWindow.ARTEMIS_CYCLE2?.destroy();

  let revision = 0;
  let completedGeometryRevision = -1;
  let configDirty = true;
  let geometryDirty = true;
  let lastMutationSource = "bootstrap";
  let fingerprint: string | null = null;
  let normalizedConfiguration = normalizeConfiguration(runtimeDocument);
  let normalizedSerialized = stableStringify(normalizedConfiguration);
  let rebuildTimer: number | null = null;
  let scanTimer: number | null = null;
  let destroyed = false;
  let applyingPatch = false;

  const snapshot = (): Cycle2Snapshot => ({
    revision,
    completedGeometryRevision,
    configDirty,
    geometryDirty,
    lastMutationSource,
    fingerprint,
  });

  const publish = (): void => applyDocumentStatus(runtimeDocument, snapshot());

  const completeGeometryRevision = async (buildRevision: number): Promise<string | null> => {
    await new Promise<void>((resolve) => runtimeWindow.requestAnimationFrame(() => runtimeWindow.requestAnimationFrame(() => resolve())));
    if (destroyed) return null;
    if (buildRevision !== revision) {
      console.debug(`[Build Stale] Revision ${buildRevision} superseded by ${revision}`);
      return null;
    }

    const completedConfiguration = normalizeConfiguration(runtimeDocument);
    const completedSerialized = stableStringify(completedConfiguration);
    const completedFingerprint = await sha256(completedSerialized);

    if (destroyed) return null;
    if (buildRevision !== revision) {
      console.debug(`[Build Stale] Revision ${buildRevision} superseded by ${revision}`);
      return null;
    }

    normalizedConfiguration = completedConfiguration;
    normalizedSerialized = completedSerialized;
    completedGeometryRevision = buildRevision;
    configDirty = false;
    geometryDirty = false;
    fingerprint = completedFingerprint;
    publish();
    return completedFingerprint;
  };

  const scheduleGeometryRebuild = (buildRevision: number): void => {
    if (rebuildTimer !== null) runtimeWindow.clearTimeout(rebuildTimer);
    rebuildTimer = runtimeWindow.setTimeout(() => {
      rebuildTimer = null;
      void completeGeometryRevision(buildRevision);
    }, REBUILD_DEBOUNCE_MS);
  };

  const setConfiguration = (patch: ConfigurationPatch, source: string): number => {
    fingerprint = null;
    revision += 1;
    configDirty = true;
    geometryDirty = true;
    lastMutationSource = source || "unknown";
    publish();

    applyingPatch = true;
    try {
      for (const [key, value] of Object.entries(patch)) {
        const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(key) : key.replace(/["\\]/g, "\\$&");
        const control = runtimeDocument.querySelector<ConfigControl>(`#${escaped},[name="${escaped}"]`);
        if (control) writeControlValue(control, value);
      }
    } finally {
      applyingPatch = false;
    }

    scheduleGeometryRebuild(revision);
    return revision;
  };

  const canExport = (): boolean => (
    !configDirty &&
    !geometryDirty &&
    fingerprint !== null &&
    completedGeometryRevision === revision
  );

  const onConfigurationEvent = (event: Event): void => {
    if (applyingPatch || !isConfigurationControl(event.target)) return;
    const key = controlKey(event.target);
    if (!key) return;
    setConfiguration({ [key]: readControlValue(event.target) }, `control:${key}:${event.type}`);
  };

  const onClickCapture = (event: MouseEvent): void => {
    const target = asElement(event.target);
    if (isExportElement(target) && !canExport()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn("[Export Blocked] Configuration or geometry is stale", snapshot());
      return;
    }
    if (isMutationAction(target)) setConfiguration({}, `action:${describeElement(target)}`);
  };

  const scanForProgrammaticMutations = (): void => {
    if (destroyed) return;
    const current = normalizeConfiguration(runtimeDocument);
    const serialized = stableStringify(current);
    if (!applyingPatch && serialized !== normalizedSerialized && !configDirty) {
      setConfiguration(current, "runtime:observed-programmatic-mutation");
    }
    scanTimer = runtimeWindow.setTimeout(scanForProgrammaticMutations, PROGRAMMATIC_SCAN_MS);
  };

  runtimeDocument.addEventListener("input", onConfigurationEvent, true);
  runtimeDocument.addEventListener("change", onConfigurationEvent, true);
  runtimeDocument.addEventListener("click", onClickCapture, true);

  const controller: Cycle2Controller = {
    setConfiguration,
    canExport,
    getSnapshot: snapshot,
    destroy: () => {
      destroyed = true;
      if (rebuildTimer !== null) runtimeWindow.clearTimeout(rebuildTimer);
      if (scanTimer !== null) runtimeWindow.clearTimeout(scanTimer);
      runtimeDocument.removeEventListener("input", onConfigurationEvent, true);
      runtimeDocument.removeEventListener("change", onConfigurationEvent, true);
      runtimeDocument.removeEventListener("click", onClickCapture, true);
      if (runtimeWindow.ARTEMIS_CYCLE2 === controller) delete runtimeWindow.ARTEMIS_CYCLE2;
    },
  };

  runtimeWindow.ARTEMIS_CYCLE2 = controller;
  publish();
  scheduleGeometryRebuild(revision);
  scanTimer = runtimeWindow.setTimeout(scanForProgrammaticMutations, PROGRAMMATIC_SCAN_MS);
  return controller;
}
