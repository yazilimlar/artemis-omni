import { NextResponse } from "next/server";
import { fetchSocrataRows, NYC_OPEN_DATA_ENDPOINTS } from "@/lib/civicbid/connectors/socrata";
import {
  normalizeOpenDataOpportunity,
  type CivicBidOpportunity,
} from "@/lib/civicbid/normalizeOpportunity";
import { getSampleOpportunities } from "@/lib/civicbid/signalForgeData";
import { scoreQueue } from "@/lib/civicbid/signalForgeScoring";

export const dynamic = "force-dynamic";

const LIVE_SOURCE = {
  id: "nyc-open-data-current-solicitations",
  name: "NYC Open Data — Current Solicitations",
  apiUrl: NYC_OPEN_DATA_ENDPOINTS.currentSolicitations,
  url: "https://data.cityofnewyork.us/City-Government/Current-Solicitations/3khw-qi8f",
};

async function loadOpportunities(): Promise<{
  data: CivicBidOpportunity[];
  fromLive: boolean;
  warning?: string;
}> {
  const retrievedAt = new Date().toISOString();
  try {
    const rows = await fetchSocrataRows({
      endpoint: LIVE_SOURCE.apiUrl,
      limit: 12,
    });
    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        data: getSampleOpportunities(),
        fromLive: false,
        warning: "Live feed returned no rows — showing sample data.",
      };
    }
    const data = rows.map((row, index) =>
      normalizeOpenDataOpportunity(
        row as Record<string, unknown>,
        {
          sourceName: LIVE_SOURCE.name,
          apiUrl: LIVE_SOURCE.apiUrl,
          sourceUrl: LIVE_SOURCE.url,
          jurisdiction: "NYC",
          retrievedAt,
        },
        index,
      ),
    );
    return { data, fromLive: true };
  } catch {
    return {
      data: getSampleOpportunities(),
      fromLive: false,
      warning: "Live public feed unreachable — showing sample data.",
    };
  }
}

export async function GET(request: Request) {
  const view = new URL(request.url).searchParams.get("view") ?? "opportunities";
  const { data, fromLive, warning } = await loadOpportunities();
  const retrievedAt = new Date().toISOString();

  const base = {
    source: LIVE_SOURCE.id,
    sourceName: fromLive ? LIVE_SOURCE.name : "Signal Forge sample set",
    fromLive,
    retrievedAt,
    ...(warning ? { warning } : {}),
  };

  if (view === "queue") {
    const queue = scoreQueue(data);
    return NextResponse.json({ ...base, count: queue.length, data: queue });
  }

  return NextResponse.json({ ...base, count: data.length, data });
}
