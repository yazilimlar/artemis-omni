// Usage: node products/tools/check-lab-dom.mjs   (exit 1 on failure, exit 2 if jsdom is unavailable)
// P4a-V DOM gate. Loads the REAL lab page in jsdom twice, WITH and WITHOUT the marked CXP regions (the panel), runs all
// inline scripts, and proves the panel changes nothing that already existed:
//   - no uncaught script exception in either load; the set of environment ("not implemented") warnings is identical;
//   - the existing tab list is identical (the panel adds exactly one extra tab, tCxp, last);
//   - rendered text of every existing view is identical after clicking through all tabs, and after the lab's own recalc
//     button; the whole document text outside the panel is identical;
//   - the lab's built-in RC7 QA reports the same pass/warn/fail counts (0 fail) in both loads;
//   - the panel renders and its tab activates.
// jsdom is not a repo dependency (the repo ships no node_modules). Install it outside the tree and point at it:
//   npm i --prefix /some/dir jsdom@24.1.0 && JSDOM_DIR=/some/dir node products/tools/check-lab-dom.mjs
// If jsdom cannot be loaded this gate FAILS LOUDLY (exit 2); it never passes silently.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { LAB_PATH } from "./lab-bridge.mjs";
import { stripPanel } from "./gen-commissioning-panel.mjs";

let JSDOM, VirtualConsole;
try {
  const req = process.env.JSDOM_DIR ? createRequire(path.join(path.resolve(process.env.JSDOM_DIR), "x.js")) : createRequire(import.meta.url);
  ({ JSDOM, VirtualConsole } = req("jsdom"));
} catch (e) {
  console.log("  FAIL  jsdom is not available (" + String(e.message).split("\n")[0] + "). Install it outside the repo and set JSDOM_DIR; see the header of this file.");
  console.log("\nFAILED: jsdom unavailable (the DOM gate did not run)");
  process.exit(2);
}

let failures = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, okMsg, failMsg) => (c ? ok(okMsg) : fail(failMsg ?? okMsg));
const sha = s => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
const norm = s => s.replace(/\s+/g, " ").trim();
const wait = ms => new Promise(r => setTimeout(r, ms));
const SETTLE_MS = 2500;

async function load(html) {
  const exceptions = [], env = [], vc = new VirtualConsole();
  vc.on("jsdomError", e => (e.type === "not implemented" ? env : exceptions).push(`${e.type}: ${String(e.message).split("\n")[0].slice(0, 100)}`));
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc, url: "https://example.test/lab/" });
  dom.window.addEventListener("error", ev => exceptions.push("window error: " + String(ev.message).slice(0, 100)));
  await wait(SETTLE_MS);
  const d = dom.window.document, r = { dom, d, exceptions, env };
  r.tabs = [...d.querySelectorAll("#tabs .tab")].map(t => `${t.dataset.t}|${norm(t.textContent)}`);
  r.views = {};
  for (const t of d.querySelectorAll("#tabs .tab")) {
    if (t.dataset.t === "tCxp") continue;
    t.dispatchEvent(new dom.window.Event("click", { bubbles: true }));
    r.views[t.dataset.t] = sha(norm(d.getElementById(t.dataset.t)?.textContent ?? "MISSING"));
  }
  const rec = d.getElementById("btnRecalc"); if (rec) rec.click();
  await wait(500);
  r.afterRecalc = {}; for (const id of Object.keys(r.views)) r.afterRecalc[id] = sha(norm(d.getElementById(id)?.textContent ?? "MISSING"));
  // the lab's QA overlay (#rc7QaMask) is excluded: it legitimately reports the new ID and tab counts, and is compared separately below
  const clone = d.body.cloneNode(true); clone.querySelector("#tCxp")?.remove(); clone.querySelector('.tab[data-t="tCxp"]')?.remove(); clone.querySelectorAll("script,style,#rc7QaMask").forEach(n => n.remove()); // visible text only; the panel's tab, page, data and script are excluded
  r.bodyFull = norm(clone.textContent); r.bodyText = sha(r.bodyFull);
  const qa = d.getElementById("btnRunRC7QA") || d.getElementById("btnRC7QA"); if (qa) qa.click();
  await wait(800);
  r.qaSummary = norm(d.getElementById("rc7QaSummary")?.textContent ?? "");
  r.qaRows = [...d.querySelectorAll("#rc7QaTable tr")].map(tr => norm(tr.textContent));
  return r;
}

const html = fs.readFileSync(LAB_PATH, "utf8");
const without = stripPanel(html);
console.log("== loading the lab page without and with the panel (jsdom, inline scripts executed)");
check(without.length < html.length, "panel regions present in the page under test");
const A = await load(without), B = await load(html);

console.log("== no exceptions");
check(A.exceptions.length === 0, `no uncaught script exception without the panel (${A.env.length} environment warning(s))`, `exceptions without panel: ${A.exceptions.join(" | ")}`);
check(B.exceptions.length === 0, "no uncaught script exception with the panel (existing or new script blocks)", `exceptions with panel: ${B.exceptions.join(" | ")}`);
check(JSON.stringify([...A.env].sort()) === JSON.stringify([...B.env].sort()), "environment warnings (jsdom 'not implemented', e.g. canvas) are identical with and without the panel", `env differ: ${A.env} vs ${B.env}`);

console.log("== existing tabs and views unchanged");
check(JSON.stringify(B.tabs.slice(0, -1)) === JSON.stringify(A.tabs) && B.tabs.at(-1).startsWith("tCxp|") && B.tabs.length === A.tabs.length + 1, `existing tab list identical (${A.tabs.length} tabs); the panel adds exactly one tab (tCxp) at the end`);
check(Object.keys(A.views).every(k => A.views[k] === B.views[k] && A.views[k] !== "MISSING"), `rendered text identical for all ${Object.keys(A.views).length} existing views after clicking through them`, `view text differs in: ${Object.keys(A.views).filter(k => A.views[k] !== B.views[k])}`);
check(Object.keys(A.afterRecalc).every(k => A.afterRecalc[k] === B.afterRecalc[k]), "rendered text identical for every existing view after the lab's own recalc button", `after-recalc differs in: ${Object.keys(A.afterRecalc).filter(k => A.afterRecalc[k] !== B.afterRecalc[k])}`);
const firstDiff = (x, y) => { let i = 0; while (i < x.length && x[i] === y[i]) i++; return `at ${i}: «${x.slice(Math.max(0, i - 30), i + 60)}» vs «${y.slice(Math.max(0, i - 30), i + 60)}»`; };
check(A.bodyText === B.bodyText, "whole-document visible text outside the panel is identical", "visible text differs " + firstDiff(A.bodyFull, B.bodyFull));

console.log("== lab built-in QA");
const counts = s => s.replace(/\d+ unique IDs|\d+ tab definitions checked/g, "");
check(A.qaRows.length > 0 && /Fail\s*0/.test(A.qaSummary) && /Fail\s*0/.test(B.qaSummary) && A.qaSummary === B.qaSummary, `RC7 QA summary identical with and without the panel: ${B.qaSummary.slice(0, 90)}`, `QA differs: '${A.qaSummary}' vs '${B.qaSummary}'`);
check(A.qaRows.map(counts).join("|") === B.qaRows.map(counts).join("|"), "every RC7 QA row has the same status (only the ID and tab counts grow)");
check(B.qaRows.some(r => /direct tabBody page.*PASS/i.test(r)) && B.qaRows.some(r => /No duplicate live DOM IDs.*PASS/i.test(r)), "RC7 QA confirms the new tab has a direct tabBody page and no duplicate DOM IDs");

console.log("== panel");
const cxp = B.d.getElementById("cxpRoot");
check(cxp && cxp.textContent.includes("SYNTHETIC DATA") && cxp.textContent.includes("not code compliance"), "panel rendered in the real page with its disclaimers");
B.d.querySelector('#tabs .tab[data-t="tCxp"]').click();
check(B.d.getElementById("tCxp").classList.contains("on") && !B.d.getElementById("tDash").classList.contains("on"), "clicking the new tab activates the panel page");

A.dom.window.close(); B.dom.window.close();
console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), 0 warning(s)`);
process.exit(failures ? 1 : 0);
