import type { PilotRequestPayload } from "@/lib/pilot-intake/payload";

type Fetcher = typeof fetch;

export type PilotNotificationConfig = {
  email: null | {
    apiKey: string;
    from: string;
    to: string[];
  };
  twilio: null | {
    accountSid: string;
    authToken: string;
    phoneTo: string;
    smsFrom: string | null;
    whatsappFrom: string | null;
    whatsappContentSid: string | null;
    voiceFrom: string | null;
    voiceEnabled: boolean;
  };
};

export type PhoneChannel = "sms" | "whatsapp" | "voice";

export type PhoneNotificationResult = {
  sent: PhoneChannel[];
  failed: Array<{ channel: PhoneChannel; error: string }>;
};

export function loadPilotNotificationConfig(
  env: Record<string, string | undefined> = process.env,
): PilotNotificationConfig {
  const emailTo = splitRecipients(env.CONTACT_EMAIL_TO);
  const email =
    env.RESEND_API_KEY && env.CONTACT_EMAIL_FROM && emailTo.length > 0
      ? {
          apiKey: env.RESEND_API_KEY,
          from: env.CONTACT_EMAIL_FROM,
          to: emailTo,
        }
      : null;

  const twilio =
    env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.CONTACT_PHONE_TO
      ? {
          accountSid: env.TWILIO_ACCOUNT_SID,
          authToken: env.TWILIO_AUTH_TOKEN,
          phoneTo: env.CONTACT_PHONE_TO,
          smsFrom: env.TWILIO_SMS_FROM || null,
          whatsappFrom: env.TWILIO_WHATSAPP_FROM || null,
          whatsappContentSid: env.TWILIO_WHATSAPP_CONTENT_SID || null,
          voiceFrom: env.TWILIO_VOICE_FROM || null,
          voiceEnabled: env.CONTACT_VOICE_ENABLED === "true",
        }
      : null;

  return { email, twilio };
}

export function hasPhoneNotificationChannel(config: PilotNotificationConfig) {
  return Boolean(
    config.twilio &&
      (config.twilio.smsFrom ||
        config.twilio.whatsappFrom ||
        (config.twilio.voiceEnabled && config.twilio.voiceFrom)),
  );
}

export async function sendEmailNotification(
  payload: PilotRequestPayload,
  requestId: string,
  receivedAt: string,
  config: NonNullable<PilotNotificationConfig["email"]>,
  fetcher: Fetcher = fetch,
) {
  const content = formatPilotEmail(payload, requestId, receivedAt);
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `pilot-intake/${requestId}`,
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
    throw await providerError("Resend", response);
  }
}

export async function sendPhoneNotifications(
  payload: PilotRequestPayload,
  requestId: string,
  config: NonNullable<PilotNotificationConfig["twilio"]>,
  fetcher: Fetcher = fetch,
): Promise<PhoneNotificationResult> {
  const jobs: Array<{ channel: PhoneChannel; run: () => Promise<void> }> = [];
  const body = formatPhoneSummary(payload, requestId);

  if (config.smsFrom) {
    const smsFrom = config.smsFrom;
    jobs.push({
      channel: "sms",
      run: () =>
        createTwilioResource(
          config,
          "Messages",
          { To: config.phoneTo, From: smsFrom, Body: body },
          fetcher,
        ),
    });
  }

  if (config.whatsappFrom) {
    const parameters: Record<string, string> = {
      To: withWhatsAppPrefix(config.phoneTo),
      From: withWhatsAppPrefix(config.whatsappFrom),
    };
    if (config.whatsappContentSid) {
      parameters.ContentSid = config.whatsappContentSid;
      parameters.ContentVariables = JSON.stringify({
        1: payload.company,
        2: payload.module,
        3: requestId,
      });
    } else {
      parameters.Body = body;
    }
    jobs.push({
      channel: "whatsapp",
      run: () => createTwilioResource(config, "Messages", parameters, fetcher),
    });
  }

  if (config.voiceEnabled && config.voiceFrom) {
    const voiceFrom = config.voiceFrom;
    const spokenMessage =
      `New Artemis pilot request from ${payload.name} at ${payload.company}. ` +
      `Preferred module: ${payload.module}. Check your email for the complete request.`;
    jobs.push({
      channel: "voice",
      run: () =>
        createTwilioResource(
          config,
          "Calls",
          {
            To: config.phoneTo,
            From: voiceFrom,
            Twiml: `<Response><Say>${escapeXml(spokenMessage)}</Say></Response>`,
          },
          fetcher,
        ),
    });
  }

  const settled = await Promise.allSettled(jobs.map((job) => job.run()));
  return settled.reduce<PhoneNotificationResult>(
    (result, outcome, index) => {
      const channel = jobs[index].channel;
      if (outcome.status === "fulfilled") {
        result.sent.push(channel);
      } else {
        result.failed.push({ channel, error: errorMessage(outcome.reason) });
      }
      return result;
    },
    { sent: [], failed: [] },
  );
}

export function formatPilotEmail(
  payload: PilotRequestPayload,
  requestId: string,
  receivedAt: string,
) {
  const fields: Array<[string, string]> = [
    ["Request ID", requestId],
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

export function formatPhoneSummary(payload: PilotRequestPayload, requestId: string) {
  return [
    "New Artemis pilot request",
    `${payload.name} — ${payload.company}`,
    `Module: ${payload.module}`,
    `Timeline: ${payload.timeline}`,
    `ID: ${requestId}`,
    "Full details were emailed.",
  ].join("\n");
}

function splitRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

async function createTwilioResource(
  config: NonNullable<PilotNotificationConfig["twilio"]>,
  resource: "Messages" | "Calls",
  parameters: Record<string, string>,
  fetcher: Fetcher,
) {
  const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");
  const response = await fetcher(
    `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/${resource}.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(parameters).toString(),
    },
  );

  if (!response.ok) {
    throw await providerError(`Twilio ${resource}`, response);
  }
}

async function providerError(provider: string, response: Response) {
  const detail = (await response.text()).slice(0, 500);
  return new Error(`${provider} returned ${response.status}${detail ? `: ${detail}` : ""}`);
}

function withWhatsAppPrefix(value: string) {
  return value.startsWith("whatsapp:") ? value : `whatsapp:${value}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeXml(value: string) {
  return escapeHtml(value);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown notification error";
}
