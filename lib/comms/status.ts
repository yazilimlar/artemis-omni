/**
 * Status taxonomy for Communications Hub (Issue #276).
 *
 * Notification lifecycle (provider acceptance is NOT delivery):
 *   (stored) -> notification_queued -> provider_accepted
 *                                   -> notification_failed (retryable)
 *   notification_not_requested — stored rows that never notify (pilot form).
 *
 * Delivery lifecycle is separate and only moves via Resend webhooks:
 *   unknown -> delivered | bounced | complained
 */

export const NOTIFICATION_STATUSES = [
  "notification_queued",
  "provider_accepted",
  "notification_failed",
  "not_requested",
] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export const DELIVERY_STATUSES = ["unknown", "delivered", "bounced", "complained"] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

/** Map legacy v1 values onto the R2 taxonomy. Unknown values fail safe to queued. */
export function normalizeNotificationStatus(raw: string | null | undefined): NotificationStatus {
  switch (raw) {
    case "provider_accepted":
    case "notification-sent": // legacy: Resend API accepted; delivery was never implied
      return "provider_accepted";
    case "notification_failed":
      return "notification_failed";
    case "not_requested":
      return "not_requested";
    case "notification_queued":
    case "pending": // legacy v1 default
    case "queued": // legacy v1 in-memory status
    case "notification-pending": // legacy: send attempted, outcome unrecorded
    case "notification-queued":
      return "notification_queued";
    default:
      return "notification_queued";
  }
}

export function normalizeDeliveryStatus(raw: string | null | undefined): DeliveryStatus {
  return (DELIVERY_STATUSES as readonly string[]).includes(raw ?? "")
    ? (raw as DeliveryStatus)
    : "unknown";
}

/** User-facing copy for the public console. Never claims delivery. */
export function notificationStatusCopy(status: string | null | undefined): string {
  switch (normalizeNotificationStatus(status)) {
    case "provider_accepted":
      return "Notification accepted by the email provider — delivery confirmation pending.";
    case "notification_failed":
      return "Stored; notification failed and is queued for retry.";
    case "not_requested":
      return "Stored.";
    case "notification_queued":
    default:
      return "Stored and queued for notification.";
  }
}

/** Map a Resend webhook event type onto a delivery status, or null to ignore. */
export function deliveryStatusForResendEvent(type: string | null | undefined): DeliveryStatus | null {
  switch (type) {
    case "email.delivered":
      return "delivered";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    default:
      return null;
  }
}
