"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/artemis/products";

/**
 * Pilot intake form.
 * Public-safe submission: client posts to an Artemis route handler. The route
 * owns validation and any third-party backend credentials.
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

type SubmitState = "idle" | "submitting" | "success" | "error";

export function PilotIntakeForm() {
  const [selectedModule, setSelectedModule] = React.useState("");
  const [submitState, setSubmitState] = React.useState<SubmitState>("idle");
  const [requestId, setRequestId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const requestedModule = new URLSearchParams(window.location.search).get("module");
    if (requestedModule && moduleOptions.includes(requestedModule)) {
      setSelectedModule(requestedModule);
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const get = (name: string) => String(formData.get(name) ?? "").trim();

    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/pilot-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: get("name"),
          company: get("company"),
          email: get("email"),
          industry: get("industry"),
          currentSystems: get("currentSystems"),
          painPoint: get("painPoint"),
          module: get("module"),
          timeline: get("timeline"),
          message: get("message"),
          sourcePage: window.location.href,
          website: get("website"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        requestId?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Pilot request could not be submitted.");
      }

      setRequestId(result.requestId ?? null);
      setSubmitState("success");
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Pilot request could not be submitted.",
      );
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" aria-hidden />
        <h2 className="display-serif mt-4 text-2xl text-parchment">Pilot request received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your request was sent through the Artemis intake backend and synced for follow-up.
          We will review the module fit and respond with a focused pilot scope.
        </p>
        {requestId ? (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-gold/80">
            Intake ID {requestId}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitState("idle");
              setRequestId(null);
            }}
          >
            Submit Another Request
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
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
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

      {submitState === "error" && errorMessage ? (
        <div
          role="alert"
          className="flex gap-3 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
          <div>
            <p>{errorMessage}</p>
            <p className="mt-1 text-red-100/75">
              Please check your connection and try submitting the form again.
            </p>
          </div>
        </div>
      ) : null}

      <p id="pilot-form-notice" className="text-xs text-muted-foreground">
        Submitting sends your request through the Artemis pilot intake backend for follow-up.
      </p>
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={submitState === "submitting"}
      >
        {submitState === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Submitting
          </>
        ) : (
          "Submit Pilot Request"
        )}
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
