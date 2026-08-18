import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { getBookingById, updateBooking } from "@/lib/repositories/bookings";
import { bookingUpdateSchema } from "@/lib/validation/admin";
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
    const booking = await getBookingById(id);

    if (!booking) {
      return jsonError("Booking not found", 404);
    }

    return jsonResponse({ booking });
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
    const parsed = bookingUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const booking = await updateBooking(id, {
      status: data.status,
      internalNotes: data.internalNotes || undefined,
      assignedVehicle: data.assignedVehicle || undefined,
      assignedDriver: data.assignedDriver || undefined,
      auditEntry: {
        action: "admin_update",
        timestamp: new Date(),
        adminUserId: new Types.ObjectId(auth.adminUserId),
        note: "Booking updated by admin",
      },
    });

    revalidatePath("/admin/bookings");

    return jsonResponse({ booking });
  } catch (error) {
    return handleApiError(error);
  }
}
