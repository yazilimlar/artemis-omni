"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#how-it-works", label: "Value chain" },
  { href: "#proof", label: "Proof" },
  { href: "#who", label: "Who it's for" },
  { href: "#sprint", label: "First sprint" },
];

/**
 * Slim in-page nav that slides in under the site header once the hero
 * scrolls out of view. Keeps section anchors and the pilot CTA in reach.
 */
export function StickyNav({ ctaHref }: { ctaHref: string }) {
  const [visible, setVisible] = React.useState(false);
  const [active, setActive] = React.useState("");

  React.useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const onScroll = () => setVisible(window.scrollY > hero.offsetHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    for (const { href } of LINKS) {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className={`fixed inset-x-0 top-16 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-[110%]"
      }`}
    >
      <div className="mx-auto flex h-12 max-w-[1120px] items-center justify-between gap-2 px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              aria-current={active === href ? "true" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                active === href
                  ? "text-gold-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
        <Button href={ctaHref} size="sm" className="shrink-0">
          Start the conversation →
        </Button>
      </div>
    </nav>
  );
}
