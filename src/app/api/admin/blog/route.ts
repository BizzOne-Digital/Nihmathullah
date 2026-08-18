import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/connect";
import { BlogPost } from "@/models";
import { mapRepositoryDoc } from "@/lib/repositories/serialize";
import {
  blogPostCreateSchema,
  blogPostUpdateSchema,
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
    const posts = await BlogPost.find()
      .sort({ publishDate: -1, createdAt: -1 })
      .lean();
    return jsonResponse({ posts: mapRepositoryDoc(posts) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = blogPostCreateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    await connectDB();
    const post = await BlogPost.create(parsed.data);

    revalidatePath("/blog");
    revalidatePath(`/blog/${parsed.data.slug}`);

    return jsonResponse({ post: mapRepositoryDoc(post.toObject()) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = blogPostUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const { id, ...data } = parsed.data;
    await connectDB();

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!post) {
      return jsonError("Blog post not found", 404);
    }

    revalidatePath("/blog");
    if (post.slug) revalidatePath(`/blog/${post.slug}`);

    return jsonResponse({ post: mapRepositoryDoc(post.toObject()) });
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
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return jsonError("Blog post not found", 404);
    }

    revalidatePath("/blog");
    if (post.slug) revalidatePath(`/blog/${post.slug}`);

    return jsonResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
