import { handleStripeWebhook } from "@/lib/payments/stripe";
import { handleApiError, jsonError, jsonResponse } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return jsonError("Missing Stripe signature", 400);
    }

    const rawBody = await request.text();
    const result = await handleStripeWebhook(rawBody, signature);

    return jsonResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
