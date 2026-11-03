import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/pilot-requests/route";
import {
  formatPilotEmail,
  loadPilotEmailConfig,
  pilotRequestId,
  sendPilotEmailNotification,
  type PilotNotificationPayload,
} from "@/lib/pilot-intake/notifications";

const payload: PilotNotificationPayload = {
  name: "Ada Example",
  company: "Example Civil",
  email: "ada@example.com",
  industry: "Heavy civil / infrastructure",
  currentSystems: "P6, Excel",
  painPoint: "Forecast vs. actuals reconciliation takes days",
  module: "CivicBid Intelligence Bridge",
  timeline: "This quarter",
  message: "We have <three> years of cost data & want a pilot.",
  sourcePage: "https://artemis.agoraxai.com/contact",
};

const emailEnv = {
  RESEND_API_KEY: "test-resend-key-not-real",
  CONTACT_EMAIL_FROM: "Artemis <pilot@mail.agoraxai.com>",
  CONTACT_EMAIL_TO: "owner@example.com, second@example.com",
};

describe("loadPilotEmailConfig", () => {
  it("requires the Resend key, a sender, and at least one recipient", () => {
    expect(loadPilotEmailConfig(emailEnv)).toEqual({
      apiKey: emailEnv.RESEND_API_KEY,
      from: emailEnv.CONTACT_EMAIL_FROM,
      to: ["owner@example.com", "second@example.com"],
    });
    expect(loadPilotEmailConfig({ ...emailEnv, RESEND_API_KEY: "" })).toBeNull();
    expect(loadPilotEmailConfig({ ...emailEnv, CONTACT_EMAIL_FROM: "" })).toBeNull();
    expect(loadPilotEmailConfig({ ...emailEnv, CONTACT_EMAIL_TO: " , " })).toBeNull();
    expect(loadPilotEmailConfig({})).toBeNull();
  });
});

describe("formatPilotEmail", () => {
  it("includes every intake field in text and escaped HTML", () => {
    const { html, text } = formatPilotEmail(payload, "contact-123", "2026-11-03T11:29:00.000Z");
    for (const value of [
      "contact-123",
      "2026-11-03T11:29:00.000Z",
      payload.name,
      payload.company,
      payload.email,
      payload.industry,
      payload.currentSystems,
      payload.painPoint,
      payload.module,
      payload.timeline,
      payload.sourcePage,
    ]) {
      expect(text).toContain(value);
      expect(html).toContain(value);
    }
    expect(text).toContain("We have <three> years of cost data & want a pilot.");
    expect(html).toContain("We have &lt;three&gt; years of cost data &amp; want a pilot.");
    expect(html).not.toContain("<three>");
  });
});

describe("pilotRequestId", () => {
  it("is deterministic per payload and changes with the request content", () => {
    expect(pilotRequestId(payload)).toBe(pilotRequestId({ ...payload }));
    expect(pilotRequestId(payload)).toMatch(/^pilot-[0-9a-f]{16}$/);
    expect(pilotRequestId({ ...payload, painPoint: "Different pain" })).not.toBe(
      pilotRequestId(payload),
    );
  });
});

describe("sendPilotEmailNotification", () => {
  it("posts the full request to Resend with reply-to and an idempotency key", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "em-1" }), { status: 200 }));
    const config = loadPilotEmailConfig(emailEnv);
    if (!config) throw new Error("config expected");
    await sendPilotEmailNotification(payload, "contact-123", "2026-11-03T11:29:00.000Z", config, fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      `pilot-intake/${pilotRequestId(payload)}`,
    );
    const body = JSON.parse(String(init.body));
    expect(body.from).toBe(emailEnv.CONTACT_EMAIL_FROM);
    expect(body.to).toEqual(["owner@example.com", "second@example.com"]);
    expect(body.reply_to).toBe(payload.email);
    expect(body.subject).toContain(payload.company);
    expect(body.text).toContain(payload.painPoint);
    expect(body.text).toContain(payload.currentSystems);
  });

  it("throws when Resend rejects the send", async () => {
    const fetchMock = vi.fn(async () => new Response("nope", { status: 500 }));
    const config = loadPilotEmailConfig(emailEnv);
    if (!config) throw new Error("config expected");
    await expect(
      sendPilotEmailNotification(payload, "contact-123", "2026-11-03T11:29:00.000Z", config, fetchMock),
    ).rejects.toThrow(/Resend returned 500/);
  });
});

describe("/api/pilot-requests notification flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const post = (body: unknown) =>
    POST(
      new Request("http://localhost/api/pilot-requests", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );

  const formBody = {
    name: payload.name,
    company: payload.company,
    email: payload.email,
    industry: payload.industry,
    currentSystems: payload.currentSystems,
    painPoint: payload.painPoint,
    module: payload.module,
    timeline: payload.timeline,
    message: payload.message,
    sourcePage: payload.sourcePage,
    website: "",
  };

  function stubBackend(resendStatus: number) {
    vi.stubEnv("SQUARESPACE_API_KEY", "test-key-not-real");
    for (const [key, value] of Object.entries(emailEnv)) vi.stubEnv(key, value);
    const fetchMock = vi.fn(async (url: unknown) => {
      if (String(url).includes("api.resend.com")) {
        return new Response(JSON.stringify({ id: "em-1" }), { status: resendStatus });
      }
      return new Response(JSON.stringify({ contact: { id: "c-9" } }), { status: 201 });
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("saves the contact and emails the full request", async () => {
    const fetchMock = stubBackend(200);
    const response = await post(formBody);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      requestId: "c-9",
      status: "created",
      notification: "sent",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const resendCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("resend"),
    ) as unknown as [string, RequestInit];
    const sentBody = JSON.parse(String(resendCall[1].body));
    expect(sentBody.text).toContain(payload.painPoint);
    expect(sentBody.text).toContain(payload.message.replace(/</g, "<"));
  });

  it("still confirms the saved contact when the email fails, and reports it", async () => {
    stubBackend(500);
    const response = await post(formBody);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, requestId: "c-9", notification: "failed" });
  });
});
