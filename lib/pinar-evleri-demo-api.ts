export const PINAR_DEMO_ENVIRONMENT = 'Pinar Evleri Demo';
export const PINAR_DEMO_SUPABASE_URL = 'https://vsqwzxdphpmadxdevjky.supabase.co';
// Publishable keys are designed for browser use. This project contains synthetic demo data only.
export const PINAR_DEMO_PUBLISHABLE_KEY = 'sb_publishable_mlwyJ1dlVeEEPVZE0UvUmQ_Nl74u5l4';

export async function pinarDemoRpc<T>(fn: string, body: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${PINAR_DEMO_SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: PINAR_DEMO_PUBLISHABLE_KEY,
      Authorization: `Bearer ${PINAR_DEMO_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Pinar Evleri Demo RPC ${fn} failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
