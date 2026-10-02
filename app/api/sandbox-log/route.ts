import { NextResponse, type NextRequest } from "next/server";
import { clientIp, hashIp } from "@/lib/auth/ip-hash";
import { EXIT_REASONS, findArtifact, type ExitReason } from "@/lib/sandbox/artifacts";
import { recordExecution } from "@/lib/sandbox/server";

export const dynamic = "force-dynamic";

const MAX_DURATION_MS = 24 * 60 * 60 * 1000;

function status(code: number, error?: string) {
  return error
    ? NextResponse.json({ error }, { status: code, headers: { "Cache-Control": "no-store" } })
    : new NextResponse(null, { status: code, headers: { "Cache-Control": "no-store" } });
}

/** Session telemetry beacon from /labs/run (ADR-014). Same-origin POST only. */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return status(403, "cross_origin");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return status(400, "invalid_json");
  }
  const { id, durationMs, exit_reason } = (payload ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || !findArtifact(id)) return status(400, "unknown_artifact");
  if (typeof durationMs !== "number" || !Number.isInteger(durationMs) || durationMs < 0 || durationMs > MAX_DURATION_MS) {
    return status(400, "invalid_duration");
  }
  if (typeof exit_reason !== "string" || !EXIT_REASONS.includes(exit_reason as ExitReason)) {
    return status(400, "invalid_exit_reason");
  }

  let ipHash: string;
  try {
    ipHash = hashIp(clientIp(request.headers));
  } catch {
    return status(503, "sandbox_not_configured");
  }
  const logged = await recordExecution({
    artifactId: id,
    event: "session",
    durationMs,
    exitReason: exit_reason,
    ipHash,
  });
  if (logged === "limited") return status(429, "rate_limited");
  if (logged === "error") return status(503, "audit_unavailable");
  return status(200);
}
