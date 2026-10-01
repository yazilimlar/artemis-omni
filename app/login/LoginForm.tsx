"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // ADR-011: sign-in never creates accounts; the owner invites users.
          shouldCreateUser: false,
        },
      });
      setStatus(error ? { kind: "error", message: error.message } : { kind: "sent" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Sign-in failed.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <p role="status" className="mt-8 text-sm text-parchment">
        Check your email for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-md border border-border/70 bg-background/40 px-4 text-sm text-parchment outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <Button type="submit" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send sign-in link"}
      </Button>
      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-rose-200">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
