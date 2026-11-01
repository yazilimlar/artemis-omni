import { NextResponse } from "next/server";
import { deliveryStatusForResendEvent, normalizeDeliveryStatus } from "@/lib/comms/status";
import { getSupabaseConfig, supabaseRest, supabaseSelect } from "@/lib/comms/server";
import { verifySvixSignature } from "@/lib/comms/webhooks";

export const runtime = "nodejs";

/**
 * Resend delivery webhook (Svix-signed), Issue #276.
 * Dedupe method: provider_message_id + delivery_status transition guard —
 * the row is read first; if it already carries the target delivery status
 * the event is acknowledged without a write, so Svix retries are harmless.
 * Fail closed: 503 when RESEND_WEBHOOK_SECRET is unset, 401 on bad signature.
 */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 503 });
  }
  const rawBody = await request.text();
  const verified = verifySvixSignature({
    headers: {
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
    },
    rawBody,
    secret,
  });
  if (!verified) {
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }
  let payload: { type?: string; data?: { email_id?: string } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const delivery = deliveryStatusForResendEvent(payload.type);
  const emailId = payload.data?.email_id;
  if (!delivery || !emailId) {
    return NextResponse.json({ ok: true, ignored: true });
  }
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "Messaging backend is not configured." }, { status: 503 });
  }
  const rows = await supabaseSelect<{ id: string; delivery_status: string }>(
    config,
    `artemis_communications?select=id,delivery_status&provider_message_id=eq.${encodeURIComponent(emailId)}&limit=1`,
  );
  if (!rows || rows.length === 0) {
    return NextResponse.json({ ok: true, ignored: true, reason: "unknown_provider_id" });
  }
  if (normalizeDeliveryStatus(rows[0].delivery_status) === delivery) {
    return NextResponse.json({ ok: true, deduplicated: true });
  }
  const res = await supabaseRest(config, `artemis_communications?id=eq.${rows[0].id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ delivery_status: delivery }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error(JSON.stringify({ event: "artemis_comms_delivery_update_failed", reference: rows[0].id }));
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, deliveryStatus: delivery });
}
