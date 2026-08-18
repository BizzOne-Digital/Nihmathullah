import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { QuotePaymentPage } from "@/components/booking/QuotePaymentPage";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";

export const metadata: Metadata = {
  title: "Review Quote",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function QuoteTokenPage({ params }: PageProps) {
  const { token } = await params;
  const pricing = await getPricingSettings();

  return (
    <section className="section-theme-black py-[var(--section-padding-y)]">
      <Container size="narrow">
        <h1 className="mb-8 font-display text-3xl text-ivory">Your Transportation Quote</h1>
        <QuotePaymentPage
          token={token}
          paymentEnabled={pricing?.paymentEnabled ?? false}
          currency={pricing?.currency ?? "USD"}
        />
      </Container>
    </section>
  );
}
