import { sanitizeError } from "./validation";

/**
 * SERVER-ONLY Supabase REST + Resend helpers — never import from a Client
 * Component: this module reads the service-role key from server env.
 * (Deliberately no server-only package import: route handlers use it, and unit tests
 * import those handlers directly, where that package throws.)
 * Server-only Supabase REST + Resend helpers for Communications Hub routes.
 * The service role key is used only here / in route handlers on the server;
 * the table has RLS enabled with no policies, so this is the only data path.
 */

export type SupabaseConfig = { url: string; serviceKey: string };

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url: url.replace(/\/$/, ""), serviceKey };
}

export async function supabaseRest(
  config: SupabaseConfig,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function supabaseSelect<T>(
  config: SupabaseConfig,
  path: string,
): Promise<T[] | null> {
  const res = await supabaseRest(config, path, { method: "GET" });
  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as T[] | null;
  return Array.isArray(data) ? data : null;
}

/** Count rows matching a PostgREST filter path, via the count in Content-Range. */
export async function supabaseCount(config: SupabaseConfig, path: string): Promise<number | null> {
  const res = await supabaseRest(config, path, {
    method: "GET",
    headers: { Prefer: "count=exact", Range: "0-0" },
  });
  if (!res.ok) return null;
  const range = res.headers.get("content-range") ?? "";
  const total = Number(range.split("/")[1]);
  return Number.isFinite(total) ? total : null;
}

export type ResendResult =
  | { ok: true; providerMessageId: string | null }
  | { ok: false; error: string; status: number };

/**
 * Send one text-only email via Resend. Reads the JSON response so the
 * provider message id is captured — acceptance is recorded, never delivery.
 */
export async function sendViaResend(args: {
  idempotencyKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<ResendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "resend_not_configured", status: 0 };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": args.idempotencyKey,
      },
      body: JSON.stringify({
        from: args.from,
        to: [args.to],
        subject: args.subject,
        text: args.text,
        ...(args.replyTo ? { reply_to: args.replyTo } : {}),
      }),
      cache: "no-store",
    });
    const body = (await res.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;
    if (!res.ok) {
      return {
        ok: false,
        error: sanitizeError(body?.message ?? body?.name ?? `resend_status_${res.status}`),
        status: res.status,
      };
    }
    return { ok: true, providerMessageId: typeof body?.id === "string" ? body.id : null };
  } catch (error) {
    return { ok: false, error: sanitizeError(error), status: 0 };
  }
}

export function resendConfig(): { from: string; to: string } | null {
  const from = process.env.ARTEMIS_COMMS_FROM;
  const to = process.env.ARTEMIS_COMMS_TO;
  return from && to ? { from, to } : null;
}
