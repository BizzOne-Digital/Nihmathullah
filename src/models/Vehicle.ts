import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { MediaItem } from "@/types";
import { MediaItemSchema } from "./schemas";

export type VehicleCategory =
  | "sedan"
  | "suv"
  | "van"
  | "sprinter"
  | "luxury"
  | "other";

export interface IVehicle extends Omit<Document, "model"> {
  displayName: string;
  make?: string;
  model?: string;
  year?: number;
  category: VehicleCategory;
  passengerCapacity?: number;
  luggageGuidance?: string;
  amenities?: string[];
  primaryImage?: MediaItem;
  gallery?: MediaItem[];
  relatedServices: Types.ObjectId[];
  published: boolean;
  order: number;
  isIllustrative: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    displayName: { type: String, required: true, trim: true },
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    year: { type: Number, min: 1900, max: 2100 },
    category: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "van", "sprinter", "luxury", "other"],
      default: "sedan",
    },
    passengerCapacity: { type: Number, min: 1 },
    luggageGuidance: { type: String },
    amenities: { type: [String], default: undefined },
    primaryImage: { type: MediaItemSchema },
    gallery: { type: [MediaItemSchema], default: undefined },
    relatedServices: {
      type: [{ type: Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isIllustrative: { type: Boolean, default: true },
  },
  { timestamps: true }
);

VehicleSchema.index({ published: 1, order: 1 });
VehicleSchema.index({ category: 1, published: 1 });
VehicleSchema.index({ isIllustrative: 1 });

export const Vehicle: Model<IVehicle> =
  (mongoose.models.Vehicle as Model<IVehicle>) ||
  mongoose.model<IVehicle>("Vehicle", VehicleSchema);
