/**
 * Sandbox tokens for standalone HTML labs (Batch 5, ADR-014 follow-up).
 * Source of truth: data/standalone-labs.json, which next.config.mjs also reads
 * to emit the matching `Content-Security-Policy: sandbox` response header.
 */
import registry from "@/data/standalone-labs.json";

const ALLOWED_TOKENS = new Set([
  "allow-scripts",
  "allow-downloads",
  "allow-modals",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
]);

/** The iframe `sandbox` value for a lab. Throws (fails the build) on an unknown id or token. */
export function labSandbox(id: string): string {
  const lab = registry.labs.find((entry) => entry.id === id);
  if (!lab) throw new Error(`Unknown standalone lab "${id}" (data/standalone-labs.json).`);
  if (lab.sandbox === null) {
    throw new Error(`Lab "${id}" is exempt from sandboxing (see its reason); do not sandbox it.`);
  }
  for (const token of lab.sandbox.split(" ")) {
    if (!ALLOWED_TOKENS.has(token)) throw new Error(`Lab "${id}" uses disallowed sandbox token "${token}".`);
  }
  return lab.sandbox;
}

export const standaloneLabs = registry.labs;

/** Labs that cannot be isolated without breaking; served same-origin with a recorded reason. */
export const exemptLabs = registry.labs.filter((lab) => lab.sandbox === null);
