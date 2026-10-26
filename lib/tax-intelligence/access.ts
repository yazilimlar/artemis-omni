import "server-only";

/** Temporary fail-closed MVP authorization. Replace with audited database memberships + RLS before real records. */
export const CLIENT_IDS = ["personal", "great-order", "artemis", "agoraxai", "apolloa"] as const;
export type TaxClientId = (typeof CLIENT_IDS)[number];

export function parseMemberships(raw: string | undefined): Record<TaxClientId, readonly string[]> {
  const result = Object.fromEntries(CLIENT_IDS.map(id => [id, []])) as Record<TaxClientId, string[]>;
  if (!raw) return result;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return result;
    for (const id of CLIENT_IDS) {
      const members = (data as Record<string, unknown>)[id];
      if (Array.isArray(members)) result[id] = members.filter((v): v is string => typeof v === "string" && v.length > 0);
    }
  } catch {
    return result;
  }
  return result;
}

export function accessibleClients(userId: string, raw: string | undefined): TaxClientId[] {
  if (!userId) return [];
  const memberships = parseMemberships(raw);
  return CLIENT_IDS.filter(id => memberships[id].includes(userId));
}

export function clientsForUser(userId: string): TaxClientId[] {
  return accessibleClients(userId, process.env.ARTEMIS_TAX_CLIENT_MEMBERSHIPS);
}
