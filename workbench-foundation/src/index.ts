/** ARTEMIS Workbench v6 foundation — public module surface. */
export * as quantize from "./core/quantize";
export * as polygon from "./geometry/polygon";
export * as panelSignature from "./geometry/panelSignature";
export * as planarity from "./geometry/planarity";
export const ENGINE_VERSION: string = (globalThis as any).__ENGINE_VERSION__ ?? "dev";
