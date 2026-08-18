import type { Metadata } from "next";
import { HomeCinematicHero } from "@/components/public/HomeCinematicHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { getPublishedServices } from "@/lib/repositories/services";
import { getPublishedTestimonials } from "@/lib/repositories/testimonials";
import { getPublishedFaqs } from "@/lib/repositories/faqs";
import { getPublishedServiceAreas } from "@/lib/repositories/service-areas";
import { getPublishedVehicles } from "@/lib/repositories/fleet";
import { getPublishedImages } from "@/lib/repositories/gallery";
import { getPublishedPosts } from "@/lib/repositories/blog";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import {
  generatePageMetadata,
  buildVerifiedLocalBusinessSchema,
} from "@/lib/seo/metadata";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");
  if (!page) {
    return { title: "Home" };
  }
  return generatePageMetadata(page, DEFAULT_SITE_SETTINGS.aboutStatement);
}

export default async function HomePage() {
  const [
    page,
    settingsDoc,
    services,
    testimonials,
    faqs,
    serviceAreas,
    vehicles,
    galleryImages,
    blogPosts,
    pricingDoc,
  ] = await Promise.all([
    getPageBySlug("home"),
    getSiteSettings(),
    getPublishedServices(),
    getPublishedTestimonials(),
    getPublishedFaqs(),
    getPublishedServiceAreas(),
    getPublishedVehicles(),
    getPublishedImages(),
    getPublishedPosts(),
    getPricingSettings(),
  ]);

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const localBusiness = buildVerifiedLocalBusinessSchema(settings);

  if (!page) {
    return (
      <>
        <JsonLd data={localBusiness} />
        <HomeCinematicHero settings={settings} />
        <section className="section-theme-black py-[var(--section-padding-y)]">
          <Container className="text-center">
            <p className="mx-auto max-w-xl text-sm text-signature-gold">
              Homepage sections are not loaded from the database yet. Run{" "}
              <code className="rounded bg-charcoal px-2 py-1">npm run seed</code>{" "}
              and restart the dev server, then refresh.
            </p>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <JsonLd data={localBusiness} />
      <HomeCinematicHero
        settings={settings}
        headline={
          page.hero?.heading ||
          settings.headline ||
          "Reliable Airport, Executive, Local & Long-Distance Transportation"
        }
        subheading={
          page.hero?.subheading ||
          "Professional private car service for airport transfers, business travel, local rides and long-distance trips."
        }
      />
      <SectionRenderer
        sections={page.sections.filter(
          (section) => section.type !== "quickQuote" && section.key !== "home-quick-quote"
        )}
        context={{
          services,
          testimonials,
          faqs,
          serviceAreas,
          vehicles,
          galleryImages,
          blogPosts,
          settings,
          pricing: pricingDoc ?? undefined,
        }}
      />
    </>
  );
}
