// Shared helpers for the P2 routing/spool tools. (check.mjs from P1 keeps its own copy of
// apportion() on purpose: the P1 gate file was not modified in P2.)
import fs from "node:fs";

export const readJson = rel => JSON.parse(fs.readFileSync(new URL(rel, import.meta.url), "utf8"));

/** Largest-remainder apportionment of an integer total across weights -> integers summing to total. */
export function apportion(total, weights) {
  const entries = Array.isArray(weights) ? weights.map((w, i) => [i, w]) : Object.entries(weights);
  const sum = entries.reduce((a, [, w]) => a + w, 0);
  if (!(sum > 0)) throw new Error("apportion: weights must sum > 0");
  const raw = entries.map(([k, w]) => [k, total * w / sum]);
  const out = new Map(raw.map(([k, v]) => [k, Math.floor(v)]));
  let left = total - [...out.values()].reduce((a, b) => a + b, 0);
  raw.map(([k, v]) => [k, v - Math.floor(v)]).sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).forEach(([k]) => { if (left-- > 0) out.set(k, out.get(k) + 1); });
  return Array.isArray(weights) ? weights.map((_, i) => out.get(i)) : Object.fromEntries(out);
}
export const r2 = x => Math.round(x * 100) / 100;
