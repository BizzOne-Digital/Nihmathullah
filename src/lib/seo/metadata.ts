import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { getBaseUrl } from "@/lib/utils";
import type { IPage, IService, ISiteSettings } from "@/models";
import type { SeoFields, SiteSettingsData } from "@/types";
import {
  buildLocalBusinessSchema,
  type LocalBusinessSchema,
} from "./structured-data";

type MetadataSource = {
  title: string;
  seo?: SeoFields;
};

function resolveSeo(
  source: MetadataSource,
  fallbackDescription?: string
): Metadata {
  const title = source.seo?.title?.trim() || source.title;
  const description =
    source.seo?.description?.trim() || fallbackDescription?.trim();
  const canonical = source.seo?.canonical?.trim();
  const socialImage = source.seo?.socialImage?.trim();
  const baseUrl = getBaseUrl();

  const metadata: Metadata = {
    title,
    ...(description ? { description } : {}),
    ...(source.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      ...(description ? { description } : {}),
      siteName: SITE_NAME,
      type: "website",
      ...(socialImage
        ? {
            images: [
              socialImage.startsWith("http")
                ? socialImage
                : `${baseUrl}${socialImage.startsWith("/") ? "" : "/"}${socialImage}`,
            ],
          }
        : {}),
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      ...(description ? { description } : {}),
      ...(socialImage
        ? {
            images: [
              socialImage.startsWith("http")
                ? socialImage
                : `${baseUrl}${socialImage.startsWith("/") ? "" : "/"}${socialImage}`,
            ],
          }
        : {}),
    },
  };

  return metadata;
}

export function generatePageMetadata(
  page: Pick<IPage, "title" | "seo">,
  fallbackDescription?: string
): Metadata {
  return resolveSeo(page, fallbackDescription);
}

export function generateServiceMetadata(
  service: IService,
  fallbackDescription?: string
): Metadata {
  const listing = service.listing;
  const seo = listing.seo ?? service.detailPage?.seo;

  return resolveSeo(
    {
      title: seo?.title?.trim() || listing.title,
      seo,
    },
    fallbackDescription ?? listing.shortDescription
  );
}

export function buildVerifiedLocalBusinessSchema(
  site: SiteSettingsData | ISiteSettings
): LocalBusinessSchema | null {
  return buildLocalBusinessSchema(site, getBaseUrl());
}
