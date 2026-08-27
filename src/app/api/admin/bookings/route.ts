import { listBookings } from "@/lib/repositories/bookings";
import type { BookingMode, BookingStatus } from "@/models";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import { handleApiError, jsonResponse } from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const mode = searchParams.get("mode") as BookingMode | null;
    const limit = Number(searchParams.get("limit") || "500");
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const bookings = await listBookings({
      status: status ?? undefined,
      mode: mode ?? undefined,
      limit,
      skip,
    });

    return jsonResponse({
      bookings,
      page,
      limit,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
