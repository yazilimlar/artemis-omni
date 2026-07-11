import { NextResponse } from "next/server";
import { fetchSocrataRows, NYC_OPEN_DATA_ENDPOINTS } from "@/lib/civicbid/connectors/socrata";
import { normalizeOpenDataOpportunity } from "@/lib/civicbid/normalizeOpportunity";
import {
  CONSTRUCTION_RELEVANCE_THRESHOLD,
  isConstructionRelevant,
  scoreQueue,
  SIGNAL_FORGE_SCORING_MODEL,
} from "@/lib/civicbid/signalForgeScoring";
import { getSignalForgeSampleOpportunities } from "@/lib/civicbid/signalForgeSamples";
import type { CivicBidOpportunity } from "@/types/civicbid";

export const dynamic = "force-dynamic";

const LIVE_SOURCE = {
  id: "nyc-open-data-current-solicitations",
  name: "NYC Open Data — Current Solicitations",
  url: "https://data.cityofnewyork.us/City-Government/Current-Solicitations/3khw-qi8f",
  apiUrl: NYC_OPEN_DATA_ENDPOINTS.currentSolicitations,
  jurisdiction: "NYC",
  sourceOfTruth: "Official NYC Open Data Socrata dataset",
} as const;

type CivicBidResponseMode = "live_official" | "sample_fallback" | "source_unavailable";
type CivicBidResponseStatus = "ok" | "degraded" | "unavailable";
type CivicBidScope = "construction" | "all";

function publicOpportunity(opportunity: CivicBidOpportunity): CivicBidOpportunity {
  const { raw: _raw, ...publicFields } = opportunity;
  return publicFields;
}

function responseHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
    "X-CivicBid-Source": LIVE_SOURCE.id,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") === "queue" ? "queue" : "opportunities";
  const fallback = url.searchParams.get("fallback") === "none" ? "none" : "sample";
  const scope: CivicBidScope = url.searchParams.get("scope") === "all" ? "all" : "construction";
  const limitValue = Number(url.searchParams.get("limit") ?? "25");
  const limit = Number.isFinite(limitValue) ? Math.max(1, Math.min(Math.trunc(limitValue), 100)) : 25;
  const upstreamLimit = scope === "construction" ? Math.min(Math.max(limit * 4, 25), 100) : limit;
  const retrievedAt = new Date().toISOString();

  let opportunities: CivicBidOpportunity[] = [];
  let mode: CivicBidResponseMode = "live_official";
  let status: CivicBidResponseStatus = "ok";
  let warning: string | null = null;

  try {
    const rows = await fetchSocrataRows<Record<string, unknown>>({
      endpoint: LIVE_SOURCE.apiUrl,
      limit: upstreamLimit,
      order: "publication_date DESC",
      revalidateSeconds: 900,
      timeoutMs: 8_000,
    });

    if (rows.length === 0) {
      throw new Error("Official source returned no rows");
    }

    opportunities = rows.map((row, index) =>
      normalizeOpenDataOpportunity(
        row,
        {
          sourceName: LIVE_SOURCE.name,
          apiUrl: LIVE_SOURCE.apiUrl,
          sourceUrl: LIVE_SOURCE.url,
          jurisdiction: LIVE_SOURCE.jurisdiction,
          retrievedAt,
        },
        index,
      ),
    );
  } catch {
    if (fallback === "none") {
      mode = "source_unavailable";
      status = "unavailable";

      return NextResponse.json(
        {
          schemaVersion: 1,
          product: "CivicBid Signal Forge",
          status,
          mode,
          scope,
          fromLive: false,
          fallbackUsed: false,
          retrievedAt,
          source: LIVE_SOURCE,
          officialSourceOfTruth:
            "CivicBid assists discovery and triage. The official agency record and bid documents remain controlling.",
          warning: "The official public source was unavailable at retrieval time; no sample fallback was requested.",
          sourceCount: 0,
          excludedCount: 0,
          count: 0,
          data: [],
          ...(view === "queue"
            ? {
                scoringModel: SIGNAL_FORGE_SCORING_MODEL,
                constructionRelevanceThreshold: CONSTRUCTION_RELEVANCE_THRESHOLD,
              }
            : {}),
        },
        { status: 503, headers: responseHeaders() },
      );
    }

    mode = "sample_fallback";
    status = "degraded";
    warning =
      "The official public source was unavailable or returned no rows. Clearly labeled synthetic sample records are shown instead.";
    opportunities = getSignalForgeSampleOpportunities();
  }

  const publicData = opportunities.map(publicOpportunity);
  const relevantData = publicData.filter(isConstructionRelevant);
  const scopedData = scope === "construction" ? relevantData : publicData;
  const sourceCount = publicData.length;
  const excludedCount = scope === "construction" ? sourceCount - relevantData.length : 0;
  const data =
    view === "queue"
      ? scoreQueue(scopedData).slice(0, limit)
      : scopedData.slice(0, limit);

  return NextResponse.json(
    {
      schemaVersion: 1,
      product: "CivicBid Signal Forge",
      status,
      mode,
      scope,
      fromLive: mode === "live_official",
      fallbackUsed: mode === "sample_fallback",
      retrievedAt,
      source: LIVE_SOURCE,
      dataSourceLabel:
        mode === "live_official" ? LIVE_SOURCE.name : "CivicBid synthetic demonstration set",
      officialSourceOfTruth:
        "CivicBid assists discovery and triage. The official agency record and bid documents remain controlling.",
      scopeNote:
        scope === "construction"
          ? "Default contractor view. Records without detected construction or infrastructure signals are omitted from this response but remain available with scope=all."
          : "All-procurement source view. Records are not limited to construction relevance.",
      ...(warning ? { warning } : {}),
      sourceCount,
      excludedCount,
      count: data.length,
      ...(view === "queue"
        ? {
            scoringModel: SIGNAL_FORGE_SCORING_MODEL,
            constructionRelevanceThreshold: CONSTRUCTION_RELEVANCE_THRESHOLD,
          }
        : {}),
      data,
    },
    { headers: responseHeaders() },
  );
}
