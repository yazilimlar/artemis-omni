"use client";

import * as React from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/artemis/products";
import { siteConfig } from "@/lib/site";

/**
 * Pilot intake form.
 * Public-safe submission: no backend, no stored data, no secrets. Submit opens a
 * prefilled email draft to the configured pilot inbox.
 */
const industries = [
  "Heavy civil / infrastructure",
  "General contractor",
  "Engineering / design",
  "Owner / developer",
  "Other",
];

const timelines = ["Exploring", "This quarter", "Next quarter", "Specific deadline"];

const supplementalModules = [
  "CivicBid Intelligence Bridge",
  "Utility Field Claims Command Workbench",
  "Utility Dual Story Cockpit",
];

const moduleOptions = [
  ...supplementalModules,
  ...products.map((product) => product.name),
].filter((value, index, values) => values.indexOf(value) === index);

export function PilotIntakeForm() {
  const [selectedModule, setSelectedModule] = React.useState("");
  const [submittedHref, setSubmittedHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    if (requestedModule && moduleOptions.includes(requestedModule)) {
      setSelectedModule(requestedModule);
    }
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const get = (name: string) => String(formData.get(name) ?? "").trim();
    const company = get("company");
    const preferredModule = get("module");
    const subject = `Artemis pilot request${company ? ` - ${company}` : ""}`;
    const body = [
      "Artemis Pilot Request",
      "",
      `Name: ${get("name")}`,
      `Company: ${company}`,
      `Email: ${get("email")}`,
      `Industry: ${get("industry")}`,
      `Current systems: ${get("currentSystems")}`,
      `Main pain point: ${get("painPoint")}`,
      `Preferred module: ${preferredModule}`,
      `Timeline: ${get("timeline")}`,
      "",
      "Message:",
      get("message") || "(No additional message)",
      "",
      `Source page: ${window.location.href}`,
    ].join("\n");
    const href = `mailto:${siteConfig.links.pilotEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSubmittedHref(href);
    window.location.href = href;
  }

  if (submittedHref) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" aria-hidden />
        <h2 className="display-serif mt-4 text-2xl text-parchment">Pilot draft prepared</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your email app should open with the pilot request filled in. If it did not, open the
          draft again or email {siteConfig.links.pilotEmail}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={submittedHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gold px-6 text-sm font-medium text-lunar shadow-gold transition-all hover:bg-gold-soft hover:shadow-none"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Open Email Draft
          </a>
          <Button type="button" variant="outline" onClick={() => setSubmittedHref(null)}>
            Edit Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={onSubmit}
      aria-describedby="pilot-form-notice"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Company" name="company" autoComplete="organization" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Select label="Industry" name="industry" options={industries} required />
      </div>
      <Field label="Current systems (ERP, P6, Excel, etc.)" name="currentSystems" required />
      <Field label="Main pain point" name="painPoint" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Preferred module"
          name="module"
          options={moduleOptions}
          value={selectedModule}
          onChange={setSelectedModule}
          required
        />
        <Select label="Timeline" name="timeline" options={timelines} required />
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
        Submitting opens a prefilled email draft to {siteConfig.links.pilotEmail}. No form data is
        stored by this website.
      </p>
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
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-foreground/80">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-md border border-border bg-navy-deep/60 px-3 py-2.5 text-sm text-parchment outline-none focus:border-gold/60"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-foreground/80">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
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
