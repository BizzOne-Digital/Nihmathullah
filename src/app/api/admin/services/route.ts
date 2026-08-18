import { revalidatePath } from "next/cache";
import {
  createService,
  listAllServices,
} from "@/lib/repositories/services";
import {
  serviceUpdateSchema,
} from "@/lib/validation/admin";
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
    const services = await listAllServices();
    return jsonResponse({ services });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = serviceUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const service = await createService({
      listing: data.listing,
      detailPage: data.detailPage,
    });

    revalidatePath("/services");
    revalidatePath(`/services/${data.listing.slug}`);

    return jsonResponse({ service }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
