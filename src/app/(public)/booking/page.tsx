import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getSiteSettings } from "@/lib/repositories/site-settings";
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
  const [page, settingsDoc] = await Promise.all([
    getPageBySlug("booking"),
    getSiteSettings(),
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

      <section className="section-theme-black pb-4 pt-28 md:pt-32">
        <Container size="narrow">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-signature-gold">
              Book Your Ride
            </p>
            <h1 className="mt-3 font-display text-3xl text-ivory md:text-4xl">
              {page.hero?.heading || page.title}
            </h1>
            {page.hero?.subheading && (
              <p className="mx-auto mt-3 max-w-2xl text-muted-silver">
                {page.hero.subheading}
              </p>
            )}
          </div>

          <Suspense fallback={<p className="text-muted-silver">Loading booking form...</p>}>
            <BookingPageClient confirmationText={settings.bookingConfirmationText} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
