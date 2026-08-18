import connectDB from "@/lib/db/connect";
import { mapRepositoryDoc } from "./serialize";
import {
  PricingSettings,
  getOrCreatePricingSettings,
  type IPricingSettings,
} from "@/models";
import type { PricingSettingsData } from "@/types";
import { handleRepositoryError } from "./errors";
import { isDatabaseUnavailable } from "./readiness";

export async function getPricingSettings(): Promise<IPricingSettings | null> {
  if (isDatabaseUnavailable()) {
    return null;
  }
  try {
    await connectDB();
    const settings = await getOrCreatePricingSettings();
    return mapRepositoryDoc(settings.toObject()) as IPricingSettings;
  } catch (error) {
    handleRepositoryError(error, "get pricing settings");
  }
}

export async function updatePricingSettings(
  data: Partial<PricingSettingsData>
): Promise<IPricingSettings> {
  try {
    await connectDB();
    const settings = await PricingSettings.findOneAndUpdate(
      { singletonKey: "singleton" },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    if (!settings) {
      throw new Error("Pricing settings not found after update");
    }

    return mapRepositoryDoc(settings.toObject()) as IPricingSettings;
  } catch (error) {
    handleRepositoryError(error, "update pricing settings");
  }
}
