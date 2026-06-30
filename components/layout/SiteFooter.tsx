import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { footerNav } from "@/lib/artemis/navigation";
import { Container } from "@/components/ui/container";
import { ArtemisLogo } from "@/components/layout/ArtemisLogo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/70 bg-navy-deep/40">
      <div className="meander-divider" aria-hidden />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <ArtemisLogo />
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Early-stage prototype.
          </p>
          <p className="font-mono tracking-wide">5D Construction Intelligence Bridge</p>
        </div>
      </Container>
    </footer>
  );
}
