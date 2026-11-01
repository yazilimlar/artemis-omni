import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Webhook signature verification helpers (Issue #276). Pure — callers pass
 * the raw body and headers; secrets are passed in, never read from env here.
 */

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** GitHub: X-Hub-Signature-256 = "sha256=" + HMAC-SHA256(secret, rawBody). */
export function verifyGithubSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!secret || !signatureHeader?.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signatureHeader.trim());
}

export type SvixHeaders = { id: string | null; timestamp: string | null; signature: string | null };

/**
 * Resend webhooks are Svix-signed. Secret may be given bare or with the
 * `whsec_` prefix (the suffix is base64). Signed content is
 * `${id}.${timestamp}.${rawBody}`; the signature header carries one or more
 * space-separated `v1,<base64>` entries.
 */
export function verifySvixSignature(args: {
  headers: SvixHeaders;
  rawBody: string;
  secret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}): boolean {
  const { headers, rawBody, secret } = args;
  if (!secret || !headers.id || !headers.timestamp || !headers.signature) return false;
  const ts = Number(headers.timestamp);
  if (!Number.isFinite(ts)) return false;
  const now = args.nowSeconds ?? Math.floor(Date.now() / 1000);
  const tolerance = args.toleranceSeconds ?? 300;
  if (Math.abs(now - ts) > tolerance) return false;

  let key: Buffer;
  try {
    key = secret.startsWith("whsec_")
      ? Buffer.from(secret.slice("whsec_".length), "base64")
      : Buffer.from(secret, "utf8");
  } catch {
    return false;
  }
  if (key.length === 0) return false;
  const expected = createHmac("sha256", key)
    .update(`${headers.id}.${headers.timestamp}.${rawBody}`)
    .digest("base64");
  return headers.signature
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .some((part) => {
      const value = part.startsWith("v1,") ? part.slice(3) : part;
      return safeEqual(expected, value);
    });
}

/** Timing-safe equality for shared secrets (cron gate). */
export function secretMatches(provided: string | null | undefined, expected: string): boolean {
  if (!provided || !expected) return false;
  return safeEqual(provided, expected);
}
