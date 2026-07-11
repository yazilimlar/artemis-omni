export type SocrataFetchOptions = {
  endpoint: string;
  limit?: number;
  where?: string;
  order?: string;
  select?: string;
  revalidateSeconds?: number;
  timeoutMs?: number;
};

export const NYC_OPEN_DATA_ENDPOINTS = {
  cityRecord: "https://data.cityofnewyork.us/resource/dg92-zbpx.json",
  currentSolicitations: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
} as const;

export async function fetchSocrataRows<T = Record<string, unknown>>({
  endpoint,
  limit = 50,
  where,
  order,
  select,
  revalidateSeconds = 900,
  timeoutMs = 8_000,
}: SocrataFetchOptions): Promise<T[]> {
  const url = new URL(endpoint);

  url.searchParams.set("$limit", String(Math.max(1, Math.min(limit, 200))));
  if (where) url.searchParams.set("$where", where);
  if (order) url.searchParams.set("$order", order);
  if (select) url.searchParams.set("$select", select);

  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Accept: "application/json",
      "User-Agent": "Artemis-CivicBid/1.0",
    },
    next: { revalidate: revalidateSeconds },
    signal: AbortSignal.timeout(timeoutMs),
  };

  const response = await fetch(url.toString(), init);

  if (!response.ok) {
    throw new Error(`Socrata fetch failed with HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Socrata response was not an array");
  }

  return payload as T[];
}
