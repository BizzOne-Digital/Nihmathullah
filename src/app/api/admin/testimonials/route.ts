import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { Testimonial } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  testimonialCreateSchema,
  testimonialUpdateSchema,
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
    const testimonials = await Testimonial.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return jsonResponse({ testimonials: mapRepositoryDoc(testimonials) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = testimonialCreateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await connectDB();
    const testimonial = await Testimonial.create(parsed.data);

    revalidatePath("/testimonials");

    return jsonResponse(
      { testimonial: mapRepositoryDoc(testimonial.toObject()) },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = testimonialUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id, ...data } = parsed.data;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return jsonError("Testimonial not found", 404);
    }

    revalidatePath("/testimonials");

    return jsonResponse({
      testimonial: mapRepositoryDoc(testimonial.toObject()),
    });
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
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return jsonError("Testimonial not found", 404);
    }

    revalidatePath("/testimonials");

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
