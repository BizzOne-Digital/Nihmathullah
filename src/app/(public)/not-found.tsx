import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-obsidian py-20">
      <Container className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-signature-gold">404</p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-ivory">Page Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-silver leading-relaxed">
          The page you are looking for may have moved or no longer exists. Let us help you get back
          on route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="gold" magnetic>Return Home</Button>
          <Link href="/contact" className="text-sm text-signature-gold hover:text-champagne">
            Contact SierraLink
          </Link>
        </div>
      </Container>
    </section>
  );
}
