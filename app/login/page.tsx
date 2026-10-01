import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { isEmailAllowed, parseAllowedEmails } from "@/lib/auth/allowlist";
import { ALLOWLIST_ENV } from "@/lib/auth/require-auth";
import { createMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = createMetadata({ title: "Sign in", path: "/login", noIndex: true });

const errorMessages: Record<string, string> = {
  auth: "That sign-in link is invalid or has expired. Request a new one.",
  not_allowed: "This email is not authorized for internal pages.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect only allowlisted users. A signed-in but unlisted user stays here;
  // redirecting them would loop with requireAuth().
  const allowed = parseAllowedEmails(process.env[ALLOWLIST_ENV]);
  if (user?.email && isEmailAllowed(user.email, allowed)) redirect("/control");

  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-md">
        <p className="eyebrow">Internal</p>
        <h1 className="display-serif mt-3 text-4xl text-parchment">Sign in</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Internal registry pages are limited to invited, allowlisted accounts. Enter your email to
          receive a one-time sign-in link.
        </p>
        {errorMessage ? (
          <p role="alert" className="mt-6 text-sm text-rose-200">
            {errorMessage}
          </p>
        ) : null}
        <LoginForm />
        <p className="mt-10 text-sm">
          <Link href="/" className="text-gold-soft underline-offset-4 hover:underline">
            ← Back to Artemis
          </Link>
        </p>
      </Container>
    </section>
  );
}
