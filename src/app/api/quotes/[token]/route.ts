import { getQuoteByToken, updateQuoteStatus } from "@/lib/repositories/quotes";
import { toPublicQuote } from "@/lib/api/quotes";
import { handleApiError, jsonError, jsonResponse } from "@/lib/api/response";

export async function GET(
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

    if (quote.expiresAt.getTime() <= Date.now()) {
      return jsonError("This quote has expired", 404);
    }

    if (
      quote.status === "Sent/Shared" &&
      quote._id
    ) {
      await updateQuoteStatus(quote._id.toString(), "Viewed");
      quote.status = "Viewed";
      quote.viewedAt = new Date();
    }

    return jsonResponse({ quote: toPublicQuote(quote) });
  } catch (error) {
    return handleApiError(error);
  }
}
