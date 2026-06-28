"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/artemis/products";

/**
 * Pilot intake form — STATIC UI ONLY in this phase.
 * No backend, no Supabase, no submission wiring. Submit is disabled and a notice
 * explains the form is not yet active. When wired later, POST via a server action
 * with keys in env vars (see docs/SecurityRules.md).
 */
const industries = [
  "Heavy civil / infrastructure",
  "General contractor",
  "Engineering / design",
  "Owner / developer",
  "Other",
];

const timelines = ["Exploring", "This quarter", "Next quarter", "Specific deadline"];

export function PilotIntakeForm() {
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => e.preventDefault()}
      aria-describedby="pilot-form-notice"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Company" name="company" autoComplete="organization" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Select label="Industry" name="industry" options={industries} />
      </div>
      <Field label="Current systems (ERP, P6, Excel, etc.)" name="currentSystems" />
      <Field label="Main pain point" name="painPoint" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Preferred module"
          name="module"
          options={products.map((p) => p.name)}
        />
        <Select label="Timeline" name="timeline" options={timelines} />
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm text-foreground/80">Message</span>
        <textarea
          name="message"
          rows={5}
          className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
          placeholder="Tell us about the project, the data you have, and where the pain is."
        />
      </label>

      <p id="pilot-form-notice" className="text-xs text-muted-foreground">
        This form is a placeholder — submission is not yet wired to a backend. Nothing you
        enter is sent or stored.
      </p>
      <Button type="submit" size="lg" disabled className="w-full sm:w-auto">
        Submit (coming soon)
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-foreground/80">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-foreground/80">{label}</span>
      <select
        name={name}
        defaultValue=""
        className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
      >
        <option value="" disabled className="bg-navy-deep">
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-navy-deep">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
