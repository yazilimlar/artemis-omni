/**
 * Email allowlist for internal routes (ADR-011). Pure functions; the raw value
 * comes from the server-only ARTEMIS_INTERNAL_ALLOWLIST environment variable.
 */
export function parseAllowedEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isEmailAllowed(email: string, allowed: string[]): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 && allowed.includes(normalized);
}
