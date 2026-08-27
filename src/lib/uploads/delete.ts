import { deleteStoredUploadByUrl as deleteFromMongo } from "@/lib/uploads/stored";
import { parseStoredUploadUrl } from "@/lib/uploads/stored";
import { deleteUpload as deleteLegacyDiskUpload } from "@/lib/uploads/handler";

/**
 * Deletes a stored MongoDB upload or legacy disk upload by public URL.
 */
export async function deleteUploadByUrl(url: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (url.startsWith("/api/uploads/")) {
    if (!parseStoredUploadUrl(url)) {
      return { success: false, error: "Invalid stored upload URL" };
    }
    const deleted = await deleteFromMongo(url);
    return deleted
      ? { success: true }
      : { success: false, error: "Stored upload not found" };
  }

  return deleteLegacyDiskUpload(url);
}
