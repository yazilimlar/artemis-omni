"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

/**
 * Pilot intake form — STATIC UI ONLY in this phase.
 * No backend, no Supabase, no submission wiring. Submit is disabled and a notice
 * explains the form is not yet active. When wired later, POST via a server action
 * with keys in env vars (see docs/SecurityRules.md).
 */
const projectTypes = [
  "Heavy civil contractor",
  "Infrastructure owner",
  "PMCM team",
  "Engineering / design",
  "Other",
];

const cadences = ["Daily", "Weekly", "Monthly", "Ad-hoc / on demand"];

export function PilotIntakeForm() {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()} aria-describedby="pilot-form-notice">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Company" name="company" autoComplete="organization" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Work email" name="email" type="email" autoComplete="email" />
        <Select label="Project / company type" name="projectType" options={projectTypes} />
      </div>
      <Field label="Current systems (ERP / CMiC, P6, Excel, accounting, file shares…)" name="currentSystems" />
      <Field label="Primary data sources (schedule, cost, field, billing…)" name="dataSources" />
      <Select label="Reporting cadence" name="reportingCadence" options={cadences} />
      <label className="block">
        <span className="mb-1.5 block text-sm text-foreground/80">Current pain points</span>
        <textarea
          name="painPoints"
          rows={4}
          className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
          placeholder="Where do cost, schedule, and cash visibility break down today?"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-foreground/80">Desired pilot outcome</span>
        <textarea
          name="pilotOutcome"
          rows={4}
          className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
          placeholder="What decision or report should be faster, clearer, or more defensible after the pilot?"
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
