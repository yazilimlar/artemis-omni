import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { canSeeAllProducts, filterVisibleProducts } from "@/lib/auth/profile";
import { requireAuth } from "@/lib/auth/require-auth";
import { linkableRoute, loadProducts } from "@/lib/registry/load";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({ title: "Dashboard", path: "/dashboard", noIndex: true });

function SignOutForm() {
  return (
    <form action="/auth/signout" method="post">
      <Button type="submit" variant="outline">
        Sign out
      </Button>
    </form>
  );
}

export default async function DashboardPage() {
  const { email, profile } = await requireAuth();

  if (!profile) {
    return (
      <section className="py-20 lg:py-28">
        <Container className="max-w-xl">
          <div className="rounded-lg border border-border/70 bg-navy-deep/50 p-8 shadow-panel">
            <p className="eyebrow">Dashboard</p>
            <h1 className="display-serif mt-3 text-3xl text-parchment">
              Profile not yet provisioned.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Contact the owner. You are signed in as {email}.
            </p>
            <div className="mt-6">
              <SignOutForm />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const products = filterVisibleProducts(loadProducts(), profile);
  const scope = canSeeAllProducts(profile)
    ? "Every registered product."
    : "Products with public or public-safe-demo visibility.";

  return (
    <>
      <PageHero
        eyebrow="Dashboard"
        title={`Signed in as ${email}`}
        description={profile.display_name ?? undefined}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{profile.role}</Badge>
          <SignOutForm />
        </div>
      </PageHero>

      <section className="border-b border-border/60 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Your access"
            title={`${products.length} registered product${products.length === 1 ? "" : "s"}`}
            description={scope}
          />
          <ul className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const route = linkableRoute(product);
              return (
                <li
                  key={product.id}
                  className="min-w-0 rounded-md border border-border/60 bg-background/30 px-4 py-3"
                >
                  <p className="text-sm text-parchment">{product.name}</p>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">
                    {product.visibility}
                  </p>
                  <p className="mt-2 break-all font-mono text-xs">
                    {route ? (
                      <Link href={route} className="text-gold-soft underline-offset-4 hover:underline">
                        {route}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground/70">not yet routed</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="System"
            title="Internal registry views"
            description="Each page enforces its own sign-in and allowlist check."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/control" variant="outline">
              Registry control
            </Button>
            <Button href="/system-map" variant="outline">
              System map
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
