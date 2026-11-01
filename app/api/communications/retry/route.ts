import { NextResponse } from "next/server";
import { MAX_NOTIFICATION_ATTEMPTS, nextRetryAt } from "@/lib/comms/retry";
import { getSupabaseConfig, resendConfig, sendViaResend, supabaseRest, supabaseSelect } from "@/lib/comms/server";
import { sanitizeError } from "@/lib/comms/validation";
import { secretMatches } from "@/lib/comms/webhooks";

export const runtime = "nodejs";

/**
 * Notification retry worker (Issue #276). Gated by the server-only
 * ARTEMIS_COMMS_CRON_SECRET — fail closed when unset or mismatched.
 * Invoke with GET or POST and header `x-cron-secret` or `Authorization: Bearer …`.
 * Returns counts only, never message content or addresses.
 */

type DueRow = {
  id: string;
  category: string;
  sender_name: string;
  sender_email: string;
  message: string;
  notification_attempts: number;
};

function gate(request: Request): NextResponse | null {
  const secret = process.env.ARTEMIS_COMMS_CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Retry worker is not configured." }, { status: 503 });
  }
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  const provided = request.headers.get("x-cron-secret") ?? bearer;
  if (!secretMatches(provided, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

async function run(request: Request) {
  const blocked = gate(request);
  if (blocked) return blocked;
  const config = getSupabaseConfig();
  const resend = resendConfig();
  if (!config || !resend || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "Messaging backend is not configured." }, { status: 503 });
  }
  const nowIso = new Date().toISOString();
  const rows =
    (await supabaseSelect<DueRow>(
      config,
      `artemis_communications?select=id,category,sender_name,sender_email,message,notification_attempts` +
        `&notification_status=in.(notification_queued,notification_failed)` +
        `&notification_attempts=lt.${MAX_NOTIFICATION_ATTEMPTS}` +
        `&or=(next_retry_at.is.null,next_retry_at.lte.${encodeURIComponent(nowIso)})` +
        `&order=created_at.asc&limit=20`,
    )) ?? [];

  let acceptedCount = 0;
  let failedCount = 0;
  for (const row of rows) {
    const attempts = row.notification_attempts + 1;
    const sent = await sendViaResend({
      idempotencyKey: row.id, // same key as the first attempt: Resend dedupes
      from: resend.from,
      to: resend.to,
      subject: `[ARTEMIS] ${row.category} · ${row.id.slice(0, 8)}`,
      text: `Reference: ${row.id}\nCategory: ${row.category}\nFrom: ${row.sender_name} <${row.sender_email}>\n\n${row.message}`,
      replyTo: row.sender_email,
    });
    const patch = sent.ok
      ? {
          notification_status: "provider_accepted",
          provider_message_id: sent.providerMessageId,
          notification_attempts: attempts,
          notification_error: null,
          next_retry_at: null,
        }
      : {
          notification_status: "notification_failed",
          notification_attempts: attempts,
          notification_error: sanitizeError(sent.error),
          next_retry_at: nextRetryAt(attempts), // null at the cap = terminal
        };
    const res = await supabaseRest(config, `artemis_communications?id=eq.${row.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    }).catch(() => null);
    if (!res?.ok) {
      console.error(JSON.stringify({ event: "artemis_comms_retry_update_failed", reference: row.id }));
      failedCount += 1;
      continue;
    }
    if (sent.ok) acceptedCount += 1;
    else failedCount += 1;
  }
  return NextResponse.json(
    { ok: true, processed: rows.length, accepted: acceptedCount, failed: failedCount },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  return run(request);
}
export async function GET(request: Request) {
  return run(request);
}
