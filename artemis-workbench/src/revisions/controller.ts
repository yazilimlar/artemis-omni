import {
  affectedNodes,
  configurationPathsToSeeds,
  type DependencyNode,
} from "../dependency-graph/graph";
import {
  configurationFingerprint,
  normalizeConfiguration,
} from "../configuration/normalize";
import {
  DEFAULT_CONFIGURATION,
  type ConfigurationMutation,
  type ConfigurationPatch,
  type MutationSource,
  type WorkbenchConfiguration,
} from "../configuration/types";

export interface RevisionSnapshot {
  readonly revision: number;
  readonly completedRevision: number;
  readonly configuration: WorkbenchConfiguration;
  readonly configurationFingerprint: string | null;
  readonly configurationDirty: boolean;
  readonly geometryDirty: boolean;
  readonly lastMutationSource: MutationSource;
  readonly invalidatedNodes: ReadonlySet<DependencyNode>;
}

export interface CompletedBuild<TModel> {
  readonly revision: number;
  readonly configuration: WorkbenchConfiguration;
  readonly configurationFingerprint: string;
  readonly model: TModel;
}

export type BuildFunction<TModel> = (
  configuration: WorkbenchConfiguration,
  revision: number,
) => Promise<TModel>;

export class WorkbenchRevisionController<TModel> {
  #configuration: WorkbenchConfiguration = DEFAULT_CONFIGURATION;
  #revision = 0;
  #completedRevision = -1;
  #fingerprint: string | null = null;
  #lastMutationSource: MutationSource = "bootstrap";
  #invalidatedNodes = new Set<DependencyNode>([
    "configuration.geometry",
    "configuration.fabrication",
    "configuration.display",
  ]);
  #latestCompletedBuild: CompletedBuild<TModel> | null = null;

  get snapshot(): RevisionSnapshot {
    return Object.freeze({
      revision: this.#revision,
      completedRevision: this.#completedRevision,
      configuration: this.#configuration,
      configurationFingerprint: this.#fingerprint,
      configurationDirty: this.#fingerprint === null,
      geometryDirty: this.#completedRevision !== this.#revision,
      lastMutationSource: this.#lastMutationSource,
      invalidatedNodes: new Set(this.#invalidatedNodes),
    });
  }

  get latestCompletedBuild(): CompletedBuild<TModel> | null {
    return this.#latestCompletedBuild;
  }

  setConfiguration(patch: ConfigurationPatch, source: MutationSource): ConfigurationMutation {
    const previous = this.#configuration;
    const next = normalizeConfiguration(previous, patch);
    const changedPaths = this.#changedPaths(previous, next);

    if (changedPaths.length === 0) {
      return Object.freeze({
        revision: this.#revision,
        source,
        previous,
        next,
        changedPaths,
        timestampMs: Date.now(),
      });
    }

    this.#revision += 1;
    this.#fingerprint = null;
    this.#lastMutationSource = source || "unknown";
    this.#configuration = next;

    const seeds = configurationPathsToSeeds(changedPaths);
    this.#invalidatedNodes = new Set(affectedNodes(seeds));

    return Object.freeze({
      revision: this.#revision,
      source: this.#lastMutationSource,
      previous,
      next,
      changedPaths,
      timestampMs: Date.now(),
    });
  }

  async build(buildFn: BuildFunction<TModel>): Promise<CompletedBuild<TModel> | null> {
    const buildRevision = this.#revision;
    const buildConfiguration = this.#configuration;
    const model = await buildFn(buildConfiguration, buildRevision);

    if (buildRevision !== this.#revision) {
      console.debug(
        `[Build Stale] Revision ${buildRevision} superseded by ${this.#revision}`,
      );
      return null;
    }

    const fingerprint = await configurationFingerprint(buildConfiguration);

    if (buildRevision !== this.#revision) {
      console.debug(
        `[Build Stale] Revision ${buildRevision} superseded by ${this.#revision}`,
      );
      return null;
    }

    const completed = Object.freeze({
      revision: buildRevision,
      configuration: buildConfiguration,
      configurationFingerprint: fingerprint,
      model,
    });

    this.#completedRevision = buildRevision;
    this.#fingerprint = fingerprint;
    this.#invalidatedNodes.clear();
    this.#latestCompletedBuild = completed;
    return completed;
  }

  canExport(): boolean {
    return (
      this.#fingerprint !== null &&
      this.#completedRevision === this.#revision &&
      this.#invalidatedNodes.size === 0
    );
  }

  #changedPaths(
    previous: WorkbenchConfiguration,
    next: WorkbenchConfiguration,
  ): readonly string[] {
    const paths: string[] = [];

    for (const key of Object.keys(previous.geometry) as Array<keyof WorkbenchConfiguration["geometry"]>) {
      if (previous.geometry[key] !== next.geometry[key]) paths.push(`geometry.${key}`);
    }
    for (const key of Object.keys(previous.fabrication) as Array<keyof WorkbenchConfiguration["fabrication"]>) {
      if (previous.fabrication[key] !== next.fabrication[key]) paths.push(`fabrication.${key}`);
    }
    for (const key of Object.keys(previous.display) as Array<keyof WorkbenchConfiguration["display"]>) {
      if (previous.display[key] !== next.display[key]) paths.push(`display.${key}`);
    }

    return paths;
  }
}
