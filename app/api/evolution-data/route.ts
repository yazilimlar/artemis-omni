import fs from "node:fs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ALLOWLIST_ENV } from "@/lib/auth/require-auth";
import { isEmailAllowed, parseAllowedEmails } from "@/lib/auth/allowlist";
import { EVOLUTION_FILE } from "@/lib/evolution/load";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store" };

/**
 * Raw data/evolution.json for signed-in, allowlisted users (ADR-011 chain).
 * Anyone else gets a 404, so the route does not reveal that it exists.
 * requireAuth() redirects, which is wrong for an API, so the same checks run here.
 */
export async function GET() {
  const notFound = () => new NextResponse("Not found", { status: 404, headers: HEADERS });

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const allowed = parseAllowedEmails(process.env[ALLOWLIST_ENV]);
    if (!user?.email || !isEmailAllowed(user.email, allowed)) return notFound();
  } catch {
    return notFound();
  }

  try {
    const body = fs.readFileSync(EVOLUTION_FILE, "utf8");
    return new NextResponse(body, {
      status: 200,
      headers: { ...HEADERS, "Content-Type": "application/json; charset=utf-8" },
    });
  } catch {
    return notFound();
  }
}
