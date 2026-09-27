import path from "node:path";
import { fileURLToPath } from "node:url";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
