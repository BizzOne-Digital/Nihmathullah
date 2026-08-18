import mongoose, { Document, Model, Schema } from "mongoose";
import type { SiteSettingsData } from "@/types";

export interface ISiteSettings extends Document, SiteSettingsData {
  singletonKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const FooterNavSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const HeaderCtasSchema = new Schema(
  {
    callLabel: { type: String, required: true },
    quoteLabel: { type: String, required: true },
    bookLabel: { type: String, required: true },
  },
  { _id: false }
);

const OperationalClaimsSchema = new Schema(
  {
    availability247: { type: Boolean },
    flightMonitoring: { type: Boolean },
    meetAndGreet: { type: Boolean },
    licensedInsured: { type: Boolean },
    licensedInsuredText: { type: String },
    yearsInBusiness: { type: Number, min: 0 },
    chauffeurTraining: { type: Boolean },
    chauffeurTrainingText: { type: String },
  },
  { _id: false }
);

const AirportSchema = new Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "singleton",
      immutable: true,
    },
    businessName: {
      type: String,
      required: true,
      default: "SierraLink Executive Transportation LLC",
    },
    shortName: { type: String, required: true, default: "SierraLink" },
    headline: { type: String, required: true },
    primaryEmail: { type: String, required: true, lowercase: true },
    primaryPhoneDisplay: { type: String, required: true },
    primaryPhoneLink: { type: String, required: true },
    alternatePhoneDisplay: { type: String },
    alternatePhoneLink: { type: String },
    serviceAreaText: { type: String, required: true },
    aboutStatement: { type: String, required: true },
    publicPricingStatement: { type: String, required: true },
    logoUrl: { type: String, required: true },
    faviconUrl: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    geoLat: { type: Number },
    geoLng: { type: Number },
    businessHours: { type: String },
    socialLinks: { type: [SocialLinkSchema], default: undefined },
    headerCtas: { type: HeaderCtasSchema },
    footerCopy: { type: String },
    footerNav: { type: [FooterNavSchema], default: undefined },
    operationalClaims: { type: OperationalClaimsSchema },
    airports: { type: [AirportSchema], default: undefined },
    bookingConfirmationText: { type: String },
    introAnimationEnabled: { type: Boolean, default: true },
    analyticsId: { type: String },
    analyticsConsentRequired: { type: Boolean, default: false },
    copyrightText: { type: String },
  },
  { timestamps: true }
);

SiteSettingsSchema.index({ singletonKey: 1 }, { unique: true });

export const SiteSettings: Model<ISiteSettings> =
  (mongoose.models.SiteSettings as Model<ISiteSettings>) ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export async function getSiteSettings(): Promise<ISiteSettings | null> {
  return SiteSettings.findOne({ singletonKey: "singleton" });
}

export async function getOrCreateSiteSettings(): Promise<ISiteSettings> {
  let settings = await getSiteSettings();
  if (!settings) {
    settings = await SiteSettings.create({
      singletonKey: "singleton",
      headline:
        "Reliable Airport, Executive, Local & Long-Distance Transportation in Albany & the Capital Region",
      primaryEmail: "info@sierralinkexecutivetransportation.com",
      primaryPhoneDisplay: "(518) 290-0675",
      primaryPhoneLink: "tel:+15182900675",
      serviceAreaText:
        "Saratoga Springs, Clifton Park, Latham, Albany, Schenectady, and surrounding Capital Region areas",
      aboutStatement:
        "SierraLink Executive Transportation LLC provides professional, reliable, and comfortable private transportation throughout Albany and the Capital Region.",
      publicPricingStatement:
        "Pricing is provided by quote. Please call, request a quote, or book online for pricing.",
      logoUrl: "/uploads/settings/sierralink-logo.png",
    });
  }
  return settings;
}
