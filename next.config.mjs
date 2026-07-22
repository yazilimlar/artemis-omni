import path from "node:path";
import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WORKBENCH_V6_SOURCE =
  "https://artemis-omni-dy3446f7n-gokmen1313-3041s-projects.vercel.app/labs/geometric-workbench/v5-8";

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
          source: "/workbench/releases/v6.0.0-alpha",
          destination: `${WORKBENCH_V6_SOURCE}/index.html`,
        },
        {
          source: "/workbench/releases/v6.0.0-alpha/index.html",
          destination: `${WORKBENCH_V6_SOURCE}/index.html`,
        },
        {
          source: "/workbench/releases/v6.0.0-alpha/:path*",
          destination: `${WORKBENCH_V6_SOURCE}/:path*`,
        },
        {
          source: "/workbench/runtime/latest",
          destination: `${WORKBENCH_V6_SOURCE}/index.html`,
        },
        {
          source: "/workbench/runtime/latest/:path*",
          destination: `${WORKBENCH_V6_SOURCE}/:path*`,
        },
      ],
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
