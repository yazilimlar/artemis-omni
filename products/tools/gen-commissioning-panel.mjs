// Usage: node products/tools/gen-commissioning-panel.mjs [--write]
// Builds the read-only commissioning panel snapshot by running the products/commissioning module over its
// fixtures (no second implementation of the evaluator or ledger anywhere). Without --write it only reports
// whether the snapshot checked in at products/commissioning/panel-snapshot.json and the copy embedded in the lab page
// are fresh. With --write it regenerates both: the JSON file, and ONLY the text between the CXP:DATA markers in the
// lab page (the only mechanism by which the page's data changes). The snapshot carries the source fixture content hash
// so a stale snapshot is detectable. Deterministic: no clock, no RNG.
// This panel renders a pre-validated snapshot. Stale detection and anchor checks are performed by check-commissioning-panel.mjs / gen-commissioning-panel.mjs at generation time, not by the page. A stale snapshot fails the checker; the page itself does not re-validate.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { loadLab, LAB_PATH } from "./lab-bridge.mjs";
import { readJson } from "./util.mjs";
import * as cx from "../commissioning/commissioning.mjs";
import * as ev from "../evidence/evidence.mjs";

export const SNAPSHOT_PATH = new URL("../commissioning/panel-snapshot.json", import.meta.url);
export const DATA_BEGIN = "<!-- CXP:DATA:BEGIN -->", DATA_END = "<!-- CXP:DATA:END -->";
const clone = o => JSON.parse(JSON.stringify(o));

export function buildPanelSnapshot() {
  const fx = readJson("../commissioning/fixtures/matrix.json");
  const products = readJson("../hvac/hvac-products.sample.json");
  const fan = products.find(p => p.id === "HVAC-EXFAN-001");
  const lab = loadLab();
  const lifecycles = fx.validLifecycles.map(lc => {
    const { states } = cx.foldLedger(clone(lc.envelopes), clone(lc.events));
    return {
      name: lc.name,
      revisions: lc.envelopes.map(e => {
        const view = cx.materialize(e, states.get(e.revisionId));
        return {
          revision: e.revision, revisionId: e.revisionId, supersedes: e.supersedes, logicalId: e.logicalId, contentHash: e.contentHash,
          outcome: e.payload.outcome, definitionRevision: e.payload.definitionRevision, observations: e.payload.observations,
          conditionResults: e.payload.conditionResults, parameterResults: e.payload.parameterResults,
          dimensions: {
            basis: view.basis,
            verification: { state: view.verification, scope: view.verificationScope, method: view.verificationMethod, verifiedRevisionId: view.verifiedRevisionId },
            validity: view.validity, workflow: view.workflow, approval: { state: view.approval, pinnedRevisionId: view.approvedRevisionId },
          },
          complianceClaim: view.complianceClaim,
        };
      }),
      events: lc.events.map(x => ({ seq: x.seq, timestamp: x.timestamp, actorRole: x.actorRole, revisionId: x.revisionId, dimension: x.dimension, from: x.from, to: x.to, eventId: x.eventId })),
    };
  });
  return {
    schema: "cx-panel-snapshot-1",
    source: { fixture: "products/commissioning/fixtures/matrix.json", fixtureHash: ev.contentHashOf(fx), moduleVersion: cx.MODULE_VERSION, contractVersion: ev.CONTRACT_VERSION },
    banners: { data: "SYNTHETIC DATA - representative values, simulated observations", passMeaning: "PASS " + cx.MEANING, complianceClaim: "NONE" },
    product: { id: fan.id, manufacturer: fan.manufacturer, model: fan.model, label: fan.label },
    instance: fx.instances.base,
    definitions: fx.definitions.map(d => ({ definitionId: d.definitionId, revision: d.revision, applicability: d.applicability, procedure: d.procedure, parameters: d.parameters, conditions: d.conditions, provenance: d.provenance })),
    acts: cx.resolveActsAssociation(lab.acts, fan),
    counts: { evaluatorCases: fx.evaluatorCases.length, badDefinitions: fx.badDefinitions.length, validLifecycles: fx.validLifecycles.length, negativeLifecycles: fx.invalidLifecycles.length },
    lifecycles,
  };
}
/** The exact JSON text embedded in the page (no "</" so it cannot close the script element). */
export const embedText = snap => JSON.stringify(snap).replace(/</g, "\\u003c");

export function embeddedRegion(html) {
  const a = html.indexOf(DATA_BEGIN), b = html.indexOf(DATA_END);
  if (a < 0 || b < a) return null;
  return { start: a + DATA_BEGIN.length, end: b };
}
/** The page with the four marked CXP regions removed (must equal the pre-panel lab byte for byte). */
export const stripPanel = h => ["TAB", "PAGE", "DATA", "SCRIPT"].reduce((t, r) => t.replace(new RegExp(`^<!-- CXP:${r}:BEGIN -->\\n[\\s\\S]*?^<!-- CXP:${r}:END -->\\n`, "gm"), ""), h);
export const dataBlock = snap => `\n<script type="application/json" id="cxpData">${embedText(snap)}</script>\n`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const snap = buildPanelSnapshot(), want = JSON.stringify(snap, null, 1) + "\n";
  const html = fs.readFileSync(LAB_PATH, "utf8"), r = embeddedRegion(html);
  const fileFresh = fs.existsSync(SNAPSHOT_PATH) && fs.readFileSync(SNAPSHOT_PATH, "utf8") === want;
  const pageFresh = !!r && html.slice(r.start, r.end) === dataBlock(snap);
  if (process.argv.includes("--write")) {
    if (!r) { console.error("CXP:DATA markers not found in the lab page"); process.exit(1); }
    fs.writeFileSync(SNAPSHOT_PATH, want);
    fs.writeFileSync(LAB_PATH, html.slice(0, r.start) + dataBlock(snap) + html.slice(r.end));
    console.log("snapshot regenerated; fixtureHash " + snap.source.fixtureHash);
  } else {
    console.log(`snapshot file ${fileFresh ? "fresh" : "STALE"}; page ${pageFresh ? "fresh" : "STALE"}; fixtureHash ${snap.source.fixtureHash}`);
    process.exit(fileFresh && pageFresh ? 0 : 1);
  }
}
