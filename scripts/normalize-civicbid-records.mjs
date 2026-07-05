#!/usr/bin/env node

/**
 * Normalize raw NYC Open Data rows into a loose CivicBidOpportunity shape.
 *
 * Usage:
 *   node scripts/normalize-civicbid-records.mjs tmp/civicbid/current-solicitations.sample.json
 */

import fs from "node:fs/promises";
import path from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node scripts/normalize-civicbid-records.mjs <sample-json-path>");
  process.exit(1);
}

const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));
const rows = Array.isArray(payload.rows) ? payload.rows : Array.isArray(payload) ? payload : [];

function pick(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return String(row[key]);
    }
  }
  return null;
}

function normalize(row, index) {
  const title = pick(row, [
    "title",
    "short_title",
    "procurement_title",
    "notice_title",
    "event_title",
    "description",
  ]);

  const agency = pick(row, ["agency", "agency_name", "dept_name", "department"]);

  return {
    id: pick(row, ["id", "pin", "event_id", "solicitation_id"]) || `normalized-${index + 1}`,
    title: title || "Untitled opportunity / notice",
    agency: agency || "Unknown agency",
    sourceName: payload.source || "NYC Open Data",
    sourceUrl: null,
    apiUrl: payload.endpoint || null,
    jurisdiction: "NYC",
    category: pick(row, ["category", "procurement_type", "notice_type", "type"]) || "unknown",
    publishedDate: pick(row, [
      "publication_date",
      "published_date",
      "start_date",
      "release_date",
      "record_date",
    ]),
    dueDate: pick(row, [
      "due_date",
      "proposal_due_date",
      "bid_due_date",
      "end_date",
      "response_due_date",
      "close_date",
    ]),
    procurementMethod: pick(row, ["procurement_method", "method", "selection_method"]),
    description: pick(row, ["description", "summary", "body", "abstract"]),
    sourceConfidence: "official_public_dataset",
    retrievedAt: payload.retrievedAt || new Date().toISOString(),
    raw: row,
  };
}

const normalized = rows.map(normalize);

const outDir = path.join(process.cwd(), "tmp", "civicbid");
await fs.mkdir(outDir, { recursive: true });

const outPath = path.join(outDir, "normalized-opportunities.json");
await fs.writeFile(outPath, JSON.stringify(normalized, null, 2));

console.log(`Normalized ${normalized.length} records`);
console.log(`Wrote ${outPath}`);
