import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import {
  getQuoteById,
  revokeQuote,
  updateQuote,
} from "@/lib/repositories/quotes";
import { calculateQuoteTotals, toAdminQuote } from "@/lib/api/quotes";
import { quoteUpdateSchema } from "@/lib/validation/admin";
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
    const quote = await getQuoteById(id);

    if (!quote) {
      return jsonError("Quote not found", 404);
    }

    return jsonResponse({ quote: toAdminQuote(quote) });
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
    const parsed = quoteUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.status !== undefined) updateData.status = data.status;
    if (data.customerNotes !== undefined) {
      updateData.customerNotes = data.customerNotes || undefined;
    }
    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes || undefined;
    }
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;

    if (data.lineItems) {
      const pricing = await getPricingSettings();
      if (!pricing) {
        return jsonError("Pricing settings not configured", 503);
      }
      const totals = calculateQuoteTotals(data.lineItems, pricing);
      updateData.lineItems = data.lineItems;
      updateData.subtotal = totals.subtotal;
      updateData.taxAmount = totals.taxAmount;
      updateData.feeAmount = totals.feeAmount;
      updateData.total = totals.total;
      updateData.depositAmount = totals.depositAmount;
    }

    const quote = await updateQuote(id, updateData);

    revalidatePath("/admin/quotes");

    return jsonResponse({ quote: toAdminQuote(quote) });
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

    if (!Types.ObjectId.isValid(id)) {
      return jsonError("Invalid quote id", 400);
    }

    const quote = await revokeQuote(id);

    revalidatePath("/admin/quotes");

    return jsonResponse({ quote: toAdminQuote(quote) });
  } catch (error) {
    return handleApiError(error);
  }
}
