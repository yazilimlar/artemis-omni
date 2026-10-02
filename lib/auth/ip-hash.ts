import "server-only";
import { createHmac } from "node:crypto";

/** Server-only salt for IP hashing (ADR-014). */
export const IP_SALT_ENV = "ARTEMIS_IP_SALT";

/**
 * HMAC-SHA256 of an IP address with the server-only salt. Raw IPs are never
 * stored. Fails closed: throws when the salt is missing.
 */
export function hashIp(ip: string): string {
  const salt = process.env[IP_SALT_ENV];
  if (!salt) throw new Error(`${IP_SALT_ENV} is not configured.`);
  return createHmac("sha256", salt).update(ip).digest("hex");
}

/** Client IP as reported by Vercel's edge; "unknown" when absent (e.g. local dev). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
