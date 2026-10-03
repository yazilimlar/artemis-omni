"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { groupByMonth, TYPE_COLORS, TYPE_LABELS } from "@/lib/evolution/derive";
import type { EvolutionEvent, EvolutionEventType } from "@/lib/evolution/load";
import { useReducedMotion } from "./useReducedMotion";

/** Noisy by volume; off by default, one click to show. */
const DEFAULT_OFF: EvolutionEventType[] = ["route_added", "route_removed"];
const DOT = 26;

function EventDetail({ event }: { event: EvolutionEvent | null }) {
  if (!event) {
    return <p className="text-sm text-muted-foreground">Hover or focus an event, or scroll, to read it.</p>;
  }
  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-wider" style={{ color: TYPE_COLORS[event.type] }}>
        {TYPE_LABELS[event.type]} · {event.date.slice(0, 10)}
      </p>
      <p className="display-serif mt-1 text-lg text-parchment">{event.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{event.summary}</p>
      <p className="mt-2 break-words font-mono text-[0.68rem] text-muted-foreground/80">
        {event.references.join(" · ")}
      </p>
    </div>
  );
}

export function EvolutionTimeline({ events }: { events: EvolutionEvent[] }) {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState<Set<EvolutionEventType>>(() => new Set(DEFAULT_OFF));
  const [active, setActive] = useState<EvolutionEvent | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const types = useMemo(() => [...new Set(events.map((e) => e.type))].sort(), [events]);
  const groups = useMemo(() => groupByMonth(events.filter((e) => !hidden.has(e.type))), [events, hidden]);
  const shown = groups.reduce((n, g) => n + g.events.length, 0);
  const animate = reduced === false;

  // Scroll-driven horizontal travel (GSAP + ScrollTrigger). Skipped under reduced motion.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!animate || !wrapper || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    const distance = () => Math.max(0, track.scrollWidth - wrapper.clientWidth);
    const dots = Array.from(track.querySelectorAll<HTMLElement>("[data-event-index]"));
    const flat = groups.flatMap((g) => g.events);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top+=72",
          end: () => `+=${distance()}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // The event closest to the viewport centre becomes the active one.
            const centre = wrapper.clientWidth / 2 + self.progress * distance();
            let best = 0;
            let bestGap = Infinity;
            dots.forEach((dot, i) => {
              const gap = Math.abs(dot.offsetLeft + dot.offsetWidth / 2 - centre);
              if (gap < bestGap) {
                bestGap = gap;
                best = i;
              }
            });
            setActive(flat[best] ?? null);
          },
        },
      });
    }, wrapper);
    return () => ctx.revert();
  }, [animate, groups]);

  const toggle = (type: EvolutionEventType) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });

  const legend = (
    <ul className="flex flex-wrap gap-2" aria-label="Event types">
      {types.map((type) => {
        const on = !hidden.has(type);
        return (
          <li key={type}>
            <button
              type="button"
              onClick={() => toggle(type)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors ${
                on ? "border-border text-foreground" : "border-border/40 text-muted-foreground/60"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: TYPE_COLORS[type], opacity: on ? 1 : 0.3 }}
                aria-hidden
              />
              {TYPE_LABELS[type]}
            </button>
          </li>
        );
      })}
    </ul>
  );

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No events yet. data/evolution.json is missing or empty.</p>;
  }

  // Static stacked list: server render, reduced motion, and until the client has measured.
  if (!animate) {
    return (
      <div>
        {legend}
        <p className="mt-3 text-xs text-muted-foreground">{shown} events, oldest first.</p>
        <div className="mt-4 max-h-[32rem] space-y-6 overflow-y-auto rounded-lg border border-border/70 bg-navy-deep/40 p-5">
          {groups.map((group) => (
            <section key={group.key}>
              <h3 className="font-mono text-[0.68rem] uppercase tracking-wider text-signal-soft">{group.label}</h3>
              <ol className="mt-2 space-y-2">
                {group.events.map((event) => (
                  <li key={event.id} className="flex gap-3 text-sm">
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: TYPE_COLORS[event.type] }}
                      aria-hidden
                    />
                    <span>
                      <span className="font-mono text-xs text-muted-foreground">{event.date.slice(0, 10)}</span>{" "}
                      <span className="text-foreground">{event.title}</span>
                      <span className="block text-xs text-muted-foreground">{event.summary}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    );
  }

  let index = -1;
  return (
    <div>
      {legend}
      <p className="mt-3 text-xs text-muted-foreground">
        {shown} events, oldest left. Scroll to travel along the timeline.
      </p>
      <div ref={wrapperRef} className="mt-4 overflow-hidden rounded-lg border border-border/70 bg-navy-deep/40">
        <div ref={trackRef} className="flex w-max items-end gap-10 px-8 pb-4 pt-6">
          {groups.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <div className="flex items-end" style={{ height: 190 }}>
                {group.events.map((event) => {
                  index += 1;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      data-event-index={index}
                      onMouseEnter={() => setActive(event)}
                      onFocus={() => setActive(event)}
                      aria-label={`${event.date.slice(0, 10)} ${event.title}`}
                      className="group flex h-full flex-col items-center justify-end gap-1 outline-none"
                      style={{ width: DOT }}
                    >
                      <span
                        className="line-clamp-1 max-h-32 truncate text-[0.62rem] text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {event.title}
                      </span>
                      <span
                        className="h-3 w-3 rounded-full ring-0 transition-all group-hover:scale-150 group-focus-visible:scale-150 group-focus-visible:ring-2 group-focus-visible:ring-gold"
                        style={{ background: TYPE_COLORS[event.type] }}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 border-t border-border/70 pt-1 font-mono text-[0.68rem] uppercase tracking-wider text-signal-soft">
                {group.label}
              </div>
            </section>
          ))}
        </div>
        <div className="border-t border-border/70 bg-navy-deep/60 p-5" aria-live="polite">
          <EventDetail event={active} />
        </div>
      </div>
    </div>
  );
}
