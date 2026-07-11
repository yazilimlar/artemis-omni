import { NextResponse } from "next/server";
import { fetchSocrataRows, NYC_OPEN_DATA_ENDPOINTS } from "@/lib/civicbid/connectors/socrata";
import { normalizeOpenDataOpportunity } from "@/lib/civicbid/normalizeOpportunity";
import { scoreQueue, SIGNAL_FORGE_SCORING_MODEL } from "@/lib/civicbid/signalForgeScoring";
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
  const limitValue = Number(url.searchParams.get("limit") ?? "25");
  const limit = Number.isFinite(limitValue) ? Math.max(1, Math.min(Math.trunc(limitValue), 100)) : 25;
  const retrievedAt = new Date().toISOString();

  let opportunities: CivicBidOpportunity[] = [];
  let mode: CivicBidResponseMode = "live_official";
  let status: CivicBidResponseStatus = "ok";
  let warning: string | null = null;

  try {
    const rows = await fetchSocrataRows<Record<string, unknown>>({
      endpoint: LIVE_SOURCE.apiUrl,
      limit,
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
          fromLive: false,
          fallbackUsed: false,
          retrievedAt,
          source: LIVE_SOURCE,
          officialSourceOfTruth:
            "CivicBid assists discovery and triage. The official agency record and bid documents remain controlling.",
          warning: "The official public source was unavailable at retrieval time; no sample fallback was requested.",
          count: 0,
          data: [],
          ...(view === "queue" ? { scoringModel: SIGNAL_FORGE_SCORING_MODEL } : {}),
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
  const data = view === "queue" ? scoreQueue(publicData) : publicData;

  return NextResponse.json(
    {
      schemaVersion: 1,
      product: "CivicBid Signal Forge",
      status,
      mode,
      fromLive: mode === "live_official",
      fallbackUsed: mode === "sample_fallback",
      retrievedAt,
      source: LIVE_SOURCE,
      dataSourceLabel:
        mode === "live_official" ? LIVE_SOURCE.name : "CivicBid synthetic demonstration set",
      officialSourceOfTruth:
        "CivicBid assists discovery and triage. The official agency record and bid documents remain controlling.",
      ...(warning ? { warning } : {}),
      count: data.length,
      ...(view === "queue" ? { scoringModel: SIGNAL_FORGE_SCORING_MODEL } : {}),
      data,
    },
    { headers: responseHeaders() },
  );
}
