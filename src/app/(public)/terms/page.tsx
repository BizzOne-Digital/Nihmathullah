import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPageBySlug } from "@/lib/repositories/pages";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms");
  if (!page) return { title: "Terms of Service" };
  return generatePageMetadata(page);
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms");
  if (!page) notFound();

  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Terms of Service", url: `${baseUrl}/terms` },
        ])}
      />
      <PageHero hero={page.hero} title={page.title} />
      <SectionRenderer sections={page.sections} />
    </>
  );
}
