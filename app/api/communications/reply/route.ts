import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isEmailAllowed, parseAllowedEmails } from "@/lib/auth/allowlist";
import { ALLOWLIST_ENV } from "@/lib/auth/require-auth";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig, sendViaResend, supabaseRest, supabaseSelect } from "@/lib/comms/server";
import { isUuid, sanitizeMessage } from "@/lib/comms/validation";

export const runtime = "nodejs";

function error(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

type ParentRow = { id: string; category: string; sender_email: string };

/**
 * Operator reply (Issue #276). Mirrors requireAuth() for API context:
 * Supabase session + ARTEMIS_INTERNAL_ALLOWLIST, fail closed with JSON.
 * Outbox honesty: the reply row is recorded FIRST as queued; a failed send
 * leaves a visible failed row, and the parent's reply_status only becomes
 * "replied" when the provider accepts.
 */
export async function POST(request: Request) {
  let operatorEmail: string;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return error("Unauthorized.", 401);
    const allowed = parseAllowedEmails(process.env[ALLOWLIST_ENV]);
    if (!isEmailAllowed(user.email, allowed)) return error("Forbidden.", 403);
    operatorEmail = user.email;
  } catch {
    return error("Unauthorized.", 401);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return error("Invalid JSON.", 400);
  }
  if (!input || typeof input !== "object") return error("Invalid submission.", 400);
  const data = input as Record<string, unknown>;
  const communicationId = data.communicationId;
  const body = sanitizeMessage(data.body);
  if (!isUuid(communicationId)) return error("Invalid communication reference.", 400);
  if (body.length < 1 || body.length > 8000) return error("Reply must be between 1 and 8000 characters.", 400);

  const config = getSupabaseConfig();
  const from = process.env.ARTEMIS_COMMS_FROM;
  if (!config || !from || !process.env.RESEND_API_KEY) {
    return error("Reply service is not configured.", 503);
  }
  const parents = await supabaseSelect<ParentRow>(
    config,
    `artemis_communications?select=id,category,sender_email&id=eq.${communicationId}&limit=1`,
  );
  if (!parents || parents.length === 0) return error("Message not found.", 404);
  const parent = parents[0];

  const replyId = randomUUID();
  const insert = await supabaseRest(config, "artemis_communication_replies", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: replyId,
      communication_id: parent.id,
      direction: "outbound",
      author_email: operatorEmail,
      body,
      send_status: "queued",
    }),
  }).catch(() => null);
  if (!insert?.ok) {
    console.error(JSON.stringify({ event: "artemis_comms_reply_save_failed", reference: parent.id }));
    return error("Reply could not be recorded. Nothing was sent.", 503);
  }

  const replyTo = process.env.ARTEMIS_COMMS_TO || from;
  const sent = await sendViaResend({
    idempotencyKey: replyId,
    from,
    to: parent.sender_email,
    subject: `Re: [ARTEMIS] ${parent.category} · ${parent.id.slice(0, 8)}`,
    text: `${body}\n\n—\nReference: ${parent.id}`,
    replyTo,
  });

  const update = await supabaseRest(config, `artemis_communication_replies?id=eq.${replyId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      send_status: sent.ok ? "provider_accepted" : "failed",
      provider_message_id: sent.ok ? sent.providerMessageId : null,
    }),
  }).catch(() => null);
  if (!update?.ok) {
    console.error(JSON.stringify({ event: "artemis_comms_reply_status_update_failed", reference: parent.id, reply: replyId }));
  }

  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, replyId, status: "failed", error: "Reply was recorded but the provider did not accept it." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  await supabaseRest(config, `artemis_communications?id=eq.${parent.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ reply_status: "replied" }),
  }).catch(() => null);
  return NextResponse.json(
    { ok: true, replyId, status: "provider_accepted" },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
