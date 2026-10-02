/**
 * Client-safe sandbox constants (ADR-014). No Node.js imports: this module is
 * shared by the /labs/run client frame and the server routes.
 */

/** The only attributes /labs/run grants the artifact frame. */
export const SANDBOX_IFRAME_FLAGS = "allow-scripts";

export const EXIT_REASONS = ["closed", "navigated_away", "timeout", "load_error"] as const;
export type ExitReason = (typeof EXIT_REASONS)[number];
