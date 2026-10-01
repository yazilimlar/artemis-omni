import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed, parseAllowedEmails } from "./allowlist";

/** Server-only allowlist variable named in ADR-011. */
export const ALLOWLIST_ENV = "ARTEMIS_INTERNAL_ALLOWLIST";

/**
 * Gate for internal routes (ADR-011). Call at the top of a Server Component
 * before reading any protected data. Fails closed: no user, an unverifiable
 * user, a missing allowlist, or an unlisted email all end in a redirect.
 */
export async function requireAuth(): Promise<{ email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const allowed = parseAllowedEmails(process.env[ALLOWLIST_ENV]);
  if (!user.email || !isEmailAllowed(user.email, allowed)) {
    await supabase.auth.signOut();
    redirect("/login?error=not_allowed");
  }

  return { email: user.email };
}
