#!/usr/bin/env node

/**
 * Fetch a small public sample from NYC Open Data Socrata endpoints.
 *
 * Usage:
 *   node scripts/fetch-nyc-open-data.mjs city-record 50
 *   node scripts/fetch-nyc-open-data.mjs current-solicitations 50
 *
 * Public-safe by design:
 * - no credentials
 * - no login scraping
 * - no build-time dependency
 */

import fs from "node:fs/promises";
import path from "node:path";

const SOURCES = {
  "city-record": {
    name: "NYC Open Data City Record Online",
    endpoint: "https://data.cityofnewyork.us/resource/dg92-zbpx.json",
  },
  "current-solicitations": {
    name: "NYC Open Data Current Solicitations",
    endpoint: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
  },
};

const key = process.argv[2] || "current-solicitations";
const limit = Number(process.argv[3] || 50);

if (!SOURCES[key]) {
  console.error(`Unknown source: ${key}`);
  console.error(`Valid sources: ${Object.keys(SOURCES).join(", ")}`);
  process.exit(1);
}

const source = SOURCES[key];
const url = new URL(source.endpoint);
url.searchParams.set("$limit", String(limit));

const response = await fetch(url, {
  headers: {
    Accept: "application/json",
    "User-Agent": "Artemis-CivicBid-Dev/1.0",
  },
});

if (!response.ok) {
  throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
}

const rows = await response.json();

const outDir = path.join(process.cwd(), "tmp", "civicbid");
await fs.mkdir(outDir, { recursive: true });

const outPath = path.join(outDir, `${key}.sample.json`);
await fs.writeFile(
  outPath,
  JSON.stringify(
    {
      source: source.name,
      endpoint: source.endpoint,
      retrievedAt: new Date().toISOString(),
      count: rows.length,
      rows,
    },
    null,
    2,
  ),
);

console.log(`Fetched ${rows.length} rows from ${source.name}`);
console.log(`Wrote ${outPath}`);
