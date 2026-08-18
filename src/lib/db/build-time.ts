import { isMongoConfigured } from "@/lib/db/connect";

/**
 * Used by generateStaticParams so Vercel builds succeed even when
 * MONGODB_URI is missing at build time. Pages are generated on first request.
 */
export async function resolveStaticParams<T extends Record<string, string>>(
  label: string,
  loader: () => Promise<T[]>
): Promise<T[]> {
  if (!isMongoConfigured()) {
    console.warn(`[build] MONGODB_URI not set — skipping static params for ${label}`);
    return [];
  }

  try {
    return await loader();
  } catch (error) {
    console.warn(`[build] Failed to load static params for ${label}:`, error);
    return [];
  }
}
