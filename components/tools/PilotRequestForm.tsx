"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Pilot / contact request form.
 *
 * NOTE: No backend is wired up in this phase (see docs/SecurityRules.md and
 * docs/DeploymentPlan.md). On submit we validate client-side and show a success
 * state. To make this live later, POST to a server action / API route backed by
 * an email service or Supabase — keep all keys in environment variables.
 */
const focusAreas = [
  "5D Cashflow Intelligence",
  "ERP / CMiC Cost & Billing",
  "PM Forecast & Projections",
  "Digital Twin (3D/4D/5D)",
  "Executive Reporting",
  "Other",
];

export function PilotRequestForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Intentionally no network call in this phase.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <h2 className="display-serif mt-4 text-2xl text-parchment">Request received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you. This prototype does not yet send messages — once the backend
          is connected, your pilot request will reach the Artemis team directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" autoComplete="name" required />
        <Field label="Work email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization" name="org" autoComplete="organization" />
        <label className="block">
          <span className="mb-1.5 block text-sm text-foreground/80">Focus area</span>
          <select
            name="focus"
            className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
            defaultValue={focusAreas[0]}
          >
            {focusAreas.map((f) => (
              <option key={f} value={f} className="bg-navy-deep">
                {f}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm text-foreground/80">
          What problem are you trying to solve?
        </span>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
          placeholder="Tell us about the project, the pain, and the data you have."
        />
      </label>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Submit Pilot Request
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-foreground/80">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
      />
    </label>
  );
}
