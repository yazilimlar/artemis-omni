import path from "node:path";
import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  images: {
    // Prepare for remote/optimized imagery later. Add remotePatterns when needed.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Keep MDX rendering on the modern compiler path.
    mdxRs: false,
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
