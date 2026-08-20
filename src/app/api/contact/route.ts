import { contactFormSchema } from "@/lib/validation/booking";
import { createInquiry } from "@/lib/repositories/inquiries";
import { notifyAdminNewInquiry } from "@/lib/email/notifications";
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

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(
      ip,
      "contact",
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

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
      inquiryType: "general",
      message: data.message,
      consent: data.consent,
    });

    void notifyAdminNewInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiryType: "general",
      message: data.message,
    });

    return jsonResponse({
      success: true,
      id: inquiry._id.toString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
