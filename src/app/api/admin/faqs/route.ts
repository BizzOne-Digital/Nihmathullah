import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { FAQ } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  faqCreateSchema,
  faqUpdateSchema,
} from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    await connectDB();
    const faqs = await FAQ.find().sort({ order: 1, question: 1 }).lean();
    return jsonResponse({ faqs: mapRepositoryDoc(faqs) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = faqCreateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await connectDB();
    const faq = await FAQ.create(parsed.data);

    revalidatePath("/faqs");

    return jsonResponse({ faq: mapRepositoryDoc(faq.toObject()) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = faqUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id, ...data } = parsed.data;
    await connectDB();

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return jsonError("FAQ not found", 404);
    }

    revalidatePath("/faqs");

    return jsonResponse({ faq: mapRepositoryDoc(faq.toObject()) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("id is required", 400);
    }

    await connectDB();
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return jsonError("FAQ not found", 404);
    }

    revalidatePath("/faqs");

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
