export const PINAR_DEMO_ENVIRONMENT = 'Pinar Evleri Demo';
export const PINAR_DEMO_SUPABASE_URL = 'https://vsqwzxdphpmadxdevjky.supabase.co';
// Publishable keys are designed for browser use. This project contains synthetic demo data only.
export const PINAR_DEMO_PUBLISHABLE_KEY = 'sb_publishable_mlwyJ1dlVeEEPVZE0UvUmQ_Nl74u5l4';

type DemoRpcError = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message?: string;
};

function friendlyDemoError(raw: string, status: number): string {
  try {
    const parsed = JSON.parse(raw) as DemoRpcError;
    if (parsed.code === '23P01') {
      if (parsed.details?.includes('conflicting_reservation_id=')) {
        return 'This house is already booked for part of the selected dates. Choose another house or change the dates.';
      }
      if (parsed.details?.includes('conflicting_block_id=')) {
        return 'This house is blocked or under maintenance for part of the selected dates. Choose another house or change the dates.';
      }
      return 'Those dates conflict with existing inventory. Choose another house or change the dates.';
    }
    if (parsed.code === '23514') return parsed.message || 'The booking does not meet the house capacity or booking rules.';
    if (parsed.code === '22023') return parsed.message || 'Please check the booking details and dates.';
    return parsed.message || `Pinar Evleri Demo request failed (${status})`;
  } catch {
    return raw || `Pinar Evleri Demo request failed (${status})`;
  }
}

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
    throw new Error(friendlyDemoError(detail, response.status));
  }

  return response.json() as Promise<T>;
}
