export type MutationSource = string;

export interface GeometryConfiguration {
  readonly radius: number;
  readonly frequency: number;
  readonly classType: "I" | "II" | "III";
}

export interface FabricationConfiguration {
  readonly materialId: string;
  readonly panelThicknessMm: number;
  readonly strutProfileId: string;
}

export interface DisplayConfiguration {
  readonly showPanels: boolean;
  readonly showNodes: boolean;
  readonly showDimensions: boolean;
}

export interface WorkbenchConfiguration {
  readonly geometry: GeometryConfiguration;
  readonly fabrication: FabricationConfiguration;
  readonly display: DisplayConfiguration;
}

export type DeepPartial<T> = {
  readonly [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type ConfigurationPatch = DeepPartial<WorkbenchConfiguration>;

export interface ConfigurationMutation {
  readonly revision: number;
  readonly source: MutationSource;
  readonly previous: WorkbenchConfiguration;
  readonly next: WorkbenchConfiguration;
  readonly changedPaths: readonly string[];
  readonly timestampMs: number;
}

export const DEFAULT_CONFIGURATION: WorkbenchConfiguration = Object.freeze({
  geometry: Object.freeze({
    radius: 5000,
    frequency: 3,
    classType: "I" as const,
  }),
  fabrication: Object.freeze({
    materialId: "AL-6061-T6",
    panelThicknessMm: 3,
    strutProfileId: "TUBE-DEFAULT",
  }),
  display: Object.freeze({
    showPanels: true,
    showNodes: true,
    showDimensions: false,
  }),
});
