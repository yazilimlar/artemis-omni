"use client";

import { useEffect, useRef, useState } from "react";
import { SANDBOX_IFRAME_FLAGS, type ExitReason } from "@/lib/sandbox/constants";

/**
 * Embeds a registered artifact in an opaque-origin sandbox (ADR-014) and
 * reports session telemetry from the parent page. There is no postMessage
 * bridge: duration and exit reason are measured here, not by the artifact.
 */
export function SandboxFrame({
  id,
  title,
  maxSessionSeconds,
}: {
  id: string;
  title: string;
  maxSessionSeconds: number;
}) {
  const [ended, setEnded] = useState(false);
  const startedAt = useRef<number>(0);
  const reported = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    reported.current = false;

    const report = (exit_reason: ExitReason) => {
      if (reported.current) return;
      reported.current = true;
      const body = JSON.stringify({ id, durationMs: Date.now() - startedAt.current, exit_reason });
      navigator.sendBeacon?.("/api/sandbox-log", new Blob([body], { type: "application/json" }));
    };

    const timer = window.setTimeout(() => {
      report("timeout");
      setEnded(true);
    }, maxSessionSeconds * 1000);
    const onPageHide = () => report("navigated_away");
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onPageHide);
      report("closed");
    };
  }, [id, maxSessionSeconds]);

  if (ended) {
    return (
      <p role="status" className="rounded-md border border-border/70 bg-navy-deep/50 p-6 text-sm text-parchment">
        Session ended after {Math.round(maxSessionSeconds / 60)} minutes. Reload the page to run it again.
      </p>
    );
  }

  return (
    <iframe
      title={title}
      src={`/api/sandbox/${id}`}
      sandbox={SANDBOX_IFRAME_FLAGS}
      referrerPolicy="no-referrer"
      loading="lazy"
      className="h-[75vh] w-full rounded-md border border-border/70 bg-white"
    />
  );
}
