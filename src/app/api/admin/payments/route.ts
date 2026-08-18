import { listPayments } from "@/lib/repositories/payments";
import type { PaymentStatus } from "@/models";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import { handleApiError, jsonResponse } from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PaymentStatus | null;
    const limit = Number(searchParams.get("limit") || "50");
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const payments = await listPayments({
      status: status ?? undefined,
      limit,
      skip,
    });

    return jsonResponse({
      payments,
      page,
      limit,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
