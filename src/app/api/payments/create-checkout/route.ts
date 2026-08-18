import { createCheckoutSession } from "@/lib/payments/stripe";
import { getQuoteByToken } from "@/lib/repositories/quotes";
import { checkoutSchema } from "@/lib/validation/admin";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api/request";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(
      ip,
      "checkout",
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const quote = await getQuoteByToken(parsed.data.token);

    if (!quote) {
      return jsonError("Quote not found", 404);
    }

    const result = await createCheckoutSession(quote._id.toString(), {
      quoteToken: parsed.data.token,
    });

    return jsonResponse({
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
