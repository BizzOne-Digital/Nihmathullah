import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedServices } from "@/lib/repositories/services";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("services");
  if (!page) return { title: "Services" };
  return generatePageMetadata(page);
}

export default async function ServicesPage() {
  const [page, services, pricingDoc] = await Promise.all([
    getPageBySlug("services"),
    getPublishedServices(),
    getPricingSettings(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Services", url: `${baseUrl}/services` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer
        sections={page.sections}
        context={{ services, pricing: pricingDoc ?? undefined }}
      />
    </>
  );
}
