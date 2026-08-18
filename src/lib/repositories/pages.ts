import connectDB from "@/lib/db/connect";
import { mapRepositoryDoc } from "./serialize";
import {
  sanitizePageHero,
  sanitizePageSections,
  sanitizeSeoFields,
} from "@/lib/media/sanitize";
import { Page, type IPage } from "@/models";
import type { PageHero, PageSection, SeoFields } from "@/types";
import { RepositoryError, handleRepositoryError } from "./errors";

export type UpdatePageInput = Partial<{
  title: string;
  hero: PageHero;
  sections: PageSection[];
  seo: SeoFields;
  published: boolean;
  order: number;
}>;

function sanitizePublicPage(page: IPage): IPage {
  return {
    ...page,
    hero: sanitizePageHero(page.hero),
    sections: sanitizePageSections(page.sections),
    seo: sanitizeSeoFields(page.seo),
  } as IPage;
}

export async function listAllPages(): Promise<IPage[]> {
  try {
    await connectDB();
    const pages = await Page.find().sort({ order: 1, title: 1 }).lean();
    return mapRepositoryDoc(pages) as IPage[];
  } catch (error) {
    handleRepositoryError(error, "list all pages");
  }
}

export async function getAdminPageBySlug(slug: string): Promise<IPage | null> {
  try {
    await connectDB();
    const page = await Page.findOne({ slug }).lean();
    return page ? (mapRepositoryDoc(page) as IPage) : null;
  } catch (error) {
    handleRepositoryError(error, "get admin page by slug");
  }
}

export async function getPageBySlug(slug: string): Promise<IPage | null> {
  try {
    await connectDB();
    let page = await Page.findOne({ slug, published: true }).lean();

    if (!page && process.env.NODE_ENV === "development") {
      page = await Page.findOne({ slug }).lean();
      if (page && !page.published) {
        console.warn(
          `[pages] "${slug}" is not published — showing draft in development only.`
        );
      }
    }

    return page ? sanitizePublicPage(mapRepositoryDoc(page) as IPage) : null;
  } catch (error) {
    handleRepositoryError(error, "get page by slug");
  }
}

export async function getPublishedPages(): Promise<IPage[]> {
  try {
    await connectDB();
    const pages = await Page.find({ published: true })
      .sort({ order: 1, title: 1 })
      .lean();
    return (mapRepositoryDoc(pages) as IPage[]).map(sanitizePublicPage);
  } catch (error) {
    handleRepositoryError(error, "get published pages");
  }
}

export async function updatePage(
  slug: string,
  data: UpdatePageInput
): Promise<IPage> {
  try {
    await connectDB();
    const page = await Page.findOneAndUpdate(
      { slug },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!page) {
      throw new RepositoryError(`Page not found: ${slug}`, "NOT_FOUND");
    }

    return mapRepositoryDoc(page.toObject()) as IPage;
  } catch (error) {
    handleRepositoryError(error, "update page");
  }
}
