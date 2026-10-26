import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  // tsconfig keeps "jsx": "preserve" for Next.js; tests compile JSX themselves.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx", "lib/tax-intelligence/**/*.test.ts", "lib/tax-intelligence/**/*.test.tsx"],
    environment: "node",
  },
});
