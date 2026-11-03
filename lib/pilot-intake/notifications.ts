import { createHash } from "node:crypto";

/**
 * Pilot intake email notification.
 *
 * The Squarespace contact sync only preserves the requester's name and
 * email. This module delivers the complete intake payload by email through
 * Resend, so the full request is saved in the notification inbox and the
 * owner can reply directly to the requester.
 *
 * Server-only configuration (never committed, set in Vercel):
 * - RESEND_API_KEY    — send-only Resend key for the verified sending domain
 * - CONTACT_EMAIL_TO  — recipient inbox(es), comma-separated
 * - CONTACT_EMAIL_FROM — sender identity on the verified domain,
 *                        e.g. "Artemis <pilot@mail.agoraxai.com>"
 *
 * Adapted from the unmerged 2026-07-15 branch
 * feature/pilot-intake-notifications (email path only; the Twilio phone
 * channels from that branch are out of scope here).
 */

export type PilotNotificationPayload = {
  name: string;
  company: string;
  email: string;
  industry: string;
  currentSystems: string;
  painPoint: string;
  module: string;
  timeline: string;
  message: string;
  sourcePage: string;
};

export type PilotEmailConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

export type PilotNotificationStatus = "sent" | "failed" | "not_configured";

type Fetcher = typeof fetch;

export function loadPilotEmailConfig(
  env: Record<string, string | undefined> = process.env,
): PilotEmailConfig | null {
  const to = splitRecipients(env.CONTACT_EMAIL_TO);
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_FROM || to.length === 0) {
    return null;
  }
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return null;
  return { apiKey, from: env.CONTACT_EMAIL_FROM, to };
}

/**
 * Content-derived ID for one request. Identical resubmissions inside the
 * provider idempotency window collapse into a single delivered email, the
 * same dedupe the Squarespace sync already applies per day.
 */
export function pilotRequestId(payload: PilotNotificationPayload) {
  const canonical = JSON.stringify([
    payload.email,
    payload.company,
    payload.module,
    payload.timeline,
    payload.painPoint,
    payload.message,
  ]);
  const digest = createHash("sha256").update(canonical).digest("hex").slice(0, 16);
  return `pilot-${digest}`;
}

export async function sendPilotEmailNotification(
  payload: PilotNotificationPayload,
  intakeId: string,
  receivedAt: string,
  config: PilotEmailConfig,
  fetcher: Fetcher = fetch,
): Promise<void> {
  const content = formatPilotEmail(payload, intakeId, receivedAt);
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `pilot-intake/${pilotRequestId(payload)}`,
      "User-Agent": "Artemis Omni pilot intake (artemis.agoraxai.com)",
    },
    body: JSON.stringify({
      from: config.from,
      to: config.to,
      reply_to: payload.email,
      subject: `New Artemis pilot request — ${payload.company} — ${payload.module}`,
      html: content.html,
      text: content.text,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Resend returned ${response.status}${detail ? `: ${detail}` : ""}`);
  }
}

export function formatPilotEmail(
  payload: PilotNotificationPayload,
  intakeId: string,
  receivedAt: string,
) {
  const fields: Array<[string, string]> = [
    ["Intake ID", intakeId],
    ["Received", receivedAt],
    ["Name", payload.name],
    ["Company", payload.company],
    ["Email", payload.email],
    ["Industry", payload.industry],
    ["Current systems", payload.currentSystems],
    ["Main pain point", payload.painPoint],
    ["Preferred module", payload.module],
    ["Timeline", payload.timeline],
    ["Message", payload.message || "(No additional message)"],
    ["Source page", payload.sourcePage || "(Not supplied)"],
  ];

  const text = fields.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 12px;vertical-align:top">${escapeHtml(label)}</th>` +
        `<td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const html =
    `<div style="font-family:Arial,sans-serif;color:#152033">` +
    `<h1 style="font-size:22px">New Artemis pilot request</h1>` +
    `<table style="border-collapse:collapse;width:100%;max-width:720px" border="1" cellpadding="0" cellspacing="0">${rows}</table>` +
    `</div>`;

  return { html, text };
}

function splitRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
