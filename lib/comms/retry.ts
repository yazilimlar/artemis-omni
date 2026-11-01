/** Retry backoff for failed notifications (Issue #276). Pure. */

export const MAX_NOTIFICATION_ATTEMPTS = 5;

/** Delay after attempt N (1-based) fails: +5m, +30m, +2h, +12h. */
export const RETRY_DELAYS_MS = [
  5 * 60_000,
  30 * 60_000,
  2 * 60 * 60_000,
  12 * 60 * 60_000,
] as const;

export function retryDelayMs(failedAttempts: number): number | null {
  if (failedAttempts < 1) return RETRY_DELAYS_MS[0];
  if (failedAttempts >= MAX_NOTIFICATION_ATTEMPTS) return null; // terminal
  return RETRY_DELAYS_MS[Math.min(failedAttempts - 1, RETRY_DELAYS_MS.length - 1)];
}

export function nextRetryAt(failedAttempts: number, now: Date = new Date()): string | null {
  const delay = retryDelayMs(failedAttempts);
  return delay === null ? null : new Date(now.getTime() + delay).toISOString();
}

export function isTerminalAttempt(attempts: number): boolean {
  return attempts >= MAX_NOTIFICATION_ATTEMPTS;
}
