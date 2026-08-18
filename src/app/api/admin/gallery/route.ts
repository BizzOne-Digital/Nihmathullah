import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { GalleryCategory, GalleryImage } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  galleryCategoryCreateSchema,
  galleryCategoryUpdateSchema,
  galleryImageCreateSchema,
  galleryImageUpdateSchema,
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
    const categories = await GalleryCategory.find()
      .sort({ order: 1, name: 1 })
      .lean();
    const images = await GalleryImage.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return jsonResponse({
      categories: mapRepositoryDoc(categories),
      images: mapRepositoryDoc(images),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const entity = body.entity as "category" | "image" | undefined;

    await connectDB();

    if (entity === "category") {
      const parsed = galleryCategoryCreateSchema.safeParse(body);
      if (!parsed.success) return zodErrorResponse(parsed.error);

      const category = await GalleryCategory.create(parsed.data);
      revalidatePath("/gallery");
      return jsonResponse(
        { category: mapRepositoryDoc(category.toObject()) },
        201
      );
    }

    if (entity === "image") {
      const parsed = galleryImageCreateSchema.safeParse(body);
      if (!parsed.success) return zodErrorResponse(parsed.error);

      const image = await GalleryImage.create(parsed.data);
      revalidatePath("/gallery");
      return jsonResponse(
        { image: mapRepositoryDoc(image.toObject()) },
        201
      );
    }

    return jsonError("entity must be 'category' or 'image'", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const entity = body.entity as "category" | "image" | undefined;

    await connectDB();

    if (entity === "category") {
      const parsed = galleryCategoryUpdateSchema.safeParse(body);
      if (!parsed.success) return zodErrorResponse(parsed.error);

      const { id, ...data } = parsed.data;
      const category = await GalleryCategory.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!category) return jsonError("Category not found", 404);

      revalidatePath("/gallery");
      return jsonResponse({
        category: mapRepositoryDoc(category.toObject()),
      });
    }

    if (entity === "image") {
      const parsed = galleryImageUpdateSchema.safeParse(body);
      if (!parsed.success) return zodErrorResponse(parsed.error);

      const { id, ...data } = parsed.data;
      const image = await GalleryImage.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!image) return jsonError("Image not found", 404);

      revalidatePath("/gallery");
      return jsonResponse({ image: mapRepositoryDoc(image.toObject()) });
    }

    return jsonError("entity must be 'category' or 'image'", 400);
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
    const entity = searchParams.get("entity");

    if (!id) return jsonError("id is required", 400);

    await connectDB();

    if (entity === "category") {
      const category = await GalleryCategory.findByIdAndDelete(id);
      if (!category) return jsonError("Category not found", 404);
      revalidatePath("/gallery");
      return jsonResponse({ success: true });
    }

    if (entity === "image") {
      const image = await GalleryImage.findByIdAndDelete(id);
      if (!image) return jsonError("Image not found", 404);
      revalidatePath("/gallery");
      return jsonResponse({ success: true });
    }

    return jsonError("entity must be 'category' or 'image'", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
