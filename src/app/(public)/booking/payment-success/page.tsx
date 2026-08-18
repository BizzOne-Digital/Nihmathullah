import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string; reference?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <section className="section-theme-black py-[var(--section-padding-y)]">
      <Container size="narrow" className="text-center">
        <div className="rounded-sm border border-signature-gold/30 bg-charcoal/40 p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-signature-gold">
            Payment Confirmed
          </p>
          <h1 className="mt-4 font-display text-3xl text-ivory">Thank You</h1>
          <p className="mt-4 text-muted-silver leading-relaxed">
            Your payment has been received. Our team will confirm your reservation and contact you
            with any final trip details.
          </p>
          {params.reference && (
            <p className="mt-4 text-sm text-ivory">
              Reference: <span className="font-mono text-signature-gold">{params.reference}</span>
            </p>
          )}
          {params.session_id && (
            <p className="mt-2 text-xs text-muted-silver">
              Session: {params.session_id}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/" variant="gold" magnetic>Return Home</Button>
            <Link href="/contact" className="text-sm text-signature-gold hover:text-champagne">
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
