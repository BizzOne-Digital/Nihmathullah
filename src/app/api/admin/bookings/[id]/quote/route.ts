import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { generateSecureToken } from "@/lib/auth/tokens";
import { getBookingById, updateBooking } from "@/lib/repositories/bookings";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import { createQuote } from "@/lib/repositories/quotes";
import { calculateQuoteTotals } from "@/lib/api/quotes";
import { quoteCreateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function POST(
  request: Request,
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

    const body = await request.json();
    const parsed = quoteCreateSchema.safeParse({ ...body, bookingId: id });

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const pricing = await getPricingSettings();

    if (!pricing) {
      return jsonError("Pricing settings not configured", 503);
    }

    const totals = calculateQuoteTotals(data.lineItems, pricing);
    const token = generateSecureToken();

    const expiresAt =
      data.expiresAt ??
      new Date(
        Date.now() + pricing.defaultQuoteExpirationDays * 24 * 60 * 60 * 1000
      );

    const quote = await createQuote({
      bookingId: id,
      token,
      lineItems: data.lineItems,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      feeAmount: totals.feeAmount,
      total: totals.total,
      depositAmount: totals.depositAmount,
      customerNotes: data.customerNotes || undefined,
      internalNotes: data.internalNotes || undefined,
      status: data.status,
      expiresAt,
    });

    await updateBooking(id, {
      status: "Quoted",
      auditEntry: {
        action: "quote_created",
        timestamp: new Date(),
        adminUserId: new Types.ObjectId(auth.adminUserId),
        note: `Quote ${quote.reference} created`,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/quotes");

    return jsonResponse(
      {
        quote: {
          id: quote._id.toString(),
          reference: quote.reference,
          token,
          status: quote.status,
          total: quote.total,
          depositAmount: quote.depositAmount,
          expiresAt: quote.expiresAt.toISOString(),
        },
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
