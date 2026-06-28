import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { ArtemisMark } from "@/components/layout/ArtemisMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/70 bg-navy-deep/40">
      <div className="meander-divider" aria-hidden />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <ArtemisMark className="h-8 w-8 text-gold" />
              <span className="display-serif text-lg text-parchment">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Ancient intelligence, modern automation — for
              engineering, construction, and project controls.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <p className="eyebrow">{group.heading}</p>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
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
            © {year} {siteConfig.name}. Prototype running under the aGOraXai ecosystem.
          </p>
          <p className="font-mono tracking-wide">artemis.agoraxai.com</p>
        </div>
      </Container>
    </footer>
  );
}
