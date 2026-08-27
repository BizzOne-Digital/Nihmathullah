import { HOME_HERO_BACKGROUND } from "@/lib/media/sanitize";

/** Shown when a legacy disk upload URL is missing after serverless deploy. */
export const LEGACY_UPLOAD_PLACEHOLDER = "/images/placeholders/gallery-1.svg";

const ALLOWED_LEGACY_UPLOADS = new Set([
  HOME_HERO_BACKGROUND,
  "/uploads/settings/sierralink-logo.png",
]);

function isAllowedLegacyUpload(url: string): boolean {
  if (ALLOWED_LEGACY_UPLOADS.has(url)) return true;
  return url.startsWith("/uploads/settings/");
}

/**
 * Resolves a media URL for display. Legacy `/uploads/...` paths that are not
 * committed static assets fall back to a branded placeholder.
 */
export function resolveMediaUrl(url?: string | null): string {
  if (!url?.trim()) {
    return LEGACY_UPLOAD_PLACEHOLDER;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("/api/uploads/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/") && !isAllowedLegacyUpload(trimmed)) {
    return LEGACY_UPLOAD_PLACEHOLDER;
  }

  return trimmed;
}

export function isStoredUploadUrl(url?: string | null): boolean {
  return Boolean(url?.startsWith("/api/uploads/"));
}
