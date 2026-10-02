"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/require-auth";
import { proposeRegistryChange } from "@/lib/github/propose";
import { isProposalField, validateProposal } from "@/lib/github/validate-proposal";
import { loadProducts, loadRegistrySchema } from "@/lib/registry/load";

export type ProposalState = {
  ok: boolean;
  prUrl?: string;
  prNumber?: number;
  error?: string;
};

/** Server Action for useActionState (ADR-013). Re-checks session and role on every call. */
export async function submitProposal(
  _prevState: ProposalState,
  formData: FormData,
): Promise<ProposalState> {
  const { userId, profile } = await requireAuth();
  if (profile?.role !== "owner") return { ok: false, error: "unauthorized" };

  const params = {
    productId: String(formData.get("productId") ?? ""),
    field: String(formData.get("field") ?? ""),
    newValue: String(formData.get("newValue") ?? "").trim(),
    reason: String(formData.get("reason") ?? ""),
  };

  const schema = loadRegistrySchema();
  const product = loadProducts().find((item) => item.id === params.productId);
  const validation = validateProposal(params, product, schema.lifecycles, schema.maturities);
  if (!validation.ok || !isProposalField(params.field)) {
    return { ok: false, error: validation.error ?? "Invalid proposal." };
  }

  try {
    const { prUrl, prNumber } = await proposeRegistryChange({
      userId,
      userRole: profile.role,
      productId: params.productId,
      field: params.field,
      newValue: params.newValue,
      reason: params.reason.trim(),
    });
    revalidatePath("/control/propose");
    return { ok: true, prUrl, prNumber };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Proposal failed." };
  }
}
