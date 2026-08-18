import { listQuotes } from "@/lib/repositories/quotes";
import type { QuoteStatus } from "@/models";
import { toAdminQuote } from "@/lib/api/quotes";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import { handleApiError, jsonResponse } from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as QuoteStatus | null;
    const limit = Number(searchParams.get("limit") || "50");
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const quotes = await listQuotes({
      status: status ?? undefined,
      limit,
      skip,
    });

    return jsonResponse({
      quotes: quotes.map(toAdminQuote),
      page,
      limit,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
