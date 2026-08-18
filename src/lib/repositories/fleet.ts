import connectDB from "@/lib/db/connect";
import { sanitizeMediaItem, sanitizeMediaList } from "@/lib/media/sanitize";
import { mapRepositoryDoc } from "./serialize";
import { Vehicle, type IVehicle } from "@/models";
import { handleRepositoryError } from "./errors";
import { isDatabaseUnavailable } from "./readiness";

function sanitizePublicVehicle(vehicle: IVehicle): IVehicle {
  return {
    ...vehicle,
    primaryImage: sanitizeMediaItem(vehicle.primaryImage),
    gallery: sanitizeMediaList(vehicle.gallery),
  } as IVehicle;
}

export async function getPublishedVehicles(): Promise<IVehicle[]> {
  if (isDatabaseUnavailable()) {
    return [];
  }
  try {
    await connectDB();
    const vehicles = await Vehicle.find({ published: true })
      .sort({ order: 1, displayName: 1 })
      .lean();
    return (mapRepositoryDoc(vehicles) as IVehicle[]).map(sanitizePublicVehicle);  } catch (error) {
    handleRepositoryError(error, "get published vehicles");
  }
}
