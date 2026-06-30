/**
 * ArtemisIX — generator contracts.
 *
 * ArtemisIX is the next-generation studio. It reuses the Artemis Studio
 * artifact model and adds two domain generators drawn from the Artemis
 * cockpit demonstrators: `dialects` (one truth, six professional voices)
 * and `model3d` (conceptual architecture as a live GLB).
 *
 * Client- and server-safe: no runtime imports here.
 */
import type {
  GeneratorKind as BaseKind,
  GeneratedArtifact,
  GenerateResponse as BaseResponse,
} from "@/lib/studio/types";

export type IXKind = BaseKind | "dialects" | "model3d";

export interface IXGenerateRequest {
  kind: IXKind;
  prompt: string;
  options?: Record<string, string | number | boolean>;
}

export interface IXGenerateResponse extends Omit<BaseResponse, "kind"> {
  kind: IXKind;
}

export type { GeneratedArtifact };
