import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-lunar-radial" aria-hidden />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">Off the project map</p>
        <h1 className="display-serif mt-4 text-6xl text-parchment">404</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          This page isn&apos;t in the model. Let&apos;s get you back to something
          useful.
        </p>
        <div className="mt-8 flex gap-4">
          <Button href="/">Return Home</Button>
          <Button href="/solutions" variant="outline">
            Explore Solutions
          </Button>
        </div>
      </Container>
    </section>
  );
}
