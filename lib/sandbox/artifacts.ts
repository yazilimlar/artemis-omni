/**
 * Artifact registry, path guard and response headers for sandboxed execution
 * (ADR-014). Pure apart from reading the registry JSON, so it is unit-testable.
 */
import path from "node:path";
import registryJson from "@/data/artifact-registry.json";

export type ArtifactVisibility =
  | "public"
  | "public_safe_demo"
  | "noindex_review"
  | "authenticated"
  | "private_pilot"
  | "internal_operations";

export type Artifact = {
  id: string;
  title: string;
  source_path: string;
  entry: string;
  visibility: ArtifactVisibility;
  data_mode: string;
  allow_outbound: false | string[];
  resource_limits: { max_session_seconds?: number; cpu?: string; memory?: string };
  owner: string;
  created_at: string;
  updated_at: string;
  notes: string;
};

export const SANDBOX_ROOT = path.resolve(process.cwd(), "sandbox");
export const DEFAULT_MAX_SESSION_SECONDS = 300;

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const ENTRY_PATTERN = /^[A-Za-z0-9._-]+\.html$/;
const ORIGIN_PATTERN = /^https:\/\/[A-Za-z0-9.-]+(:[0-9]+)?$/;

export function isValidArtifactId(id: string): boolean {
  return ID_PATTERN.test(id);
}

/** Throws on any registry entry that breaks ADR-014's rules. */
export function validateRegistry(entries: unknown): Artifact[] {
  if (!Array.isArray(entries)) throw new Error("artifact-registry.json must be an array.");
  const seen = new Set<string>();
  return entries.map((raw) => {
    const a = raw as Artifact;
    if (!a || typeof a.id !== "string" || !isValidArtifactId(a.id)) {
      throw new Error(`Invalid artifact id: ${JSON.stringify(a?.id)}`);
    }
    if (seen.has(a.id)) throw new Error(`Duplicate artifact id: ${a.id}`);
    seen.add(a.id);
    if (a.source_path !== `sandbox/${a.id}/`) {
      throw new Error(`Artifact ${a.id}: source_path must be "sandbox/${a.id}/".`);
    }
    if (typeof a.entry !== "string" || !ENTRY_PATTERN.test(a.entry)) {
      throw new Error(`Artifact ${a.id}: entry must be a single .html file name.`);
    }
    if (a.allow_outbound !== false) {
      if (!Array.isArray(a.allow_outbound) || a.allow_outbound.length === 0 || !a.allow_outbound.every((o) => ORIGIN_PATTERN.test(o))) {
        throw new Error(`Artifact ${a.id}: allow_outbound must be false or a list of https origins.`);
      }
      if (a.visibility === "public_safe_demo") {
        throw new Error(`Artifact ${a.id}: outbound artifacts are owner-only and cannot be public_safe_demo.`);
      }
    }
    if (/@/.test(String(a.owner))) {
      throw new Error(`Artifact ${a.id}: owner must be a role or team, not an email.`);
    }
    return a;
  });
}

const REGISTRY = validateRegistry(registryJson);

export function findArtifact(id: string, registry: readonly Artifact[] = REGISTRY): Artifact | null {
  if (!isValidArtifactId(id)) return null;
  return registry.find((artifact) => artifact.id === id) ?? null;
}

export function listArtifacts(): readonly Artifact[] {
  return REGISTRY;
}

/**
 * Absolute path of the artifact's entry file, or null if it would escape
 * sandbox/<id>/. Callers must also realpath-check before reading (symlinks).
 */
export function resolveEntryPath(artifact: Pick<Artifact, "id" | "entry">, root = SANDBOX_ROOT): string | null {
  const artifactDir = path.resolve(root, artifact.id);
  const target = path.resolve(artifactDir, artifact.entry);
  if (!artifactDir.startsWith(root + path.sep)) return null;
  if (!target.startsWith(artifactDir + path.sep)) return null;
  return target;
}

export function isPublicArtifact(artifact: Artifact): boolean {
  return artifact.visibility === "public_safe_demo";
}

export function buildCsp(artifact: Pick<Artifact, "allow_outbound">): string {
  const connect = artifact.allow_outbound === false ? "'none'" : artifact.allow_outbound.join(" ");
  return [
    "sandbox allow-scripts",
    "default-src 'none'",
    "script-src 'unsafe-inline' 'self'",
    "style-src 'unsafe-inline' 'self'",
    "img-src data: blob:",
    "font-src data:",
    `connect-src ${connect}`,
    "frame-ancestors 'self'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
}

/** Response headers for a served artifact. X-Frame-Options is deliberately absent. */
export function artifactHeaders(artifact: Artifact, bytes: number): Record<string, string> {
  return {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": buildCsp(artifact),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    // ADR-014: only public artifacts may be cached; gated ones must never reach a shared cache.
    "Cache-Control": isPublicArtifact(artifact) ? "public, max-age=300" : "private, no-store",
    "Content-Length": String(bytes),
  };
}

export { EXIT_REASONS, SANDBOX_IFRAME_FLAGS, type ExitReason } from "./constants";
