import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { getPublishedServiceAreas } from "@/lib/repositories/service-areas";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("service-areas");
  if (!page) return { title: "Service Areas" };
  return generatePageMetadata(page);
}

export default async function ServiceAreasPage() {
  const [page, serviceAreas] = await Promise.all([
    getPageBySlug("service-areas"),
    getPublishedServiceAreas(),
  ]);

  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Service Areas", url: `${baseUrl}/service-areas` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} context={{ serviceAreas }} />
    </>
  );
}
