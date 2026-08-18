import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailTemplate } from "@/components/services/ServiceDetailTemplate";
import { JsonLd } from "@/components/ui/JsonLd";
import { getPublishedServices, getServiceBySlug } from "@/lib/repositories/services";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { generateServiceMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo/structured-data";
import { getBaseUrl } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS, toSiteSettingsData } from "@/lib/site-settings";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((service) => ({ slug: service.listing.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return generateServiceMetadata(service);
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, settingsDoc] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  const settings = settingsDoc ? toSiteSettingsData(settingsDoc) : DEFAULT_SITE_SETTINGS;
  const baseUrl = getBaseUrl();
  const listing = service.listing;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: "Home", url: baseUrl },
            { name: "Services", url: `${baseUrl}/services` },
            { name: listing.title, url: `${baseUrl}/services/${listing.slug}` },
          ]),
          buildServiceSchema({
            name: listing.title,
            description: listing.shortDescription,
            url: `${baseUrl}/services/${listing.slug}`,
            providerName: settings.businessName,
            providerUrl: baseUrl,
            image: listing.mainImage?.url,
            areaServed: settings.serviceAreaText,
          }),
        ]}
      />
      <ServiceDetailTemplate service={service} />
    </>
  );
}
