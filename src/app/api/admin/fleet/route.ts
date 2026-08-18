import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { Vehicle } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  vehicleCreateSchema,
  vehicleUpdateSchema,
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
    const vehicles = await Vehicle.find()
      .sort({ order: 1, displayName: 1 })
      .lean();
    return jsonResponse({ vehicles: mapRepositoryDoc(vehicles) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = vehicleCreateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await connectDB();
    const vehicle = await Vehicle.create(parsed.data);

    revalidatePath("/fleet");

    return jsonResponse(
      { vehicle: mapRepositoryDoc(vehicle.toObject()) },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = vehicleUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id, ...data } = parsed.data;
    await connectDB();

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return jsonError("Vehicle not found", 404);
    }

    revalidatePath("/fleet");

    return jsonResponse({ vehicle: mapRepositoryDoc(vehicle.toObject()) });
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
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return jsonError("Vehicle not found", 404);
    }

    revalidatePath("/fleet");

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
