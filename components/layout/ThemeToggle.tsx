"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const storageKey = "artemis-color-theme";
const themeChangeEvent = "artemis-theme-change";

type ColorTheme = "night" | "day";

function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "night");
  root.style.colorScheme = theme === "day" ? "light" : "dark";

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === "day" ? "#f4f1e8" : "#070a14");
  window.dispatchEvent(new CustomEvent<ColorTheme>(themeChangeEvent, { detail: theme }));
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<ColorTheme>("night");

  React.useEffect(() => {
    const current = document.documentElement.dataset.theme === "day" ? "day" : "night";
    setTheme(current);

    function handleThemeChange(event: Event) {
      setTheme((event as CustomEvent<ColorTheme>).detail);
    }

    window.addEventListener(themeChangeEvent, handleThemeChange);
    return () => window.removeEventListener(themeChangeEvent, handleThemeChange);
  }, []);

  function toggleTheme() {
    const nextTheme: ColorTheme = theme === "night" ? "day" : "night";
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The active page still receives the theme when storage is unavailable.
    }
    setTheme(nextTheme);
  }

  const nextLabel = theme === "night" ? "Switch to day view" : "Switch to night view";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md border border-border/70 bg-background/55 px-3 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-foreground/80 transition hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label={nextLabel}
      title={nextLabel}
    >
      {theme === "night" ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
      <span className="hidden xl:inline">{theme === "night" ? "Day view" : "Night view"}</span>
    </button>
  );
}
