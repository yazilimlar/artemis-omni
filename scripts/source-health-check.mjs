#!/usr/bin/env node

/**
 * Public-safe source health check.
 * It only checks public URLs. No login. No scraping. No credentials.
 */

import fs from "node:fs/promises";

const registryPath = "data/source_registry.json";
const registry = JSON.parse(await fs.readFile(registryPath, "utf8"));

async function check(source) {
  const url = source.api_url || source.url;
  const started = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Artemis-CivicBid-HealthCheck/1.0" },
    });

    return {
      id: source.id,
      name: source.name,
      url,
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
      connector_method: source.connector_method,
    };
  } catch (error) {
    return {
      id: source.id,
      name: source.name,
      url,
      ok: false,
      status: "ERROR",
      ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
      connector_method: source.connector_method,
    };
  }
}

const results = [];
for (const source of registry) {
  results.push(await check(source));
}

console.table(
  results.map(({ id, ok, status, ms, connector_method }) => ({
    id,
    ok,
    status,
    ms,
    connector_method,
  })),
);
