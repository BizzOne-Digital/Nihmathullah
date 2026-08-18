import connectDB from "@/lib/db/connect";
import { mapRepositoryDoc } from "./serialize";
import {
  sanitizeServiceDetailPage,
  sanitizeServiceListing,
} from "@/lib/media/sanitize";
import { Service, type IService } from "@/models";
import type { ServiceDetailPage, ServiceListing } from "@/types";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreateServiceInput = {
  listing: ServiceListing;
  detailPage?: ServiceDetailPage;
};

export type UpdateServiceInput = Partial<{
  listing: Partial<ServiceListing>;
  detailPage: Partial<ServiceDetailPage>;
  archived: boolean;
}>;

function sanitizePublicService(service: IService): IService {
  return {
    ...service,
    listing: sanitizeServiceListing(service.listing),
    detailPage: service.detailPage
      ? sanitizeServiceDetailPage(service.detailPage)
      : service.detailPage,
  } as IService;
}

export async function listAllServices(): Promise<IService[]> {
  try {
    await connectDB();
    const services = await Service.find()
      .sort({ "listing.order": 1, "listing.title": 1 })
      .lean();
    return mapRepositoryDoc(services) as IService[];
  } catch (error) {
    handleRepositoryError(error, "list all services");
  }
}

export async function getServiceById(id: string): Promise<IService | null> {
  try {
    await connectDB();
    const { Types } = await import("mongoose");
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const service = await Service.findById(id).lean();
    return service ? (mapRepositoryDoc(service) as IService) : null;
  } catch (error) {
    handleRepositoryError(error, "get service by id");
  }
}

export async function getPublishedServices(): Promise<IService[]> {
  try {
    await connectDB();
    const services = await Service.find({
      archived: false,
      "listing.published": true,
    })
      .sort({ "listing.order": 1, "listing.title": 1 })
      .lean();
    return (mapRepositoryDoc(services) as IService[]).map(sanitizePublicService);
  } catch (error) {
    handleRepositoryError(error, "get published services");
  }
}

export async function getServiceBySlug(slug: string): Promise<IService | null> {
  try {
    await connectDB();
    const service = await Service.findOne({
      archived: false,
      "listing.slug": slug,
      "listing.published": true,
    }).lean();

    return service
      ? sanitizePublicService(mapRepositoryDoc(service) as IService)
      : null;
  } catch (error) {
    handleRepositoryError(error, "get service by slug");
  }
}

export async function createService(data: CreateServiceInput): Promise<IService> {
  try {
    await connectDB();
    const service = await Service.create({
      listing: data.listing,
      detailPage: data.detailPage ?? { sections: [] },
      archived: false,
    });
    return mapRepositoryDoc(service.toObject()) as IService;
  } catch (error) {
    handleRepositoryError(error, "create service");
  }
}

export async function updateServiceById(
  id: string,
  data: UpdateServiceInput
): Promise<IService> {
  try {
    await connectDB();
    const { Types } = await import("mongoose");
    if (!Types.ObjectId.isValid(id)) {
      throw new RepositoryError("Invalid service id", "VALIDATION");
    }

    const update: Record<string, unknown> = {};

    if (data.listing) {
      for (const [key, value] of Object.entries(data.listing)) {
        update[`listing.${key}`] = value;
      }
    }

    if (data.detailPage) {
      for (const [key, value] of Object.entries(data.detailPage)) {
        update[`detailPage.${key}`] = value;
      }
    }

    if (data.archived !== undefined) {
      update.archived = data.archived;
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new RepositoryError("Service not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(service.toObject()) as IService;
  } catch (error) {
    handleRepositoryError(error, "update service by id");
  }
}

export async function deleteServiceById(id: string): Promise<IService> {
  try {
    await connectDB();
    const { Types } = await import("mongoose");
    if (!Types.ObjectId.isValid(id)) {
      throw new RepositoryError("Invalid service id", "VALIDATION");
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { archived: true, "listing.published": false } },
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new RepositoryError("Service not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(service.toObject()) as IService;
  } catch (error) {
    handleRepositoryError(error, "delete service by id");
  }
}

export async function updateService(
  slug: string,
  data: UpdateServiceInput
): Promise<IService> {
  try {
    await connectDB();
    const update: Record<string, unknown> = {};

    if (data.listing) {
      for (const [key, value] of Object.entries(data.listing)) {
        update[`listing.${key}`] = value;
      }
    }

    if (data.detailPage) {
      for (const [key, value] of Object.entries(data.detailPage)) {
        update[`detailPage.${key}`] = value;
      }
    }

    if (data.archived !== undefined) {
      update.archived = data.archived;
    }

    const service = await Service.findOneAndUpdate(
      { "listing.slug": slug },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new RepositoryError(`Service not found: ${slug}`, "NOT_FOUND");
    }

    return mapRepositoryDoc(service.toObject()) as IService;
  } catch (error) {
    handleRepositoryError(error, "update service");
  }
}

export async function deleteService(slug: string): Promise<IService> {
  try {
    await connectDB();
    const service = await Service.findOneAndUpdate(
      { "listing.slug": slug },
      { $set: { archived: true, "listing.published": false } },
      { new: true, runValidators: true }
    );

    if (!service) {
      throw new RepositoryError(`Service not found: ${slug}`, "NOT_FOUND");
    }

    return mapRepositoryDoc(service.toObject()) as IService;
  } catch (error) {
    handleRepositoryError(error, "delete service");
  }
}
