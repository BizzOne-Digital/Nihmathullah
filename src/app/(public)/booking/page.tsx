import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";
import { BookingPageClient } from "./BookingPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("booking");
  if (!page) return { title: "Book a Ride" };
  return generatePageMetadata(page);
}

export default async function BookingPage() {
  const [page, settingsDoc, pricingDoc] = await Promise.all([
    getPageBySlug("booking"),
    getSiteSettings(),
    getPricingSettings(),
  ]);

  if (!page) notFound();

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Booking", url: `${baseUrl}/booking` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer
        sections={page.sections}
        context={{ settings, pricing: pricingDoc ?? undefined }}
      />
      <section className="section-theme-charcoal py-[var(--section-padding-y)]">
        <Container size="narrow">
          <Suspense fallback={<p className="text-muted-silver">Loading booking form...</p>}>
            <BookingPageClient confirmationText={settings.bookingConfirmationText} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
