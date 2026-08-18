import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GalleryCategorySchema.index({ slug: 1 }, { unique: true });
GalleryCategorySchema.index({ published: 1, order: 1 });

export const GalleryCategory: Model<IGalleryCategory> =
  (mongoose.models.GalleryCategory as Model<IGalleryCategory>) ||
  mongoose.model<IGalleryCategory>("GalleryCategory", GalleryCategorySchema);
