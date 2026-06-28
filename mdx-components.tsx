import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Global MDX component overrides (required by @next/mdx in the App Router).
 * Styling is mostly handled by the `prose` wrapper around MDX bodies; here we
 * upgrade a few elements (internal links, callouts) and expose custom components
 * so content packages can embed interactive React directly.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href = "", children, ...props }) => {
      const isInternal = href.startsWith("/") || href.startsWith("#");
      if (isInternal) {
        return (
          <Link href={href} className="text-gold underline-offset-4 hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline-offset-4 hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    },
    Callout: ({ children, title }: { children: React.ReactNode; title?: string }) => (
      <aside className="not-prose my-6 rounded-lg border border-gold/30 bg-gold/5 p-5">
        {title ? (
          <p className="eyebrow mb-2">{title}</p>
        ) : null}
        <div className="text-sm text-foreground/85">{children}</div>
      </aside>
    ),
    ...components,
  };
}
