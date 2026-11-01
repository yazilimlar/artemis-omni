import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseRest } from "@/lib/comms/server";
import { verifyGithubSignature } from "@/lib/comms/webhooks";

export const runtime = "nodejs";

/**
 * GitHub webhook ledger (Issue #276). Records ONLY event/action/repo and a
 * short summary — never full payloads, never private content, no side
 * effects beyond the record. Dedupe is the delivery_id primary key.
 * Fail closed: 503 when GITHUB_WEBHOOK_SECRET is unset, 401 on bad signature.
 */
export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 503 });
  }
  const rawBody = await request.text();
  if (!verifyGithubSignature(rawBody, request.headers.get("x-hub-signature-256"), secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }
  const deliveryId = request.headers.get("x-github-delivery");
  if (!deliveryId) {
    return NextResponse.json({ ok: false, error: "Missing delivery id." }, { status: 400 });
  }
  const event = request.headers.get("x-github-event") ?? "unknown";
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const action = typeof payload.action === "string" ? payload.action : null;
  const repo =
    payload.repository && typeof payload.repository === "object"
      ? String((payload.repository as Record<string, unknown>).full_name ?? "")
      : "";
  const summary = summarize(event, payload);

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "Messaging backend is not configured." }, { status: 503 });
  }
  const res = await supabaseRest(config, "artemis_github_events", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      delivery_id: deliveryId,
      event,
      action,
      repo: repo || null,
      summary,
    }),
  }).catch(() => null);
  if (res && res.status === 409) {
    return NextResponse.json({ ok: true, deduplicated: true });
  }
  if (!res?.ok) {
    console.error(JSON.stringify({ event: "artemis_github_event_save_failed", delivery: deliveryId }));
    return NextResponse.json({ ok: false, error: "Event could not be recorded." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, recorded: true });
}

function summarize(event: string, payload: Record<string, unknown>): string {
  const truncate = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 140);
  if (event === "pull_request") {
    const pr = (payload.pull_request ?? {}) as Record<string, unknown>;
    return truncate(`PR #${String(pr.number ?? "?")}: ${String(pr.title ?? "")}`);
  }
  if (event === "issues") {
    const issue = (payload.issue ?? {}) as Record<string, unknown>;
    return truncate(`Issue #${String(issue.number ?? "?")}: ${String(issue.title ?? "")}`);
  }
  if (event === "push") {
    return truncate(`Push to ${String(payload.ref ?? "")}`);
  }
  return truncate(`${event} ${typeof payload.action === "string" ? payload.action : ""}`);
}
