import { revalidatePath } from "next/cache";
import {
  getPricingSettings,
  updatePricingSettings,
} from "@/lib/repositories/pricing-settings";
import { pricingSettingsUpdateSchema } from "@/lib/validation/admin";
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
    const settings = await getPricingSettings();
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
    const parsed = pricingSettingsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const settings = await updatePricingSettings(parsed.data);

    revalidatePath("/", "layout");
    revalidatePath("/booking");

    return jsonResponse({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
