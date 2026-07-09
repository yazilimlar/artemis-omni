import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { footerNav } from "@/lib/artemis/navigation";
import { Container } from "@/components/ui/container";
import { ArtemisMark } from "@/components/layout/ArtemisMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/70 bg-navy-deep/40">
      <div className="meander-divider" aria-hidden />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <ArtemisMark className="h-8 w-8 text-gold" />
              <span className="display-serif text-lg text-parchment">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Linking field production and actual cost to live
              cashflow forecasts for heavy civil, infrastructure, and project controls.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <p className="eyebrow">{group.heading}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((item) => (
                  <li key={`${group.heading}-${item.href}-${item.title}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/75 transition-colors hover:text-gold"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {year} {siteConfig.name}. Early-stage prototype.
            </p>
            <a
              href="https://www.linkedin.com/company/artemis-omni"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-gold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
          <p className="font-mono tracking-wide">5D Construction Intelligence Bridge</p>
        </div>
      </Container>
    </footer>
  );
}
