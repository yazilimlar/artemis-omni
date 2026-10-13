// Usage: node products/tools/check-commissioning-panel.mjs   (exit 1 on any failure)
// P4a-V gate for the READ-ONLY commissioning panel added to the lab page (the first authorized lab edit since P1).
// Proves: (1) the panel data is FRESH, i.e. regenerated from the products/commissioning module equals both the checked-in
// snapshot and the copy embedded in the page; (2) the edit is purely ADDITIVE: removing the four marked CXP regions
// restores the pre-panel file byte for byte (sha256 == the P1-P4a lab baseline); (3) existing lab behavior is unchanged:
// geometry, ACTS, qtyFor source and estimate() output are identical with and without the panel, in both scenarios;
// (4) the panel script is a pure renderer: no evaluator/ledger logic, no calls into quantity/cost/EVM code, no inputs,
// no storage or network, and when executed against a stub DOM it writes only into #cxpRoot and shows every required
// disclaimer and state. Run after the other six checkers.
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import { loadLab, LAB_PATH } from "./lab-bridge.mjs";
import { readJson } from "./util.mjs";
import { buildPanelSnapshot, SNAPSHOT_PATH, dataBlock, embeddedRegion } from "./gen-commissioning-panel.mjs";

// LAB-VIS-FIX re-baseline (owner-authorized edit of NON-CXP regions: GIS layer config + three chart day-line renderers).
// Stripped-file baseline moved d3f0caaf5f71b8f6… (pre-panel, P1-P4a-V) -> a20de431ec3aefe9… (this branch); comment-only micro-fix then moved it a20de431… -> 8828ebcf… (fire-once tileerror note). The CXP regions are unchanged.
const PRE_PANEL_SHA = "8828ebcf7393c42185d992fa37bfc5f68c9a13339c0d5522a27f2a00616a2038";
const fx = readJson("../hvac/fixtures/allocation.fixture.json");
let failures = 0;
const fail = m => { failures++; console.log("  FAIL  " + m); };
const ok = m => console.log("  ok    " + m);
const check = (c, okMsg, failMsg) => (c ? ok(okMsg) : fail(failMsg ?? okMsg));
const sha = s => crypto.createHash("sha256").update(s).digest("hex");

const html = fs.readFileSync(LAB_PATH, "utf8");
console.log("== markers and additivity");
const REGIONS = ["TAB", "PAGE", "DATA", "SCRIPT"];
let stripped = html, markerOk = true;
for (const r of REGIONS) {
  const re = new RegExp(`^<!-- CXP:${r}:BEGIN -->\\n[\\s\\S]*?^<!-- CXP:${r}:END -->\\n`, "gm");
  const n = (html.match(re) || []).length;
  if (n !== 1 || (html.match(new RegExp(`CXP:${r}:BEGIN`, "g")) || []).length !== 1) markerOk = false;
  stripped = stripped.replace(re, "");
}
check(markerOk, "exactly one line-aligned BEGIN/END marker pair for each of TAB, PAGE, DATA, SCRIPT");
check(sha(stripped) === PRE_PANEL_SHA, `removing the four CXP regions restores the stripped-file baseline byte for byte (sha256 ${PRE_PANEL_SHA.slice(0, 16)}…): the edit is purely additive`, `stripped page sha ${sha(stripped)} != pre-panel baseline: the edit changed existing lab text`);
check(html.length > stripped.length && sha(html) !== PRE_PANEL_SHA, `new lab sha256 ${sha(html)}`);

console.log("== data freshness");
const snap = buildPanelSnapshot();
check(fs.readFileSync(SNAPSHOT_PATH, "utf8") === JSON.stringify(snap, null, 1) + "\n", "checked-in snapshot equals a fresh run of the commissioning module over its fixtures");
const r = embeddedRegion(html);
check(r && html.slice(r.start, r.end) === dataBlock(snap), "snapshot embedded in the page equals the fresh snapshot (a stale page would fail here; regenerate with gen-commissioning-panel.mjs --write)");
check(/^sha256:[0-9a-f]{64}$/.test(snap.source.fixtureHash), `snapshot carries its source fixture identity ${snap.source.fixtureHash.slice(0, 22)}…`);
check(!/\bhashed at\b|Date|timestamp generated/i.test(JSON.stringify(Object.keys(snap))) && JSON.stringify(snap) === JSON.stringify(buildPanelSnapshot()), "snapshot is deterministic (no clock)");

console.log("== existing lab behavior unchanged with the panel present");
for (const [name, sc] of Object.entries(fx.scenarios)) {
  const a = loadLab(sc.overrides), b = loadLab(sc.overrides, { html: stripped });
  check(JSON.stringify(a.g) === JSON.stringify(b.g), `${name}: geometry() identical`);
  check(JSON.stringify(a.acts) === JSON.stringify(b.acts), `${name}: ACTS identical`);
  check(a.qtyForSource === b.qtyForSource, `${name}: qtyFor() source identical`);
  check(JSON.stringify(a.estimateFull()) === JSON.stringify(b.estimateFull()), `${name}: estimate() output identical (quantities, costs, every row)`);
}

console.log("== panel is a read-only renderer");
const regionText = r => { const m = html.match(new RegExp(`^<!-- CXP:${r}:BEGIN -->\\n([\\s\\S]*?)^<!-- CXP:${r}:END -->\\n`, "m")); return m ? m[1] : ""; };
const scriptText = regionText("SCRIPT").replace(/^<script>\n|<\/script>\n$/g, "");
const markup = regionText("TAB") + regionText("PAGE");
const code = scriptText.replace(/\/\*[\s\S]*?\*\//g, "");
check(!/<input|<select|<textarea|<button|<form|contenteditable|\bonclick=|\bonchange=/i.test(markup), "panel markup has no inputs, buttons, forms or inline handlers");
check(!/\b(qtyFor|estimate|recalc\w*|renderAll|geometry|EVM)\b/i.test(code) && !/\bclaim\w*\s*[(=]/i.test(code.replace(/complianceClaim/g, "")), "panel script never references qtyFor, estimate, recalc, renderAll, geometry or EVM, and calls no claims code");
check(!/\b(localStorage|sessionStorage|fetch|XMLHttpRequest|eval|document\.write|addEventListener|setTimeout|setInterval|Math\.random|Date)\b/.test(code), "panel script uses no storage, network, listeners, timers, clock or RNG");
check(!/\bfunction\s+(evaluate|foldLedger|eventId|validate)\w*/i.test(code) && !/>=|<=/.test(code.replace(/&[lg]t;/g, "")), "no second implementation of the evaluator or ledger (no comparators, no hashing, no state machine)");
check(!/function (estimate|qtyFor)|const ACTS=/.test(scriptText + markup), "panel text cannot be mistaken for the lab's quantity/estimate script blocks by the bridge");

const seen = []; const rootEl = { innerHTML: "", textContent: "" };
const dataEl = { textContent: JSON.stringify(snap) };
const ctx = vm.createContext({ document: { getElementById: id => { seen.push(id); return id === "cxpRoot" ? rootEl : id === "cxpData" ? dataEl : null; } }, console });
let threw = null; try { vm.runInContext(scriptText, ctx); } catch (e) { threw = e; }
check(!threw, "panel script runs against a stub DOM without throwing", `panel script threw: ${threw}`);
check([...new Set(seen)].sort().join() === "cxpData,cxpRoot", "panel touches only #cxpRoot and #cxpData");
const out = rootEl.innerHTML;
const must = ["SYNTHETIC DATA", "not code compliance", "complianceClaim", "NONE", "REPRESENTATIVE", "none (unsourced)", "HVAC-EXFAN-001", snap.instance.instanceId, snap.source.fixtureHash, "A07", "A14", "0820-CX", "0820-CX-L", "PASS", "FAIL", "INCOMPLETE", "Evidence basis", "Verification", "Validity", "Workflow", "Approval", "supersedes", "pinned", "not engineer-of-record acceptance"];
for (const m of must) if (!out.includes(m)) fail(`rendered panel is missing '${m}'`);
if (must.every(m => out.includes(m))) ok(`rendered panel shows every required disclaimer, id and state (${must.length} anchors)`);
check(snap.lifecycles.every(l => out.includes(l.name.replace(/&/g, "&amp;"))) && snap.lifecycles.flatMap(l => l.events).every(e => out.includes(e.eventId)), "every lifecycle name and every ledger event ID from the snapshot is rendered");
const rt = snap.lifecycles.find(l => l.name.startsWith("successful re-test"));
check(out.includes("rev 1") && rt.revisions[0].outcome === "FAIL" && rt.revisions[1].outcome === "PASS" && rt.revisions[1].supersedes === rt.revisions[0].revisionId && out.includes(rt.revisions[0].revisionId), "re-test chain shows the preserved failure (rev 1 FAIL) superseded by rev 2 PASS");
check(!/<script/i.test(out) && !out.includes("undefined") && !out.includes("[object"), "rendered output has no script injection and no undefined/[object] leaks");

console.log(`\n${failures ? "FAILED" : "PASSED"}: ${failures} failure(s), 0 warning(s)`);
process.exit(failures ? 1 : 0);
