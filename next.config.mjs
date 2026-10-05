import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Standalone-lab sandbox tokens (Batch 5); also read by lib/standalone-labs.ts.
const standaloneLabs = JSON.parse(
  readFileSync(path.join(__dirname, "data", "standalone-labs.json"), "utf8"),
);

// Prime ERP showcase (/labs/prime-erp): the vendored dashboard at
// public/prime-erp/prime_industrial_erp.html calls these relative /api/* paths.
// They are proxied to the Flask backend (erp_server.py) only when the
// server-side PRIME_ERP_BACKEND_URL is set; the URL is never exposed to client JS.
// None overlap the site's own routes (app/api/civicbid, pilot-requests, public).
const PRIME_ERP_API_PATHS = [
  "/api/summary",
  "/api/pl/monthly",
  "/api/statements",
  "/api/cost-scenarios",
  "/api/orders",
  "/api/invoices",
  "/api/invoices/:invoiceNumber/pdf",
  "/api/ledger",
  "/api/assumptions",
  "/api/margins",
  "/api/products/sold",
  "/api/reconciliation",
  "/api/vendors",
  "/api/vendor_invoices",
  "/api/vendor_invoices/:id/pay",
  "/api/checks",
  "/api/checks/:id/clear",
  "/api/reminders",
  "/api/reminders/dismiss/:id",
  "/api/sync",
  "/api/export/orders.csv",
  "/api/export/ledger.csv",
  "/api/tax",
  "/api/tax/file",
  "/api/tax-forms/config",
  "/api/tax-forms/payer",
  "/api/tax-forms/payees",
  "/api/tax-forms/payees/:id",
  "/api/tax-forms/validate",
  "/api/tax-forms/generate",
  "/api/tax-forms/generated",
  "/api/tax-forms/:id/pdf",
  "/api/tax-forms/:id/audit-zip",
  "/api/tax-package/calendar",
  "/api/tax-package/list",
  "/api/tax-package/generate",
  "/api/tax-package/:id/download",
  "/api/plaid/link-token",
  "/api/plaid/exchange-token",
  "/api/plaid/set-account",
  "/api/plaid/sync",
  "/api/bank/summary",
  "/api/bank/transactions",
  "/api/bank/transactions/:id",
  "/api/bank/suggest-matches/:id",
  "/api/godmode/overview",
  "/api/godmode/match-check",
  "/api/godmode/rebuild",
];

const primeErpBackendUrl = process.env.PRIME_ERP_BACKEND_URL?.trim().replace(/\/+$/, "");

// Unset → no rewrites, so these paths 404 and the dashboard panels stay empty.
const primeErpRewrites = primeErpBackendUrl
  ? PRIME_ERP_API_PATHS.map((source) => ({ source, destination: `${primeErpBackendUrl}${source}` }))
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow MDX pages/content alongside ts/tsx.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  // Pin tracing to this app so the sibling Remotion lockfile at the parent dir
  // doesn't get selected as the workspace root.
  outputFileTracingRoot: __dirname,
  // ADR-014: artifact sources are read at request time from sandbox/ (outside public/),
  // so they must be traced into the /api/sandbox/[id] function bundle explicitly.
  outputFileTracingIncludes: {
    "/api/sandbox/[id]": ["./sandbox/**/*"],
  },
  images: {
    // Prepare for remote/optimized imagery later. Add remotePatterns when needed.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Keep MDX rendering on the modern compiler path.
    mdxRs: false,
  },
  // Raw standalone HTML is reachable at its file URL as well as inside its Labs
  // wrapper page. Keep the raw copies out of search indexes (site audit E-1).
  // Scoped to exact public/ paths: a "/labs/:path*" rule would also de-index the
  // indexable Next.js Labs pages that share that URL space.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    const noindexRules = [
      "/standalone/:path*",
      "/labs/geometric-workbench/:path*",
      "/labs/artemis-meander/:path*",
      "/labs/artemis-meander-classic-archive/:path*",
      "/labs/rainbow-house-botanical-field-v9.html",
      "/prime-erp/:path*",
      "/workbench/runtime/:path*",
    ].map((source) => ({ source, headers: noindex }));

    // Batch 5 (ADR-014 follow-up): every raw standalone lab, whether framed or
    // visited directly, runs in an opaque-origin sandbox, so it can never read the
    // Artemis session cookie. Tokens come from data/standalone-labs.json (shared
    // with the iframe wrappers). CORS lets sandboxed labs fetch their own public
    // files. The strict catch-all comes first; later, specific rules override it.
    // Exempt labs (sandbox: null) are excluded from the strict catch-all by prefix.
    const exemptPrefixes = standaloneLabs.labs
      .filter((lab) => lab.sandbox === null)
      .flatMap((lab) => lab.paths)
      .map((p) => p.replace(/^\/standalone\//, "").replace(/:path\*$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const catchAll = exemptPrefixes.length
      ? `/standalone/:path((?!${exemptPrefixes.join("|")}).*)`
      : "/standalone/:path*";
    const sandboxRules = [
      { source: catchAll, tokens: "allow-scripts" },
      ...standaloneLabs.labs
        .filter((lab) => lab.sandbox !== null)
        .flatMap((lab) => lab.paths.map((source) => ({ source, tokens: lab.sandbox }))),
    ].map(({ source, tokens }) => ({
      source,
      headers: [
        { key: "Content-Security-Policy", value: `sandbox ${tokens}` },
        { key: "Access-Control-Allow-Origin", value: "*" },
      ],
    }));

    // Self-hosted, version-pinned vendor files (public/vendor/manifest.json).
    const vendorRules = [
      {
        source: "/vendor/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];

    return [...noindexRules, ...sandboxRules, ...vendorRules];
  },
  async redirects() {
    return [
      {
        source: "/labs/geometric-workbench/v5-8",
        destination: "/workbench/app",
        permanent: false,
      },
      {
        source: "/labs/geometric-workbench/v5-8/index.html",
        destination: "/workbench/app",
        permanent: false,
      },
      {
        source: "/labs/geometric-workbench/v6",
        destination: "/workbench/app",
        permanent: false,
      },
      {
        source: "/demo",
        destination: "/portfolio",
        permanent: false,
      },
      {
        source: "/labs/prime-erp",
        destination: "/erp",
        permanent: false,
      },
      {
        source: "/products/bidroom/evidence-engine",
        destination: "/products/bidroom/atlasiq",
        permanent: false,
      },
      {
        source: "/academy",
        destination: "/insights",
        permanent: false,
      },
      {
        source: "/academy/:slug",
        destination: "/insights",
        permanent: false,
      },
      {
        source: "/case-studies",
        destination: "/insights",
        permanent: false,
      },
      {
        source: "/case-studies/:slug",
        destination: "/insights",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/labs/utility-intelligence-bridge/3d-model",
          destination: "/standalone/utility-intelligence-bridge/3d-model/index.html",
        },
        {
          source: "/labs/utility-intelligence-bridge/3d-model/app",
          destination: "/standalone/utility-intelligence-bridge/3d-model/index.html",
        },
        {
          source: "/workbench/runtime/latest",
          destination: "/labs/geometric-workbench/v5-8/index.html",
        },
        {
          source: "/workbench/runtime/latest/:path*",
          destination: "/labs/geometric-workbench/v5-8/:path*",
        },
        // The runtime page is served at "/workbench/runtime/latest" (no trailing slash), so its
        // relative assets (e.g. "./v6-integrity.js") resolve to "/workbench/runtime/<file>", not
        // ".../latest/<file>". Without this rule they 404 (HTML), the browser blocks them (ORB),
        // "ARTEMIS_V6 is not defined" is thrown, and the model never initializes.
        {
          source: "/workbench/runtime/:file(.+\\.(?:js|css|json|png|jpe?g|svg|webp|woff2?))",
          destination: "/labs/geometric-workbench/v5-8/:file",
        },
      ],
      // afterFiles runs after filesystem routes, so app/api/* can never be shadowed.
      afterFiles: primeErpRewrites,
    };
  },
};

const withMDX = createMDX({
  options: {
    // remarkFrontmatter strips the `---` block so MDX bodies render cleanly
    // (frontmatter is parsed separately via gray-matter in lib/content).
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
