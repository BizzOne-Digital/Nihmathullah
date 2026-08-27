import { revalidatePath } from "next/cache";
import type { UploadDir } from "@/lib/constants";
import { UPLOAD_DIR_TO_STORED_FOLDER } from "@/lib/constants";
import { isStoredUploadFolder, storeUpload } from "@/lib/uploads/stored";
import { uploadSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Legacy admin upload endpoint — stores in MongoDB (serverless-safe). */
export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const formData = await request.formData();
    const directory = formData.get("directory");

    const parsed = uploadSchema.safeParse({ directory });

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const folder = UPLOAD_DIR_TO_STORED_FOLDER[parsed.data.directory as UploadDir];
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("No file provided", 400);
    }

    if (!isStoredUploadFolder(folder)) {
      return jsonError("Invalid upload folder mapping", 400);
    }

    const result = await storeUpload(file, folder);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    revalidatePath("/");

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
