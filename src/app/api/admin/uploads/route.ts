import { handleUpload } from "@/lib/uploads/handler";
import type { UploadDir } from "@/lib/constants";
import { uploadSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

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

    const result = await handleUpload(
      formData,
      parsed.data.directory as UploadDir
    );

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonResponse({ url: result.url }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
