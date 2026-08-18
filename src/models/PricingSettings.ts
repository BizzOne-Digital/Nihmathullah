import mongoose, { Document, Model, Schema } from "mongoose";
import type { PricingSettingsData } from "@/types";

export interface IPricingSettings extends Document, PricingSettingsData {
  singletonKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const PricingSettingsSchema = new Schema<IPricingSettings>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "singleton",
      immutable: true,
    },
    publicPricingStatement: {
      type: String,
      required: true,
      default:
        "Pricing is provided by quote. Please call, request a quote, or book online for pricing.",
    },
    showPublicPricing: { type: Boolean, default: false },
    currency: { type: String, required: true, default: "USD", uppercase: true },
    taxLabel: { type: String },
    taxRate: { type: Number, min: 0 },
    feeLabel: { type: String },
    feeRate: { type: Number, min: 0 },
    defaultQuoteExpirationDays: { type: Number, required: true, default: 7, min: 1 },
    depositMode: {
      type: String,
      required: true,
      enum: ["none", "fixed", "percentage", "full"],
      default: "none",
    },
    depositFixedAmount: { type: Number, min: 0 },
    depositPercentage: { type: Number, min: 0, max: 100 },
    paymentEnabled: { type: Boolean, default: false },
    cancellationPolicy: { type: String },
    cancellationPolicyPublished: { type: Boolean, default: false },
    refundPolicy: { type: String },
    refundPolicyPublished: { type: Boolean, default: false },
    specialOffersEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PricingSettingsSchema.index({ singletonKey: 1 }, { unique: true });

export const PricingSettings: Model<IPricingSettings> =
  (mongoose.models.PricingSettings as Model<IPricingSettings>) ||
  mongoose.model<IPricingSettings>("PricingSettings", PricingSettingsSchema);

export async function getPricingSettings(): Promise<IPricingSettings | null> {
  return PricingSettings.findOne({ singletonKey: "singleton" });
}

export async function getOrCreatePricingSettings(): Promise<IPricingSettings> {
  let settings = await getPricingSettings();
  if (!settings) {
    settings = await PricingSettings.create({ singletonKey: "singleton" });
  }
  return settings;
}
