import { deleteUploadByUrl } from "@/lib/uploads/delete";
import { uploadDeleteSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = uploadDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const result = await deleteUploadByUrl(parsed.data.url);

    if (!result.success) {
      return jsonError(result.error ?? "Failed to delete upload", 400);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
