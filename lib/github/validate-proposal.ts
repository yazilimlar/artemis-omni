/**
 * Validation for registry proposals (ADR-013). Pure functions only, so this
 * module is safe to import from client components and unit tests.
 */
import type { RegistryProduct } from "@/lib/registry/load";

export const PROPOSAL_FIELDS = ["visibility", "lifecycle", "maturity", "canonical_route"] as const;
export type ProposalField = (typeof PROPOSAL_FIELDS)[number];

/** Visibility classes (status_definitions.visibility) plus UNREVIEWED. */
export const VISIBILITY_VALUES = [
  "public",
  "public_safe_demo",
  "noindex_review",
  "authenticated",
  "private_pilot",
  "internal_operations",
  "UNREVIEWED",
] as const;

export const MIN_REASON_LENGTH = 10;

/**
 * A route path made only of URL-safe characters. This keeps the edited YAML
 * value a plain scalar that needs no quoting.
 */
const ROUTE_PATTERN = /^\/[A-Za-z0-9._~\-/]*$/;

export type ProposalParams = {
  productId: string;
  field: string;
  /** Form value. For canonical_route, the literal "null" means YAML null. */
  newValue: string;
  reason: string;
};

export type FieldContext = {
  /** status_definitions.lifecycle from the loader. */
  lifecycles: readonly string[];
  /** status_definitions.maturity from the loader. */
  maturities: readonly string[];
};

export function isProposalField(field: string): field is ProposalField {
  return (PROPOSAL_FIELDS as readonly string[]).includes(field);
}

/**
 * Selectable values for a field. canonical_route is free text, so only its
 * special values are listed.
 */
export function getAllowedFieldValues(field: string, ctx: FieldContext): string[] {
  switch (field) {
    case "visibility":
      return [...VISIBILITY_VALUES];
    case "lifecycle":
      return [...ctx.lifecycles, "UNREVIEWED"];
    case "maturity":
      return [...ctx.maturities, "UNREVIEWED"];
    case "canonical_route":
      return ["null", "UNREVIEWED"];
    default:
      return [];
  }
}

function isAllowedValue(field: ProposalField, value: string, ctx: FieldContext): boolean {
  if (field === "canonical_route") {
    return value === "null" || value === "UNREVIEWED" || ROUTE_PATTERN.test(value);
  }
  return getAllowedFieldValues(field, ctx).includes(value);
}

/** The product's current value as a form string (YAML null becomes "null"). */
export function currentFieldValue(product: RegistryProduct, field: ProposalField): string {
  const value = product[field];
  return value === null ? "null" : value;
}

export function validateProposal(
  params: ProposalParams,
  currentProduct: RegistryProduct | undefined,
  allowedLifecycles: readonly string[],
  allowedMaturities: readonly string[],
): { ok: boolean; error?: string } {
  const reason = params.reason.trim();
  if (reason.length === 0) return { ok: false, error: "A reason is required." };
  if (reason.length < MIN_REASON_LENGTH) {
    return { ok: false, error: `The reason must be at least ${MIN_REASON_LENGTH} characters.` };
  }
  if (!currentProduct || currentProduct.id !== params.productId) {
    return { ok: false, error: `Unknown product "${params.productId}".` };
  }
  if (!isProposalField(params.field)) {
    return { ok: false, error: `Field "${params.field}" cannot be proposed.` };
  }
  const ctx = { lifecycles: allowedLifecycles, maturities: allowedMaturities };
  if (!isAllowedValue(params.field, params.newValue, ctx)) {
    return { ok: false, error: `"${params.newValue}" is not an allowed ${params.field} value.` };
  }
  if (params.newValue === currentFieldValue(currentProduct, params.field)) {
    return { ok: false, error: `${params.field} is already "${params.newValue}".` };
  }
  return { ok: true };
}
