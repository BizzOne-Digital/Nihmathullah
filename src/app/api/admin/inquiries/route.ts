import { listInquiries, updateInquiry } from "@/lib/repositories/inquiries";
import type { InquiryStatus, InquiryType } from "@/models";
import { inquiryUpdateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as InquiryStatus | null;
    const inquiryType = searchParams.get("type") as InquiryType | null;
    const limit = Number(searchParams.get("limit") || "50");
    const page = Number(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const inquiries = await listInquiries({
      status: status ?? undefined,
      inquiryType: inquiryType ?? undefined,
      limit,
      skip,
    });

    return jsonResponse({
      inquiries,
      page,
      limit,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const { id, ...rest } = body as { id?: string };

    if (!id) {
      return jsonResponse({ error: "id is required" }, 400);
    }

    const parsed = inquiryUpdateSchema.safeParse(rest);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const inquiry = await updateInquiry(id, {
      status: data.status,
      internalNotes: data.internalNotes || undefined,
    });

    return jsonResponse({ inquiry });
  } catch (error) {
    return handleApiError(error);
  }
}
