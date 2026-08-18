import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { Container } from "@/components/ui/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getPublishedServiceAreas,
  getServiceAreaBySlug,
} from "@/lib/repositories/service-areas";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { resolveStaticParams } from "@/lib/db/build-time";
import { getBaseUrl } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resolveStaticParams("service areas", async () => {
    const areas = await getPublishedServiceAreas();
    return areas.map((area) => ({ slug: area.slug }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = await getServiceAreaBySlug(slug);
  if (!area) return { title: "Service Area" };

  const metadata = generatePageMetadata({
    title: area.city,
    seo: area.seo,
  });

  if (!area.allowIndexing) {
    return {
      ...metadata,
      robots: { index: false, follow: false },
    };
  }

  return metadata;
}

export default async function ServiceAreaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [area, settingsDoc] = await Promise.all([
    getServiceAreaBySlug(slug),
    getSiteSettings(),
  ]);

  if (!area || !area.published) notFound();

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Service Areas", url: `${baseUrl}/service-areas` },
          { name: area.city, url: `${baseUrl}/service-areas/${area.slug}` },
        ])}
      />

      <section className="relative flex min-h-[40vh] items-center bg-obsidian py-16">
        {area.image?.url && (
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={area.image.url}
              alt={area.image.alt || area.city}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 to-obsidian" />
          </div>
        )}
        <Container className="relative z-10">
          <RevealOnScroll>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-signature-gold">
              Service Area
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl text-ivory">{area.city}</h1>
            <p className="mt-4 max-w-2xl text-muted-silver leading-relaxed">{area.shortSummary}</p>
          </RevealOnScroll>
        </Container>
      </section>

      <SectionRenderer sections={area.sections} context={{ settings }} />
    </>
  );
}
