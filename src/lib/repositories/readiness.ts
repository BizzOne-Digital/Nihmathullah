import { isMongoConfigured } from "@/lib/db/connect";

/** Skip public DB reads when MONGODB_URI is missing (e.g. Vercel build without env). */
export function isDatabaseUnavailable(): boolean {
  return !isMongoConfigured();
}
