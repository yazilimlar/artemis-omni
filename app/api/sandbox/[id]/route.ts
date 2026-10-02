import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { clientIp, hashIp } from "@/lib/auth/ip-hash";
import { SANDBOX_ROOT, artifactHeaders, findArtifact, resolveEntryPath } from "@/lib/sandbox/artifacts";
import { checkArtifactAccess, recordExecution } from "@/lib/sandbox/server";

export const dynamic = "force-dynamic";

function json(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Serves a registered artifact's entry file with ADR-014 headers. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artifact = findArtifact(id);
  if (!artifact) return json(404, "not_found");

  const access = await checkArtifactAccess(artifact);
  if (!access.ok) return json(access.status, access.error);

  // Path guard: resolved path must stay inside sandbox/<id>/, including after symlinks.
  const entryPath = resolveEntryPath(artifact);
  if (!entryPath) return json(404, "not_found");
  let body: Buffer;
  try {
    const real = await realpath(entryPath);
    const realRoot = await realpath(SANDBOX_ROOT);
    if (!real.startsWith(path.join(realRoot, artifact.id) + path.sep)) return json(404, "not_found");
    body = await readFile(real);
  } catch {
    return json(404, "not_found");
  }

  // Rate limit + audit before serving (fail closed if logging is unavailable).
  let ipHash: string;
  try {
    ipHash = hashIp(clientIp(request.headers));
  } catch {
    return json(503, "sandbox_not_configured");
  }
  const logged = await recordExecution({
    artifactId: artifact.id,
    event: "serve",
    bytesServed: body.byteLength,
    ipHash,
  });
  if (logged === "limited") return json(429, "rate_limited");
  if (logged === "error") return json(503, "audit_unavailable");

  return new Response(new Uint8Array(body), { status: 200, headers: artifactHeaders(artifact, body.byteLength) });
}
