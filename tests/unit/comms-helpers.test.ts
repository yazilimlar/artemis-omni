import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  isValidIdempotencyKey,
  isUuid,
  sanitizeError,
  sanitizeMessage,
  sanitizeName,
  validateIntake,
} from "@/lib/comms/validation";
import {
  deliveryStatusForResendEvent,
  normalizeDeliveryStatus,
  normalizeNotificationStatus,
  notificationStatusCopy,
} from "@/lib/comms/status";
import { MAX_NOTIFICATION_ATTEMPTS, nextRetryAt, retryDelayMs } from "@/lib/comms/retry";
import { secretMatches, verifyGithubSignature, verifySvixSignature } from "@/lib/comms/webhooks";

describe("comms validation + sanitization", () => {
  it("strips CR/LF and control characters from names (email injection guard)", () => {
    expect(sanitizeName("Ada\r\nBcc: victim@example.com")).toBe("Ada Bcc: victim@example.com");
    expect(sanitizeName("  Ada   Lovelace  ")).toBe("Ada Lovelace");
    expect(sanitizeName(42)).toBe("");
  });

  it("keeps message line breaks but strips other control characters", () => {
    expect(sanitizeMessage("line one\nline two")).toBe("line one\nline two");
    expect(sanitizeMessage("a\u0007b")).toBe("a b");
  });

  it("sanitizes stored errors", () => {
    expect(sanitizeError(new Error("boom\r\ninjected"))).toBe("boom injected");
    expect(sanitizeError(null)).toBe("unknown_error");
  });

  it("validates idempotency keys and uuids", () => {
    expect(isValidIdempotencyKey("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isValidIdempotencyKey("short")).toBe(false);
    expect(isValidIdempotencyKey("has spaces in it........")).toBe(false);
    expect(isValidIdempotencyKey("x".repeat(81))).toBe(false);
    expect(isUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
  });

  it("accepts a valid intake and rejects bad category/email/short message", () => {
    const ok = validateIntake({
      category: "General inquiry",
      name: "Ada\r\nLovelace",
      email: "ADA@example.com",
      message: "Hello, I have a question.",
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.value.name).toBe("Ada Lovelace");
      expect(ok.value.email).toBe("ada@example.com");
    }
    expect(validateIntake({ category: "Spam", name: "A", email: "a@b.co", message: "0123456789" }).ok).toBe(false);
    expect(validateIntake({ category: "General inquiry", name: "A", email: "nope", message: "0123456789" }).ok).toBe(false);
    expect(validateIntake({ category: "General inquiry", name: "A", email: "a@b.co", message: "short" }).ok).toBe(false);
  });
});

describe("comms status taxonomy", () => {
  it("maps legacy values cleanly", () => {
    expect(normalizeNotificationStatus("pending")).toBe("notification_queued");
    expect(normalizeNotificationStatus("queued")).toBe("notification_queued");
    expect(normalizeNotificationStatus("notification-pending")).toBe("notification_queued");
    expect(normalizeNotificationStatus("notification-sent")).toBe("provider_accepted");
    expect(normalizeNotificationStatus("provider_accepted")).toBe("provider_accepted");
    expect(normalizeNotificationStatus("notification_failed")).toBe("notification_failed");
    expect(normalizeNotificationStatus("not_requested")).toBe("not_requested");
    expect(normalizeNotificationStatus("something-else")).toBe("notification_queued");
    expect(normalizeNotificationStatus(null)).toBe("notification_queued");
  });

  it("never words provider acceptance as delivery", () => {
    expect(notificationStatusCopy("provider_accepted")).toMatch(/accepted by the email provider/);
    expect(notificationStatusCopy("provider_accepted")).toMatch(/delivery confirmation pending/);
    expect(notificationStatusCopy("notification_queued")).toMatch(/queued/);
  });

  it("maps Resend webhook events onto delivery statuses only", () => {
    expect(deliveryStatusForResendEvent("email.delivered")).toBe("delivered");
    expect(deliveryStatusForResendEvent("email.bounced")).toBe("bounced");
    expect(deliveryStatusForResendEvent("email.complained")).toBe("complained");
    expect(deliveryStatusForResendEvent("email.sent")).toBeNull();
    expect(normalizeDeliveryStatus("delivered")).toBe("delivered");
    expect(normalizeDeliveryStatus("weird")).toBe("unknown");
  });
});

describe("comms retry backoff", () => {
  it("follows +5m, +30m, +2h, +12h and terminates at the cap", () => {
    expect(retryDelayMs(1)).toBe(5 * 60_000);
    expect(retryDelayMs(2)).toBe(30 * 60_000);
    expect(retryDelayMs(3)).toBe(2 * 60 * 60_000);
    expect(retryDelayMs(4)).toBe(12 * 60 * 60_000);
    expect(retryDelayMs(MAX_NOTIFICATION_ATTEMPTS)).toBeNull();
    const now = new Date("2026-10-31T00:00:00.000Z");
    expect(nextRetryAt(1, now)).toBe("2026-10-31T00:05:00.000Z");
    expect(nextRetryAt(MAX_NOTIFICATION_ATTEMPTS, now)).toBeNull();
  });
});

describe("comms webhook verification", () => {
  it("verifies GitHub HMAC-SHA256 signatures and rejects bad ones", () => {
    const body = JSON.stringify({ action: "opened" });
    const secret = "gh-test-secret";
    const good = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyGithubSignature(body, good, secret)).toBe(true);
    expect(verifyGithubSignature(body, "sha256=deadbeef", secret)).toBe(false);
    expect(verifyGithubSignature(body, null, secret)).toBe(false);
    expect(verifyGithubSignature(body, good, "")).toBe(false);
  });

  it("verifies Svix (Resend) signatures with whsec_ secrets and rejects tampering/stale timestamps", () => {
    const rawKey = Buffer.from("svix-test-key-material-0123456789");
    const secret = "whsec_" + rawKey.toString("base64");
    const body = JSON.stringify({ type: "email.delivered", data: { email_id: "em_1" } });
    const ts = 1_800_000_000;
    const signature =
      "v1," +
      createHmac("sha256", rawKey).update(`msg_1.${ts}.${body}`).digest("base64");
    const headers = { id: "msg_1", timestamp: String(ts), signature };
    expect(verifySvixSignature({ headers, rawBody: body, secret, nowSeconds: ts })).toBe(true);
    expect(verifySvixSignature({ headers, rawBody: body + " ", secret, nowSeconds: ts })).toBe(false);
    expect(verifySvixSignature({ headers, rawBody: body, secret, nowSeconds: ts + 10_000 })).toBe(false);
    expect(verifySvixSignature({ headers: { ...headers, signature: "v1,AAAA" }, rawBody: body, secret, nowSeconds: ts })).toBe(false);
  });

  it("compares shared secrets in constant shape (cron gate)", () => {
    expect(secretMatches("s3cret", "s3cret")).toBe(true);
    expect(secretMatches("s3cret", "other")).toBe(false);
    expect(secretMatches(null, "s3cret")).toBe(false);
    expect(secretMatches("s3cret", "")).toBe(false);
  });
});
