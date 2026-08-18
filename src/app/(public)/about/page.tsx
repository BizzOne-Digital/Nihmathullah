import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { getPublishedServiceAreas } from "@/lib/repositories/service-areas";
import { getPublishedVehicles } from "@/lib/repositories/fleet";
import { generatePageMetadata, buildVerifiedLocalBusinessSchema } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  if (!page) return { title: "About" };
  return generatePageMetadata(page);
}

export default async function AboutPage() {
  const [page, settingsDoc, serviceAreas, vehicles] = await Promise.all([
    getPageBySlug("about"),
    getSiteSettings(),
    getPublishedServiceAreas(),
    getPublishedVehicles(),
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
            { name: "About", url: `${baseUrl}/about` },
          ]),
        ]}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer
        sections={page.sections}
        context={{ settings, serviceAreas, vehicles }}
      />
    </>
  );
}
