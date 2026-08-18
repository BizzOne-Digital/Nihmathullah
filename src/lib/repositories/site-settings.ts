import connectDB from "@/lib/db/connect";
import { mapRepositoryDoc } from "./serialize";
import {
  SiteSettings,
  getOrCreateSiteSettings,
  type ISiteSettings,
} from "@/models";
import type { SiteSettingsData } from "@/types";
import { handleRepositoryError } from "./errors";
import { isDatabaseUnavailable } from "./readiness";

export async function getSiteSettings(): Promise<ISiteSettings | null> {
  if (isDatabaseUnavailable()) {
    return null;
  }
  try {
    await connectDB();
    const settings = await getOrCreateSiteSettings();
    return mapRepositoryDoc(settings) as ISiteSettings;
  } catch (error) {
    handleRepositoryError(error, "get site settings");
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettingsData>
): Promise<ISiteSettings> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOneAndUpdate(
      { singletonKey: "singleton" },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    if (!settings) {
      throw new Error("Site settings not found after update");
    }

    return mapRepositoryDoc(settings) as ISiteSettings;
  } catch (error) {
    handleRepositoryError(error, "update site settings");
  }
}
