import { revalidatePath } from "next/cache";
import {
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/repositories/site-settings";
import { siteSettingsUpdateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const settings = await getSiteSettings();
    return jsonResponse({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = siteSettingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const settings = await updateSiteSettings(parsed.data);

    revalidatePath("/", "layout");

    return jsonResponse({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
