import { revalidatePath } from "next/cache";
import { updateBooking } from "@/lib/repositories/bookings";
import {
  getQuoteByToken,
  isQuotePayable,
  updateQuoteStatus,
} from "@/lib/repositories/quotes";
import { handleApiError, jsonError, jsonResponse } from "@/lib/api/response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || token.length < 16) {
      return jsonError("Invalid quote token", 400);
    }

    const quote = await getQuoteByToken(token);

    if (!quote) {
      return jsonError("Quote not found", 404);
    }

    if (!isQuotePayable(quote)) {
      return jsonError("This quote cannot be accepted", 400);
    }

    if (quote.status === "Accepted") {
      return jsonResponse({ success: true, alreadyAccepted: true });
    }

    await updateQuoteStatus(quote._id.toString(), "Accepted");

    await updateBooking(quote.bookingId.toString(), {
      status: "Customer Accepted",
      auditEntry: {
        action: "quote_accepted",
        timestamp: new Date(),
        note: `Customer accepted quote ${quote.reference}`,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/quotes");

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
