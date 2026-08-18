import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { ServiceArea } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  serviceAreaCreateSchema,
  serviceAreaUpdateSchema,
} from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    await connectDB();
    const areas = await ServiceArea.find()
      .sort({ order: 1, city: 1 })
      .lean();
    return jsonResponse({ areas: mapRepositoryDoc(areas) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = serviceAreaCreateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await connectDB();
    const area = await ServiceArea.create(parsed.data);

    revalidatePath("/service-areas");
    revalidatePath(`/service-areas/${parsed.data.slug}`);

    return jsonResponse({ area: mapRepositoryDoc(area.toObject()) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = serviceAreaUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id, ...data } = parsed.data;
    await connectDB();

    const area = await ServiceArea.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!area) {
      return jsonError("Service area not found", 404);
    }

    revalidatePath("/service-areas");
    revalidatePath(`/service-areas/${area.slug}`);

    return jsonResponse({ area: mapRepositoryDoc(area.toObject()) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("id is required", 400);
    }

    await connectDB();
    const area = await ServiceArea.findByIdAndDelete(id);

    if (!area) {
      return jsonError("Service area not found", 404);
    }

    revalidatePath("/service-areas");
    revalidatePath(`/service-areas/${area.slug}`);

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
