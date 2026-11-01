import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSupabaseConfig, supabaseSelect } from "@/lib/comms/server";
import { normalizeDeliveryStatus, normalizeNotificationStatus } from "@/lib/comms/status";
import { isUuid } from "@/lib/comms/validation";
import { ReplyForm } from "@/components/comms/ReplyForm";

export const metadata: Metadata = {
  title: "ARTEMIS Communications Inbox | Internal",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type MessageRow = {
  id: string;
  created_at: string;
  category: string;
  sender_name: string;
  sender_email: string;
  message: string;
  notification_status: string;
  delivery_status: string | null;
  reply_status: string;
  source: string | null;
};

type ReplyRow = {
  id: string;
  direction: string;
  author_email: string | null;
  body: string;
  send_status: string;
  created_at: string;
};

const MESSAGE_SELECT =
  "id,created_at,category,sender_name,sender_email,message,notification_status,delivery_status,reply_status,source";

export default async function InboxPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string }>;
}) {
  // Gate first (ADR-011): unauthenticated or non-allowlisted visitors are
  // redirected by requireAuth() before any message data is read.
  const { email: operatorEmail } = await requireAuth();

  const params = (await searchParams) ?? {};
  const config = getSupabaseConfig();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">ARTEMIS / Communications / Operator inbox</p>
      <h1 className="display-serif mt-4 text-4xl text-foreground">Communications inbox</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Signed in as {operatorEmail}. Internal only — this page is noindex and gated by the ARTEMIS allowlist.
      </p>
      {!config ? (
        <p className="mt-8 rounded-lg border border-border p-4">
          Messaging backend is not configured in this environment (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are
          absent), so no messages can be listed.
        </p>
      ) : isUuid(params.id) ? (
        <Thread config={config} id={params.id} />
      ) : (
        <MessageList config={config} />
      )}
    </div>
  );
}

async function MessageList({ config }: { config: NonNullable<ReturnType<typeof getSupabaseConfig>> }) {
  const rows =
    (await supabaseSelect<MessageRow>(
      config,
      `artemis_communications?select=${MESSAGE_SELECT}&order=created_at.desc&limit=50`,
    )) ?? [];
  if (rows.length === 0) {
    return <p className="mt-8 rounded-lg border border-border p-4">No messages stored yet.</p>;
  }
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="p-3">Reference</th>
            <th className="p-3">Received</th>
            <th className="p-3">Category</th>
            <th className="p-3">From</th>
            <th className="p-3">Notification</th>
            <th className="p-3">Delivery</th>
            <th className="p-3">Reply</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60">
              <td className="p-3">
                <Link className="text-gold underline" href={`/communications/inbox?id=${row.id}`}>
                  {row.id.slice(0, 8)}
                </Link>
              </td>
              <td className="p-3">{new Date(row.created_at).toLocaleString()}</td>
              <td className="p-3">{row.category}</td>
              <td className="p-3">
                {row.sender_name} &lt;{row.sender_email}&gt;
              </td>
              <td className="p-3">{normalizeNotificationStatus(row.notification_status)}</td>
              <td className="p-3">{normalizeDeliveryStatus(row.delivery_status)}</td>
              <td className="p-3">{row.reply_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function Thread({
  config,
  id,
}: {
  config: NonNullable<ReturnType<typeof getSupabaseConfig>>;
  id: string;
}) {
  const messages = await supabaseSelect<MessageRow>(
    config,
    `artemis_communications?select=${MESSAGE_SELECT}&id=eq.${id}&limit=1`,
  );
  const message = messages?.[0];
  if (!message) {
    return (
      <p className="mt-8 rounded-lg border border-border p-4">
        Message not found. <Link className="text-gold underline" href="/communications/inbox">Back to inbox</Link>
      </p>
    );
  }
  const replies =
    (await supabaseSelect<ReplyRow>(
      config,
      `artemis_communication_replies?select=id,direction,author_email,body,send_status,created_at&communication_id=eq.${id}&order=created_at.asc`,
    )) ?? [];
  return (
    <div className="mt-8 space-y-6">
      <Link className="text-gold underline" href="/communications/inbox">← Back to inbox</Link>
      <section className="rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold">{message.category}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reference {message.id} · {new Date(message.created_at).toLocaleString()} · from {message.sender_name}{" "}
          &lt;{message.sender_email}&gt; · source {message.source ?? "communications-page"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Notification: {normalizeNotificationStatus(message.notification_status)} · Delivery:{" "}
          {normalizeDeliveryStatus(message.delivery_status)} · Reply: {message.reply_status}
        </p>
        <p className="mt-4 whitespace-pre-wrap">{message.message}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Thread</h2>
        {replies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies recorded yet.</p>
        ) : (
          replies.map((reply) => (
            <article key={reply.id} className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">
                {reply.direction} · {reply.author_email ?? "operator"} ·{" "}
                {new Date(reply.created_at).toLocaleString()} · send status: {reply.send_status}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{reply.body}</p>
            </article>
          ))
        )}
      </section>
      <section className="rounded-2xl border border-border p-6">
        <ReplyForm communicationId={message.id} />
      </section>
    </div>
  );
}
