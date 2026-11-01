"use client";
import { useState, type FormEvent } from "react";

type Result = { ok?: boolean; status?: string; error?: string };

export function ReplyForm({ communicationId }: { communicationId: string }) {
  const [body, setBody] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/communications/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communicationId, body }),
      });
      const data = (await response.json()) as Result;
      setResult(data);
      if (response.ok && data.ok) setBody("");
    } catch {
      setResult({ error: "Unable to reach the reply service. The reply was not sent." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">
        Reply to sender
        <textarea
          required
          minLength={1}
          maxLength={8000}
          rows={5}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <button disabled={busy} className="rounded-lg bg-gold px-5 py-2.5 font-semibold text-lunar disabled:opacity-50">
        {busy ? "Sending…" : "Send reply"}
      </button>
      {result && (
        <p role="status" aria-live="polite" className="rounded-lg border border-border p-3 text-sm">
          {result.ok
            ? "Reply accepted by the email provider — delivery confirmation pending."
            : (result.error ?? `Reply status: ${result.status ?? "failed"}. The failed reply is recorded in the thread.`)}
        </p>
      )}
    </form>
  );
}
