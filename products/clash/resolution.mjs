// Revision MECHANISM (defined, never executed). Clash detection does not change geometry or
// quantities. An accepted resolution becomes a revision that must regenerate geometry and
// quantities through the existing pipeline, keeping original and revised side by side with
// traceable IDs. Nothing here edits routes, calls qtyFor()/estimate(), or touches BOM/EVM/claims.
import crypto from "node:crypto";
import { canonical } from "./clash-engine.mjs";

export const REVISION_STEPS = [
  "1. apply the geometry edit to the ROUTE PARAMETERS (never to quantities)",
  "2. generateRoutes() -> buildSpools() regenerate segments and spools",
  "3. qtyFor() -> estimate() recompute pipeline quantities and cost (the only source of cost)",
  "4. reconcileRevision(): original vs revised by stable IDs; replacement, not addition",
  "5. costDelta = revised estimate total - original estimate total; shown only after step 3",
  "6. commercial effect (change order, EVM, claims) needs an approved change order; none is created here"
];

/** Build a PLANNED (not executed) revision record from a clash + chosen resolution. */
export function planRevision({ clash, baselineRef }) {
  const pr = clash.proposedResolution;
  const revisionId = "REV-" + crypto.createHash("sha256").update(`${clash.id}|${pr.action}|${pr.moveObjectId}|${pr.axis}|${pr.direction}|${pr.distanceFt}`).digest("hex").slice(0, 10).toUpperCase();
  return {
    revisionId, status: "PLANNED_NOT_EXECUTED", fromClashId: clash.id, action: pr.action,
    original: { ref: baselineRef ?? null, spoolTags: pr.affected.spoolTags, runIds: pr.affected.runIds, segmentIds: pr.affected.segmentIds },
    revised: { ref: null, spoolTags: null, note: "produced by regeneration (steps 2-3); not available until executed" },
    steps: REVISION_STEPS, costDelta: null, quantityDelta: null,
    guards: ["revised spools REPLACE original affected spools (supersedes), never add to them", "no commercial change without an approved change order", "clash detection output is never a quantity source"]
  };
}

/**
 * Pure check of a (caller-supplied) revised spool set against the original.
 * revised.spools = unaffected originals (unchanged) + replacements carrying `supersedes: [tags]`.
 */
export function reconcileRevision(original, revised, affectedTags) {
  const errors = [];
  const aff = new Set(affectedTags);
  const tags = revised.map(s => s.tag);
  if (new Set(tags).size !== tags.length) errors.push("DUPLICATE_TAG_IN_REVISED");
  const origByTag = Object.fromEntries(original.map(s => [s.tag, s]));
  for (const t of aff) if (!(t in origByTag)) errors.push(`AFFECTED_TAG_NOT_IN_ORIGINAL:${t}`);
  const repl = revised.filter(s => Array.isArray(s.supersedes));
  const superseded = repl.flatMap(s => s.supersedes);
  if (new Set(superseded).size !== superseded.length) errors.push("ORIGINAL_SUPERSEDED_TWICE");
  for (const t of aff) if (!superseded.includes(t)) errors.push(`AFFECTED_NOT_REPLACED:${t}`);
  for (const t of superseded) if (!aff.has(t)) errors.push(`REPLACED_UNAFFECTED:${t}`);
  for (const s of revised) if (tags.filter(x => x === s.tag).length === 1 && aff.has(s.tag)) errors.push(`ORIGINAL_AFFECTED_STILL_PRESENT:${s.tag}`);
  const keep = revised.filter(s => !Array.isArray(s.supersedes));
  const unaffectedOrig = original.filter(s => !aff.has(s.tag));
  if (canonical(keep.sort((a, b) => (a.tag < b.tag ? -1 : 1))) !== canonical(unaffectedOrig.slice().sort((a, b) => (a.tag < b.tag ? -1 : 1)))) errors.push("UNAFFECTED_SPOOLS_CHANGED");
  const sum = (a, k) => a.reduce((x, s) => x + (s[k] || 0), 0);
  return {
    ok: errors.length === 0, errors: errors.sort(),
    delta: { lengthCu: sum(revised, "lengthCu") - sum(original, "lengthCu"), weightLb: sum(revised, "weightLb") - sum(original, "weightLb"), spoolCount: revised.length - original.length },
    costDelta: null, costDeltaNote: "only from a regenerated estimate(); never derived here"
  };
}
