import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { clientIp, hashIp } from "@/lib/auth/ip-hash";
import { normalizeNotificationStatus } from "@/lib/comms/status";
import { nextRetryAt } from "@/lib/comms/retry";
import {
  getSupabaseConfig,
  resendConfig,
  sendViaResend,
  supabaseCount,
  supabaseRest,
  supabaseSelect,
} from "@/lib/comms/server";
import {
  isValidIdempotencyKey,
  sanitizeError,
  validateIntake,
} from "@/lib/comms/validation";

export const runtime = "nodejs";

function error(message: string, status: number, extra: Record<string, string> = {}) {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers: { "Cache-Control": "no-store", ...extra } },
  );
}

function accepted(requestId: string, status: string, deduplicated = false) {
  return NextResponse.json(
    { ok: true, requestId, status, ...(deduplicated ? { deduplicated: true } : {}) },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}

type StoredRow = { id: string; notification_status: string };

export async function POST(request: Request) {
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 10000) return error("Message too large.", 413);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) return error("Invalid origin.", 403);
    } catch {
      return error("Invalid origin.", 403);
    }
  }
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return error("Invalid JSON.", 400);
  }
  if (!input || typeof input !== "object") return error("Invalid submission.", 400);
  const data = input as Record<string, unknown>;
  if (data.website) return NextResponse.json({ ok: true, requestId: "received", status: "filtered" });

  const validated = validateIntake(data);
  if (!validated.ok) return error(validated.error, 400);
  const { category, name, email, message } = validated.value;

  // Optional client idempotency: header wins, then body submissionId.
  const rawKey = request.headers.get("idempotency-key") ?? data.submissionId;
  let idempotencyKey: string | null = null;
  if (rawKey !== undefined && rawKey !== null && rawKey !== "") {
    if (!isValidIdempotencyKey(rawKey)) return error("Invalid submission identifier.", 400);
    idempotencyKey = rawKey;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return error("Secure messaging is not configured. Please use the existing contact channel.", 503);
  }

  // Rate limit by HMAC-hashed IP (ADR-014; raw IPs are never stored).
  // If the salt is missing the limiter cannot run: warn and skip rather than
  // crash intake — the honeypot, origin check and size cap still apply.
  let ipHash: string | null = null;
  if (process.env.ARTEMIS_IP_SALT) {
    try {
      ipHash = hashIp(clientIp(request.headers));
    } catch {
      ipHash = null;
    }
  } else {
    console.warn(JSON.stringify({ event: "artemis_comms_ip_salt_missing", limiter: "skipped" }));
  }
  if (ipHash) {
    const now = Date.now();
    const sinceHour = new Date(now - 60 * 60_000).toISOString();
    const sinceDay = new Date(now - 24 * 60 * 60_000).toISOString();
    const base = `artemis_communications?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}`;
    const [hourCount, dayCount] = await Promise.all([
      supabaseCount(config, `${base}&created_at=gte.${encodeURIComponent(sinceHour)}`),
      supabaseCount(config, `${base}&created_at=gte.${encodeURIComponent(sinceDay)}`),
    ]);
    if ((hourCount !== null && hourCount >= 5) || (dayCount !== null && dayCount >= 20)) {
      return error("Too many messages. Please try again later.", 429, { "Retry-After": "3600" });
    }
  }

  // Idempotent replay: return the original reference, send nothing again.
  if (idempotencyKey) {
    const existing = await supabaseSelect<StoredRow>(
      config,
      `artemis_communications?select=id,notification_status&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`,
    );
    if (existing && existing.length > 0) {
      return accepted(existing[0].id, normalizeNotificationStatus(existing[0].notification_status), true);
    }
  }

  const id = randomUUID();
  const insert = await supabaseRest(config, "artemis_communications", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id,
      category,
      sender_name: name,
      sender_email: email,
      message,
      notification_status: "notification_queued",
      ip_hash: ipHash,
      idempotency_key: idempotencyKey,
      source: "communications-page",
    }),
  }).catch(() => null);
  if (!insert) {
    console.error(JSON.stringify({ event: "artemis_comms_save_network_error", reference: id }));
    return error("Message could not be saved. Please retry.", 503);
  }
  if (!insert.ok) {
    // Unique idempotency race: another request stored it first.
    if (insert.status === 409 && idempotencyKey) {
      const existing = await supabaseSelect<StoredRow>(
        config,
        `artemis_communications?select=id,notification_status&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`,
      );
      if (existing && existing.length > 0) {
        return accepted(existing[0].id, normalizeNotificationStatus(existing[0].notification_status), true);
      }
    }
    console.error(JSON.stringify({ event: "artemis_comms_save_failed", reference: id, status: insert.status }));
    return error("Message could not be saved. Please retry.", 503);
  }

  // One notification attempt. Text-only body; name was stripped of CR/LF in
  // validation, so header/body injection through the sender name is closed.
  const resend = resendConfig();
  if (!resend || !process.env.RESEND_API_KEY) {
    return accepted(id, "notification_queued");
  }
  const sent = await sendViaResend({
    idempotencyKey: id,
    from: resend.from,
    to: resend.to,
    subject: `[ARTEMIS] ${category} · ${id.slice(0, 8)}`,
    text: `Reference: ${id}\nCategory: ${category}\nFrom: ${name} <${email}>\n\n${message}`,
    replyTo: email,
  });

  const patch = sent.ok
    ? {
        notification_status: "provider_accepted",
        provider_message_id: sent.providerMessageId,
        notification_attempts: 1,
        notification_error: null,
        next_retry_at: null,
      }
    : {
        notification_status: "notification_failed",
        notification_attempts: 1,
        notification_error: sanitizeError(sent.error),
        next_retry_at: nextRetryAt(1),
      };

  let patchOk = false;
  try {
    const res = await supabaseRest(config, `artemis_communications?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    });
    patchOk = res.ok;
  } catch {
    patchOk = false;
  }
  if (!patchOk) {
    // Outbox honesty: never claim provider acceptance the DB does not show.
    console.error(
      JSON.stringify({ event: "artemis_comms_status_update_failed", reference: id, attemptedStatus: patch.notification_status }),
    );
    return accepted(id, "notification_queued");
  }
  return accepted(id, patch.notification_status);
}
