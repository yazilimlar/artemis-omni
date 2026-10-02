"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

/**
 * /integrate pilot request form. Posts to the existing /api/pilot-requests
 * route and adapts to its shape: fields this short form does not collect are
 * sent as "Unspecified", and the primary role travels in `message`.
 */

export const ROLES = [
  "Executive / C-Suite",
  "Project Controls Manager",
  "CFO",
  "Civil / Structural Engineer",
  "General Contractor",
  "Other",
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PilotFormValues = {
  name: string;
  email: string;
  company: string;
  role: string;
  workflow: string;
  website: string; // honeypot
};

/** Client-side checks; the route validates again. Returns an error message or null. */
export function validatePilotForm(values: PilotFormValues): string | null {
  if (!values.name.trim() || !values.email.trim() || !values.company.trim() || !values.workflow.trim()) {
    return "Complete all required fields.";
  }
  if (!EMAIL.test(values.email.trim())) return "Enter a valid work email address.";
  if (!(ROLES as readonly string[]).includes(values.role)) return "Choose a primary role.";
  return null;
}

/** Maps the short form onto the existing /api/pilot-requests payload. */
export function toPilotRequestPayload(values: PilotFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    painPoint: values.workflow.trim(),
    message: `Primary role: ${values.role}`,
    module: "Integrate Artemis",
    industry: "Unspecified",
    currentSystems: "Unspecified",
    timeline: "Unspecified",
    sourcePage: "/integrate",
    website: values.website,
  };
}

const inputClass =
  "w-full rounded-md border border-border/70 bg-background/40 px-4 py-2.5 text-sm text-parchment outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "mb-1.5 block text-sm text-foreground/80";

export function PilotForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: PilotFormValues = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      role: String(data.get("role") ?? ""),
      workflow: String(data.get("workflow") ?? ""),
      website: String(data.get("website") ?? ""),
    };
    const problem = validatePilotForm(values);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/pilot-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPilotRequestPayload(values)),
      });
      const body = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setError(body.error ?? "The request could not be sent. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("The request could not be sent. Check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-lg border border-signal-soft/35 bg-navy-deep/60 p-6">
        <p className="display-serif text-2xl text-parchment">Request received.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you. The Artemis team will review your workflow and reply to your work email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Full Name *</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Work Email *</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Organization / Firm *</span>
          <input name="company" required autoComplete="organization" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Primary Role *</span>
          <select name="role" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Choose a role
            </option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Target Workflow / Decision Loop *</span>
        <textarea name="workflow" required rows={4} className={inputClass} />
      </label>
      {/* Honeypot: hidden from people, filled by naive bots; the route discards those submissions. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request a Pilot"}
        </Button>
        {error ? (
          <p role="alert" className="text-sm text-rose-200">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
