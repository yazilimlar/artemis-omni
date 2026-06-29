/**
 * Artemis Studio — shared generator contracts.
 *
 * These types are imported by BOTH the client workbench and the server API
 * route, so they must stay free of any server-only or browser-only imports.
 */

export type GeneratorKind =
  | "prompt"
  | "image"
  | "video"
  | "sound"
  | "render"
  | "plot"
  | "movie";

export type ArtifactType = "text" | "image" | "audio" | "video" | "json";

/** A single produced output. Text/JSON use `content`; media uses `dataUrl`. */
export interface GeneratedArtifact {
  type: ArtifactType;
  /** Short label shown above the artifact (e.g. "Poster", "Shot list"). */
  label: string;
  /** Markdown/plain text for `text`/`json` artifacts. */
  content?: string;
  /** A `data:` URL for `image` / `audio` / `video` artifacts. */
  dataUrl?: string;
  mimeType?: string;
  meta?: Record<string, unknown>;
}

export interface GenerateRequest {
  kind: GeneratorKind;
  prompt: string;
  /** Free-form generator controls (style, duration, aspect, etc.). */
  options?: Record<string, string | number | boolean>;
}

export interface GenerateResponse {
  id: string;
  kind: GeneratorKind;
  prompt: string;
  /** `simulation` = key-free deterministic output; `live` = real provider. */
  mode: "simulation" | "live";
  provider: string;
  createdAt: string;
  artifacts: GeneratedArtifact[];
  /** Operator-facing notes (e.g. which key would enable live mode). */
  notes?: string[];
}

export interface GenerateError {
  error: string;
}
