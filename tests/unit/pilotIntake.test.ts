import { describe, expect, it, vi } from "vitest";
import {
  formatPhoneSummary,
  formatPilotEmail,
  hasPhoneNotificationChannel,
  loadPilotNotificationConfig,
  sendEmailNotification,
  sendPhoneNotifications,
} from "@/lib/pilot-intake/notifications";
import {
  hasHoneypot,
  parsePilotRequest,
  pilotRequestId,
  type PilotRequestPayload,
} from "@/lib/pilot-intake/payload";

const payload: PilotRequestPayload = {
  name: "Ada Lovelace",
  company: "Analytical Engines & Co.",
  email: "ada@example.com",
  industry: "Engineering / design",
  currentSystems: "Excel & P6",
  painPoint: "Manual <handoffs>",
  module: "Artemis Flow",
  timeline: "This quarter",
  message: "Please call after 2pm.",
  sourcePage: "https://artemis.agoraxai.com/contact",
};

describe("pilot request parsing", () => {
  it("normalizes valid fields and produces a deterministic opaque ID", () => {
    const parsed = parsePilotRequest({
      ...payload,
      name: "  Ada   Lovelace ",
      email: "ADA@EXAMPLE.COM",
    });

    expect(parsed).toMatchObject({
      ok: true,
      payload: { name: "Ada Lovelace", email: "ada@example.com" },
    });
    if (!parsed.ok) throw new Error("Expected a valid pilot request");
    expect(pilotRequestId(parsed.payload)).toMatch(/^pilot-[a-f0-9]{16}$/);
    expect(pilotRequestId(parsed.payload)).toBe(pilotRequestId(parsed.payload));
  });

  it("rejects incomplete and malformed requests", () => {
    expect(parsePilotRequest({ ...payload, company: "" })).toEqual({
      ok: false,
      error: "Complete all required fields.",
    });
    expect(parsePilotRequest({ ...payload, email: "not-an-email" })).toEqual({
      ok: false,
      error: "Enter a valid email address.",
    });
  });

  it("silently identifies honeypot submissions", () => {
    expect(hasHoneypot({ ...payload, website: "spam.example" })).toBe(true);
    expect(hasHoneypot({ ...payload, website: "" })).toBe(false);
  });
});

describe("pilot notification configuration", () => {
  it("requires complete email credentials and at least one phone sender", () => {
    const config = loadPilotNotificationConfig({
      RESEND_API_KEY: "re_test",
      CONTACT_EMAIL_FROM: "Artemis <pilot@example.com>",
      CONTACT_EMAIL_TO: "owner1@example.com, owner2@example.com",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      CONTACT_PHONE_TO: "+15165550123",
      TWILIO_SMS_FROM: "+15165550124",
    });

    expect(config.email?.to).toEqual(["owner1@example.com", "owner2@example.com"]);
    expect(hasPhoneNotificationChannel(config)).toBe(true);
    expect(hasPhoneNotificationChannel({ email: config.email, twilio: null })).toBe(false);
  });
});

describe("pilot notification delivery", () => {
  it("sends a complete, escaped, idempotent email", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    const requestId = pilotRequestId(payload);

    await sendEmailNotification(
      payload,
      requestId,
      "2026-07-15T13:00:00.000Z",
      {
        apiKey: "re_test",
        from: "Artemis <pilot@example.com>",
        to: ["owner1@example.com", "owner2@example.com"],
      },
      fetchMock as typeof fetch,
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const calls = fetchMock.mock.calls as unknown as Array<
      [RequestInfo | URL, RequestInit | undefined]
    >;
    const [url, init] = calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init?.headers).toMatchObject({
      "Idempotency-Key": `pilot-intake/${requestId}`,
    });
    const body = JSON.parse(String(init?.body));
    expect(body.to).toEqual(["owner1@example.com", "owner2@example.com"]);
    expect(body.reply_to).toBe(payload.email);
    expect(body.text).toContain("Message: Please call after 2pm.");
    expect(body.html).toContain("Manual &lt;handoffs&gt;");
    expect(body.html).not.toContain("Manual <handoffs>");
  });

  it("attempts SMS, WhatsApp, and enabled voice calls independently", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 201 }));
    const result = await sendPhoneNotifications(
      payload,
      pilotRequestId(payload),
      {
        accountSid: "AC123",
        authToken: "secret",
        phoneTo: "+15165550123",
        smsFrom: "+15165550124",
        whatsappFrom: "+15165550125",
        whatsappContentSid: "HX123",
        voiceFrom: "+15165550126",
        voiceEnabled: true,
      },
      fetchMock as typeof fetch,
    );

    expect(result).toEqual({ sent: ["sms", "whatsapp", "voice"], failed: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const calls = fetchMock.mock.calls as unknown as Array<
      [RequestInfo | URL, RequestInit | undefined]
    >;
    const requestBodies = calls.map(([, init]) => String(init?.body));
    expect(requestBodies.some((body) => body.includes("ContentSid=HX123"))).toBe(true);
    expect(requestBodies.some((body) => body.includes("Twiml="))).toBe(true);
  });

  it("returns channel-level failures without hiding successful phone delivery", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 201 }))
      .mockResolvedValueOnce(new Response("not approved", { status: 400 }));
    const result = await sendPhoneNotifications(
      payload,
      pilotRequestId(payload),
      {
        accountSid: "AC123",
        authToken: "secret",
        phoneTo: "+15165550123",
        smsFrom: "+15165550124",
        whatsappFrom: "+15165550125",
        whatsappContentSid: null,
        voiceFrom: null,
        voiceEnabled: false,
      },
      fetchMock as typeof fetch,
    );

    expect(result.sent).toEqual(["sms"]);
    expect(result.failed[0]).toMatchObject({ channel: "whatsapp" });
  });

  it("formats full email records and short phone summaries", () => {
    const email = formatPilotEmail(payload, "pilot-test", "2026-07-15T13:00:00.000Z");
    expect(email.text).toContain("Current systems: Excel & P6");
    expect(email.text).toContain("Source page: https://artemis.agoraxai.com/contact");
    expect(formatPhoneSummary(payload, "pilot-test")).toContain("Full details were emailed.");
  });
});
