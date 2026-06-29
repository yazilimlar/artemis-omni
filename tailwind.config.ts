import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Artemis Omni brand system.
 * Palette: dark navy, lunar black, silver, warm gold, parchment/off-white.
 * Type: elegant serif display + clean technical sans UI text.
 * Colors are driven by CSS variables (see app/globals.css) so we can theme later.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./lib/**/*.{ts,tsx}",
    "./mdx-components.tsx",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Semantic tokens (CSS variable backed)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // Brand scale
        navy: {
          DEFAULT: "hsl(var(--navy))",
          deep: "hsl(var(--navy-deep))",
        },
        lunar: "hsl(var(--lunar))",
        silver: "hsl(var(--silver))",
        blueprint: {
          DEFAULT: "hsl(var(--blueprint))",
          soft: "hsl(var(--blueprint-soft))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
        },
        parchment: "hsl(var(--parchment))",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(hsl(var(--silver) / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--silver) / 0.06) 1px, transparent 1px)",
        "lunar-radial":
          "radial-gradient(ellipse at top, hsl(var(--navy)) 0%, hsl(var(--navy-deep)) 45%, hsl(var(--lunar)) 100%)",
        "gold-sheen":
          "linear-gradient(120deg, hsl(var(--gold-soft)) 0%, hsl(var(--gold)) 45%, hsl(var(--parchment)) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(6px)" },
        },
        drift: {
          "0%": { transform: "translateY(0px)", opacity: "0.0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(-40px)", opacity: "0.0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-node": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-node": "pulse-node 3.5s ease-in-out infinite",
        sweep: "sweep 6s ease-in-out infinite",
      },
      boxShadow: {
        panel:
          "0 1px 0 0 hsl(var(--silver) / 0.08) inset, 0 24px 60px -24px hsl(var(--lunar) / 0.9)",
        gold: "0 0 0 1px hsl(var(--gold) / 0.35), 0 12px 40px -12px hsl(var(--gold) / 0.25)",
      },
    },
  },
  plugins: [typography],
};

export default config;
