import connectDB from "@/lib/db/connect";
import {
  sanitizeMediaItem,
  sanitizePageSections,
  sanitizeSeoFields,
} from "@/lib/media/sanitize";
import { mapRepositoryDoc } from "./serialize";
import { ServiceArea, type IServiceArea } from "@/models";
import { handleRepositoryError } from "./errors";

function sanitizePublicServiceArea(area: IServiceArea): IServiceArea {
  return {
    ...area,
    image: sanitizeMediaItem(area.image),
    sections: sanitizePageSections(area.sections ?? []),
    seo: sanitizeSeoFields(area.seo),
  } as IServiceArea;
}

export async function getPublishedServiceAreas(): Promise<IServiceArea[]> {
  try {
    await connectDB();
    const areas = await ServiceArea.find({ published: true })
      .sort({ order: 1, city: 1 })
      .lean();
    return (mapRepositoryDoc(areas) as IServiceArea[]).map(sanitizePublicServiceArea);
  } catch (error) {
    handleRepositoryError(error, "get published service areas");
  }
}

export async function getServiceAreaBySlug(
  slug: string
): Promise<IServiceArea | null> {
  try {
    await connectDB();
    const area = await ServiceArea.findOne({ slug, published: true }).lean();
    return area
      ? sanitizePublicServiceArea(mapRepositoryDoc(area) as IServiceArea)
      : null;
  } catch (error) {
    handleRepositoryError(error, "get service area by slug");
  }
}
