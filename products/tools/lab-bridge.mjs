// Read-only bridge to the lab's REAL qtyFor()/estimate()/geometry(): the lab file is never
// modified. Inline scripts that define them are evaluated in a vm sandbox with a minimal DOM
// stub whose control values come from the HTML defaults (plus per-scenario overrides).
// Checks the BASE pipeline. Later lab patches wrap estimate() (P1 overhead, P27 change orders,
// P39 union labor); they only touch cost/labor fields - P39's comment states "Scope quantities
// never change" - so rows[].qty is the same.
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";

export const LAB_PATH = new URL("../../public/standalone/hvac-mechanical-intelligence-bridge/index.html", import.meta.url);

function controlDefaults(html) {
  const d = {};
  for (const m of html.matchAll(/<input\b[^>]*>/g)) {
    const id = /\bid="([^"]+)"/.exec(m[0]);
    const v = /\bvalue="([^"]*)"/.exec(m[0]);
    if (id && v) d[id[1]] = v[1];
  }
  for (const m of html.matchAll(/<select\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    const opts = [...m[2].matchAll(/<option\b([^>]*)>([^<]*)/g)];
    const pick = opts.find(o => /\bselected\b/.test(o[1])) || opts[0];
    if (!pick) continue;
    const v = /\bvalue="([^"]*)"/.exec(pick[1]);
    d[m[1]] = v ? v[1] : pick[2].trim();
  }
  return d;
}

export function loadLab(overrides = {}) {
  const html = fs.readFileSync(LAB_PATH, "utf8");
  const sha256 = crypto.createHash("sha256").update(html).digest("hex");
  const values = { ...controlDefaults(html), ...overrides };
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const defs = scripts.find(s => s.includes("const ACTS=") && s.includes("function qtyFor"));
  const est = scripts.find(s => s.includes("function estimate(g)"));
  if (!defs || !est) throw new Error("lab structure changed: ACTS/qtyFor/estimate script blocks not found");
  const el = id => (id in values ? { value: values[id] } : null);
  const ctx = vm.createContext({ document: { getElementById: el }, window: {}, console });
  vm.runInContext(defs, ctx, { filename: "lab-defs.js" });
  vm.runInContext(est, ctx, { filename: "lab-estimate.js" });
  const run = code => vm.runInContext(code, ctx);
  const g = run("geometry()");
  return {
    sha256, g,
    qtyForSource: run("qtyFor.toString()"),
    acts: run("JSON.parse(JSON.stringify(ACTS))"),
    qtyFor: driver => run(`qtyFor(${JSON.stringify(driver)}, geometry())`),
    // P2: full estimate() result as plain JSON (rows incl. qty, unit, cat, total) for attach/no-mutation checks
    estimateFull: () => JSON.parse(run("JSON.stringify(estimate(geometry()))")),
    estimate: () => run("(function(){const e=estimate(geometry());return {rows:e.rows.map(r=>({id:r.id,driver:r.driver,qty:r.qty,M:r.cat.M,matU:r.matU})),costF:({best:.96,base:1,worst:1.12,recovery:1.18})[val('scenario')]||1}})()"),
  };
}
