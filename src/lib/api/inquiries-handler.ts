import { inquiryFormSchema } from "@/lib/validation/booking";
import { createInquiry } from "@/lib/repositories/inquiries";
import {
  notifyAdminNewInquiry,
  notifyCustomerInquiryConfirmation,
} from "@/lib/email/notifications";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/request";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function handleInquirySubmission(request: Request): Promise<Response> {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(
      ip,
      "inquiry",
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json();
    const parsed = inquiryFormSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;

    if (data.honeypot) {
      return jsonResponse({ success: true });
    }

    const inquiry = await createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      inquiryType: data.inquiryType,
      pickup: data.pickup || undefined,
      destination: data.destination || undefined,
      preferredDateTime: data.preferredDateTime || undefined,
      message: data.message,
      consent: data.consent,
    });

    const formLabel =
      data.inquiryType === "quote"
        ? "Quote request"
        : data.inquiryType === "booking"
          ? "Booking question"
          : "Inquiry";

    void notifyAdminNewInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiryType: data.inquiryType,
      pickup: data.pickup,
      destination: data.destination,
      preferredDateTime: data.preferredDateTime,
      message: data.message,
      formLabel,
    });

    void notifyCustomerInquiryConfirmation({
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiryType: data.inquiryType,
      pickup: data.pickup,
      destination: data.destination,
      preferredDateTime: data.preferredDateTime,
      message: data.message,
      formLabel,
    });

    return jsonResponse({
      success: true,
      id: inquiry._id.toString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid JSON body") {
      return jsonError("Invalid JSON body", 400);
    }
    return handleApiError(error);
  }
}
