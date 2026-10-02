import "server-only";
import { isEmailAllowed, parseAllowedEmails } from "@/lib/auth/allowlist";
import { getProfile } from "@/lib/auth/profile";
import { ALLOWLIST_ENV } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { isPublicArtifact, type Artifact } from "./artifacts";

export type AccessResult =
  | { ok: true }
  | { ok: false; status: 401 | 403; error: string };

/**
 * ADR-014 access rules, without redirects (used by route handlers):
 * public_safe_demo runs for anyone; everything else needs an allowlisted
 * session (ADR-011); allow_outbound artifacts are owner-only (ADR-012 role).
 */
export async function checkArtifactAccess(artifact: Artifact): Promise<AccessResult> {
  if (isPublicArtifact(artifact) && artifact.allow_outbound === false) return { ok: true };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, status: 401, error: "sign_in_required" };

  const allowed = parseAllowedEmails(process.env[ALLOWLIST_ENV]);
  if (!isEmailAllowed(user.email, allowed)) return { ok: false, status: 403, error: "not_allowed" };

  if (artifact.allow_outbound !== false) {
    const profile = await getProfile(user.id);
    if (profile?.role !== "owner") return { ok: false, status: 403, error: "owner_only" };
  }
  return { ok: true };
}

export type LogEvent = {
  artifactId: string;
  event: "serve" | "session";
  durationMs?: number | null;
  exitReason?: string | null;
  bytesServed?: number | null;
  ipHash: string;
};

/**
 * Calls the security-definer log_execution RPC. The user is taken from the
 * session inside the database (auth.uid()), never from a parameter.
 * Returns "ok", "limited" (rate limit hit) or "error" (callers fail closed).
 */
export async function recordExecution(entry: LogEvent): Promise<"ok" | "limited" | "error"> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("log_execution", {
      p_artifact_id: entry.artifactId,
      p_event: entry.event,
      p_duration_ms: entry.durationMs ?? null,
      p_exit_reason: entry.exitReason ?? null,
      p_bytes_served: entry.bytesServed ?? null,
      p_ip_hash: entry.ipHash,
    });
    if (error) return "error";
    return data === true ? "ok" : "limited";
  } catch {
    return "error";
  }
}
