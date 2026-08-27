import mongoose, { Document, Model, Schema } from "mongoose";
import type { StoredUploadFolder } from "@/lib/constants";

export interface IStoredUpload extends Document {
  folder: StoredUploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      required: true,
      enum: ["products", "gallery", "pages", "misc"],
    },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export const StoredUpload: Model<IStoredUpload> =
  (mongoose.models.StoredUpload as Model<IStoredUpload>) ||
  mongoose.model<IStoredUpload>("StoredUpload", StoredUploadSchema);
