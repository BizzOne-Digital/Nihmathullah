import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { generatePageMetadata, buildVerifiedLocalBusinessSchema } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact");
  if (!page) return { title: "Contact" };
  return generatePageMetadata(page);
}

export default async function ContactPage() {
  const [page, settingsDoc] = await Promise.all([
    getPageBySlug("contact"),
    getSiteSettings(),
  ]);

  if (!page) notFound();

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={[
          buildVerifiedLocalBusinessSchema(settings),
          buildBreadcrumbSchema([
            { name: "Home", url: baseUrl },
            { name: "Contact", url: `${baseUrl}/contact` },
          ]),
        ]}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} context={{ settings }} />

      <section className="section-theme-charcoal py-[var(--section-padding-y)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-ivory">Get in Touch</h2>
              <div className="mt-6 space-y-4">
                <PhoneLink
                  display={settings.primaryPhoneDisplay}
                  href={settings.primaryPhoneLink}
                  showIcon
                />
                <a
                  href={`mailto:${settings.primaryEmail}`}
                  className="block text-muted-silver hover:text-signature-gold"
                >
                  {settings.primaryEmail}
                </a>
                <p className="text-sm text-muted-silver">{settings.serviceAreaText}</p>
                {settings.businessHours && (
                  <p className="text-sm text-muted-silver">{settings.businessHours}</p>
                )}
              </div>
              <div className="mt-10">
                <h3 className="font-display text-lg text-ivory">Quick Message</h3>
                <ContactForm className="mt-4" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl text-ivory">Trip Inquiry</h2>
              <p className="mt-2 text-sm text-muted-silver">
                Share trip details for quotes, bookings, or corporate requests.
              </p>
              <InquiryForm className="mt-6" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
