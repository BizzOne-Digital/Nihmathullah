import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
} from "@/lib/api/response";
import { isStoredUploadFolder, storeUpload } from "@/lib/uploads/stored";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const formData = await request.formData();
    const folderValue = formData.get("folder");
    const file = formData.get("file");

    if (typeof folderValue !== "string" || !isStoredUploadFolder(folderValue)) {
      return jsonError(
        "Invalid folder. Allowed: products, gallery, pages, misc",
        400
      );
    }

    if (!(file instanceof File)) {
      return jsonError("No file provided", 400);
    }

    const result = await storeUpload(file, folderValue);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonResponse(
      {
        success: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
        folder: result.folder,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
