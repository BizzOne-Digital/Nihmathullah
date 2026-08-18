import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { MediaItem } from "@/types";
import { MediaItemSchema } from "./schemas";

export interface ITestimonial extends Document {
  customerName: string;
  company?: string;
  role?: string;
  quote: string;
  image?: MediaItem;
  rating?: number;
  serviceId?: Types.ObjectId;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    quote: { type: String, required: true },
    image: { type: MediaItemSchema },
    rating: { type: Number, min: 1, max: 5 },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ published: 1, order: 1 });
TestimonialSchema.index({ featured: 1, published: 1 });
TestimonialSchema.index({ serviceId: 1, published: 1 });

export const Testimonial: Model<ITestimonial> =
  (mongoose.models.Testimonial as Model<ITestimonial>) ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
