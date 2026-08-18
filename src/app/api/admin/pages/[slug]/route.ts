import { revalidatePath } from "next/cache";
import { getAdminPageBySlug, updatePage } from "@/lib/repositories/pages";
import type { PageSection } from "@/types";
import { pageUpdateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { slug } = await params;
    const page = await getAdminPageBySlug(slug);

    if (!page) {
      return jsonError("Page not found", 404);
    }

    return jsonResponse({ page });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = pageUpdateSchema.safeParse({ ...body, slug });

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const page = await updatePage(slug, {
      title: data.title,
      hero: data.hero,
      sections: data.sections as PageSection[],
      seo: data.seo,
      published: data.published,
      order: data.order,
    });

    revalidatePath(`/${slug === "home" ? "" : slug}`);
    revalidatePath("/");

    return jsonResponse({ page });
  } catch (error) {
    return handleApiError(error);
  }
}
