import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IGalleryImage extends Document {
  title?: string;
  caption?: string;
  alt: string;
  url: string;
  categoryId: Types.ObjectId;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    title: { type: String, trim: true },
    caption: { type: String },
    alt: { type: String, required: true },
    url: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: true,
    },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryImageSchema.index({ categoryId: 1, published: 1, order: 1 });
GalleryImageSchema.index({ featured: 1, published: 1 });
GalleryImageSchema.index({ published: 1, order: 1 });

export const GalleryImage: Model<IGalleryImage> =
  (mongoose.models.GalleryImage as Model<IGalleryImage>) ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
