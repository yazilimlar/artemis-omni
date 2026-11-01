/**
 * Pure validation + sanitization for Communications Hub intake (Issue #276).
 * No DB, no env, no network — unit-testable in isolation.
 */

export const COMMS_CATEGORIES = [
  "General inquiry",
  "Engineering collaboration",
  "Technical support",
  "Project pilot",
] as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strip CR/LF and other control characters, collapse whitespace, trim. */
export function sanitizeName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip control characters except tab/newline (message bodies keep line breaks). */
export function sanitizeMessage(value: unknown): string {
  if (typeof value !== "string") return "";
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, " ")
      .trim()
  );
}

/** Sanitize a provider/error string before it is stored or logged. */
export function sanitizeError(value: unknown, max = 500): string {
  if (value instanceof Error) value = value.message;
  if (typeof value !== "string") return "unknown_error";
  const clean = sanitizeName(value).slice(0, max);
  return clean || "unknown_error";
}

const IDEMPOTENCY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{7,79}$/;

/** Optional client idempotency key / submissionId: UUID-ish, <= 80 chars. */
export function isValidIdempotencyKey(value: unknown): value is string {
  return typeof value === "string" && IDEMPOTENCY_PATTERN.test(value);
}

export function normalizeIdempotencyKey(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  return isValidIdempotencyKey(value) ? value : null;
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

export type IntakeInput = {
  category: string;
  name: string;
  email: string;
  message: string;
};

export function validateIntake(data: Record<string, unknown>):
  | { ok: true; value: IntakeInput }
  | { ok: false; error: string } {
  const category = typeof data.category === "string" ? data.category : "";
  const name = sanitizeName(data.name);
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const message = sanitizeMessage(data.message);
  if (!(COMMS_CATEGORIES as readonly string[]).includes(category)) {
    return { ok: false, error: "Please check your fields." };
  }
  if (name.length < 1 || name.length > 120) return { ok: false, error: "Please check your fields." };
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return { ok: false, error: "Please check your fields." };
  if (message.length < 10 || message.length > 4000) return { ok: false, error: "Please check your fields." };
  return { ok: true, value: { category, name, email, message } };
}
