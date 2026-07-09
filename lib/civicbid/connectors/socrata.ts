export interface SocrataFetchOptions {
  endpoint: string;
  limit?: number;
  where?: string;
  order?: string;
  select?: string;
}

export async function fetchSocrataRows<T = Record<string, unknown>>({
  endpoint,
  limit = 50,
  where,
  order,
  select,
}: SocrataFetchOptions): Promise<T[]> {
  const url = new URL(endpoint);

  url.searchParams.set("$limit", String(limit));
  if (where) url.searchParams.set("$where", where);
  if (order) url.searchParams.set("$order", order);
  if (select) url.searchParams.set("$select", select);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    // Safe for Next.js. Adjust cache behavior in implementation.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Socrata fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T[]>;
}

export const NYC_OPEN_DATA_ENDPOINTS = {
  cityRecord: "https://data.cityofnewyork.us/resource/dg92-zbpx.json",
  currentSolicitations: "https://data.cityofnewyork.us/resource/3khw-qi8f.json",
} as const;
