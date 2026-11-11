import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { labSandbox } from "@/lib/standalone-labs";
const root = "public/standalone/hvac-intel-v01-georgeg/";
describe("HVAC isolated publication", () => {
  it("passes the actual shipped calculation tests", () => {
    expect(() => execFileSync(process.execPath, ["--test", "tests/hvac-intel/engine.test.js", "tests/hvac-intel/sample.test.js"])).not.toThrow();
  });
  it("retains isolation and explicit persistence warning", () => {
    expect(labSandbox("hvac-intel-v01-georgeg")).toBe("allow-scripts allow-downloads allow-modals");
    const page = fs.readFileSync("app/labs/hvac-intel-v01-georgeg/page.tsx", "utf8");
    expect(page).toContain('sandbox={labSandbox("hvac-intel-v01-georgeg")}');
    expect(page).toContain('referrerPolicy="no-referrer"');
    expect(fs.readFileSync(root+"index.html", "utf8")).toContain("Browser autosave is disabled by isolation");
  });
  it("confines message traffic to exact internal source windows", () => {
    expect(fs.readFileSync(root+"studio-views.js", "utf8")).toContain("e.source!==towerFrame.contentWindow");
    expect(fs.readFileSync(root+"tower-bridge.js", "utf8")).toContain("e.source!==window.parent");
    for (const name of ["studio-views.js", "tower-bridge.js"]) expect(fs.readFileSync(root+name,"utf8")).toContain("window.HVAC_ARTEMIS_SANDBOX?'null':location.origin");
  });
});
