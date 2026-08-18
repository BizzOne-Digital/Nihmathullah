import type { SiteSettingsData } from "@/types";

export type LocalBusinessSchema = {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name?: string;
  url?: string;
  logo?: string;
  image?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  areaServed?: string;
  sameAs?: string[];
};

export type ServiceSchemaInput = {
  name: string;
  description: string;
  url: string;
  providerName: string;
  providerUrl: string;
  image?: string;
  areaServed?: string;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

export function buildLocalBusinessSchema(
  site: SiteSettingsData,
  siteUrl: string
): LocalBusinessSchema | null {
  if (!site.businessName?.trim()) {
    return null;
  }

  const schema: LocalBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.businessName,
    url: siteUrl,
  };

  if (site.logoUrl?.trim()) {
    const logo = absoluteUrl(site.logoUrl, siteUrl);
    schema.logo = logo;
    schema.image = logo;
  }

  if (site.aboutStatement?.trim()) {
    schema.description = site.aboutStatement;
  }

  if (site.primaryPhoneLink?.trim()) {
    schema.telephone = site.primaryPhoneLink.replace(/^tel:/i, "");
  }

  if (site.primaryEmail?.trim()) {
    schema.email = site.primaryEmail;
  }

  const address = buildPostalAddress(site);
  if (address) {
    schema.address = address;
  }

  if (
    typeof site.geoLat === "number" &&
    typeof site.geoLng === "number" &&
    Number.isFinite(site.geoLat) &&
    Number.isFinite(site.geoLng)
  ) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: site.geoLat,
      longitude: site.geoLng,
    };
  }

  if (site.businessHours?.trim()) {
    schema.openingHours = site.businessHours;
  }

  if (site.serviceAreaText?.trim()) {
    schema.areaServed = site.serviceAreaText;
  }

  const sameAs = (site.socialLinks ?? [])
    .map((link) => link.url?.trim())
    .filter((url): url is string => Boolean(url));

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

export function buildServiceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      "@type": "LocalBusiness",
      name: input.providerName,
      url: input.providerUrl,
    },
    ...(input.image ? { image: input.image } : {}),
    ...(input.areaServed ? { areaServed: input.areaServed } : {}),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqSchema(items: FaqSchemaItem[]) {
  const published = items.filter(
    (item) => item.question.trim() && item.answer.trim()
  );

  if (published.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: published.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildPostalAddress(site: SiteSettingsData) {
  const streetAddress = site.streetAddress?.trim();
  const addressLocality = site.city?.trim();
  const addressRegion = site.state?.trim();
  const postalCode = site.zip?.trim();
  const addressCountry = site.country?.trim();

  if (
    !streetAddress ||
    !addressLocality ||
    !addressRegion ||
    !postalCode ||
    !addressCountry
  ) {
    return undefined;
  }

  return {
    "@type": "PostalAddress" as const,
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry,
  };
}

function absoluteUrl(path: string, siteUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = siteUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
