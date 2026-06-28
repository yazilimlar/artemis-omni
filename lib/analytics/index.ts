/**
 * Analytics placeholder.
 *
 * No analytics provider is wired up in this phase. When ready, implement
 * `track()` against Vercel Analytics, PostHog, or similar. Keep the surface
 * tiny so call sites don't need to change.
 *
 * Secrets/keys must come from environment variables (see docs/SecurityRules.md):
 *   NEXT_PUBLIC_ANALYTICS_ID
 */
type AnalyticsEvent = {
  name: string;
  props?: Record<string, string | number | boolean | null>;
};

export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV !== "production") {
    // Dev no-op with a hint for future implementers.
    // eslint-disable-next-line no-console
    console.debug("[analytics:noop]", event.name, event.props ?? {});
    return;
  }
  // TODO: forward to a real analytics provider once configured.
}
