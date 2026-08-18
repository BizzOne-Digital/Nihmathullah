import type {
  BlogContentBlock,
  MediaItem,
  PageHero,
  PageSection,
  SeoFields,
  ServiceDetailPage,
  ServiceDetailSection,
  ServiceListing,
} from "@/types";

/** Home cinematic hero — the only page background photo allowed on the public site. */
export const HOME_HERO_BACKGROUND = "/uploads/pages/home-hero-bg.png";

const ALLOWED_UPLOAD_PREFIXES = [
  "/uploads/settings/",
  HOME_HERO_BACKGROUND,
] as const;

export function isPlaceholderMediaUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes("/images/placeholders/");
}

export function isDemoMediaUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.includes("/images/demo/");
}

export function isBlockedMediaUrl(url?: string | null): boolean {
  if (!url) return false;
  if (isDemoMediaUrl(url)) return true;
  if (isPlaceholderMediaUrl(url)) return false;
  if (url.includes("/uploads/")) {
    return !ALLOWED_UPLOAD_PREFIXES.some(
      (prefix) => url === prefix || url.startsWith(prefix)
    );
  }
  return false;
}

export function sanitizeMediaItem(item?: MediaItem | null): MediaItem | undefined {
  if (!item?.url || isBlockedMediaUrl(item.url)) return undefined;
  return item;
}

export function sanitizeMediaList(items?: MediaItem[]): MediaItem[] | undefined {
  if (!items?.length) return undefined;
  const filtered = items
    .map((item) => sanitizeMediaItem(item))
    .filter((item): item is MediaItem => Boolean(item));
  return filtered.length ? filtered : undefined;
}

export function sanitizePageHero(hero?: PageHero): PageHero | undefined {
  if (!hero) return undefined;
  const backgroundImage = sanitizeMediaItem(hero.backgroundImage);
  return {
    ...hero,
    ...(backgroundImage ? { backgroundImage } : { backgroundImage: undefined }),
  };
}

export function sanitizeSeoFields(seo?: SeoFields): SeoFields | undefined {
  if (!seo) return undefined;
  if (seo.socialImage && isBlockedMediaUrl(seo.socialImage)) {
    const { socialImage: _removed, ...rest } = seo;
    return rest;
  }
  return seo;
}

export function sanitizePageSection(section: PageSection): PageSection {
  const next: PageSection = { ...section };

  const primaryMedia = sanitizeMediaItem(next.primaryMedia);
  if (primaryMedia) next.primaryMedia = primaryMedia;
  else delete next.primaryMedia;

  const media = sanitizeMediaList(next.media);
  if (media) next.media = media;
  else delete next.media;

  if (next.items?.length) {
    next.items = next.items.map((item) => {
      const row = { ...item };
      const image = row.image;

      if (image && typeof image === "object" && "url" in image) {
        const cleaned = sanitizeMediaItem(image as MediaItem);
        if (cleaned) row.image = cleaned;
        else delete row.image;
      } else if (typeof image === "string" && isBlockedMediaUrl(image)) {
        delete row.image;
      }

      return row;
    });
  }

  return next;
}

export function sanitizePageSections(sections: PageSection[]): PageSection[] {
  return sections.map(sanitizePageSection);
}

export function sanitizeContentBlocks(
  blocks: BlogContentBlock[]
): BlogContentBlock[] {
  return blocks
    .map((block) => {
      if (block.type !== "image" || !block.media) return block;
      const media = sanitizeMediaItem(block.media);
      if (media) return { ...block, media };
      return null;
    })
    .filter((block): block is BlogContentBlock => block !== null);
}

export function sanitizeServiceListing(listing: ServiceListing): ServiceListing {
  const mainImage = sanitizeMediaItem(listing.mainImage);
  const next = { ...listing };
  if (mainImage) next.mainImage = mainImage;
  else delete next.mainImage;
  return next;
}

export function sanitizeServiceDetailSection(
  section: ServiceDetailSection
): ServiceDetailSection {
  const media = sanitizeMediaList(section.media);
  const next = { ...section };
  if (media) next.media = media;
  else delete next.media;
  return next;
}

export function sanitizeServiceDetailPage(detail: ServiceDetailPage): ServiceDetailPage {
  return {
    ...detail,
    hero: sanitizePageHero(detail.hero),
    sections: detail.sections?.map(sanitizeServiceDetailSection) ?? [],
    seo: sanitizeSeoFields(detail.seo),
  };
}

export function sanitizeOptionalMediaItem(
  item?: MediaItem | null
): MediaItem | undefined {
  return sanitizeMediaItem(item);
}
