"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MIN_REASON_LENGTH,
  PROPOSAL_FIELDS,
  getAllowedFieldValues,
  type ProposalField,
} from "@/lib/github/validate-proposal";
import type { RegistrySchema } from "@/lib/registry/load";
import { submitProposal, type ProposalState } from "./actions";

type ProductOption = {
  id: string;
  name: string;
  visibility: string;
  lifecycle: string;
  maturity: string;
  canonical_route: string | null;
};

const inputClass =
  "h-11 w-full rounded-md border border-border/70 bg-background/40 px-4 text-sm text-parchment outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "font-mono text-[0.62rem] uppercase tracking-wider text-signal-soft";

const initialState: ProposalState = { ok: false };

export function ProposalForm({
  products,
  schema,
}: {
  products: ProductOption[];
  schema: RegistrySchema;
}) {
  const [state, formAction, pending] = useActionState(submitProposal, initialState);
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [field, setField] = useState<ProposalField>("visibility");

  const product = products.find((item) => item.id === productId);
  const current = product ? (product[field] ?? "null") : "";
  const options = getAllowedFieldValues(field, schema).filter((value) => value !== current);

  if (state.ok && state.prUrl) {
    return (
      <div role="status" className="mt-8 rounded-lg border border-gold/30 bg-gold/5 p-6">
        <p className="text-sm text-parchment">Proposal opened as pull request #{state.prNumber}.</p>
        <p className="mt-2 break-all font-mono text-xs">
          <a href={state.prUrl} className="text-gold-soft underline-offset-4 hover:underline">
            {state.prUrl}
          </a>
        </p>
        <div className="mt-5">
          <Button href={state.prUrl}>View on GitHub</Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <label className="grid gap-2">
        <span className={labelClass}>Product</span>
        <select
          name="productId"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          className={inputClass}
        >
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} · {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Field</span>
        <select
          name="field"
          value={field}
          onChange={(event) => setField(event.target.value as ProposalField)}
          className={inputClass}
        >
          {PROPOSAL_FIELDS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <p className="font-mono text-xs text-muted-foreground">
        Current value: <span className="text-parchment">{current}</span>
      </p>

      <label className="grid gap-2">
        <span className={labelClass}>New value</span>
        {field === "canonical_route" ? (
          <>
            <input
              key={`${productId}-${field}`}
              name="newValue"
              required
              list="route-specials"
              placeholder="/labs/example, null, or UNREVIEWED"
              className={inputClass}
            />
            <datalist id="route-specials">
              {options.map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
          </>
        ) : (
          <select key={`${productId}-${field}`} name="newValue" required className={inputClass}>
            {options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Reason (min {MIN_REASON_LENGTH} characters)</span>
        <textarea
          name="reason"
          required
          minLength={MIN_REASON_LENGTH}
          rows={4}
          className="w-full rounded-md border border-border/70 bg-background/40 px-4 py-3 text-sm text-parchment outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Opening pull request…" : "Open proposal PR"}
      </Button>

      {state.error ? (
        <p role="alert" className="text-sm text-rose-200">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
