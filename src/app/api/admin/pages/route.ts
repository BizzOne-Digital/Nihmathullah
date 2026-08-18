import { revalidatePath } from "next/cache";
import { listAllPages, updatePage } from "@/lib/repositories/pages";
import type { PageSection } from "@/types";
import { pageUpdateSchema } from "@/lib/validation/admin";
import { isAuthResponse, requireApiAdmin } from "@/lib/api/auth";
import {
  handleApiError,
  jsonResponse,
  zodErrorResponse,
} from "@/lib/api/response";

export async function GET() {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const pages = await listAllPages();
    return jsonResponse({ pages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin();
  if (isAuthResponse(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = pageUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return zodErrorResponse(parsed.error);
    }

    const data = parsed.data;
    const page = await updatePage(data.slug, {
      title: data.title,
      hero: data.hero,
      sections: data.sections as PageSection[],
      seo: data.seo,
      published: data.published,
      order: data.order,
    });

    revalidatePath(`/${data.slug === "home" ? "" : data.slug}`);
    revalidatePath("/");

    return jsonResponse({ page });
  } catch (error) {
    return handleApiError(error);
  }
}
