import { revalidatePath } from "next/cache";
import {
  deleteServiceById,
  getServiceById,
  updateServiceById,
} from "@/lib/repositories/services";
import { serviceUpdateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
      return jsonError("Service not found", 404);
    }

    return jsonResponse({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = serviceUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const service = await updateServiceById(id, {
      listing: data.listing,
      detailPage: data.detailPage,
      archived: data.archived,
    });

    revalidatePath("/services");
    revalidatePath(`/services/${service.listing.slug}`);

    return jsonResponse({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { id } = await params;
    const service = await deleteServiceById(id);

    revalidatePath("/services");
    revalidatePath(`/services/${service.listing.slug}`);

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
