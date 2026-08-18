import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { MediaItem, PageSection, SeoFields } from "@/types";
import {
  MediaItemSchema,
  PageSectionSchema,
  SeoFieldsSchema,
} from "./schemas";

export interface IServiceArea extends Document {
  city: string;
  slug: string;
  shortSummary: string;
  sections: PageSection[];
  relatedServices: Types.ObjectId[];
  image?: MediaItem;
  published: boolean;
  order: number;
  seo?: SeoFields;
  allowIndexing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceAreaSchema = new Schema<IServiceArea>(
  {
    city: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortSummary: { type: String, required: true },
    sections: { type: [PageSectionSchema], default: [] },
    relatedServices: {
      type: [{ type: Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    image: { type: MediaItemSchema },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: { type: SeoFieldsSchema },
    allowIndexing: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceAreaSchema.index({ slug: 1 }, { unique: true });
ServiceAreaSchema.index({ published: 1, order: 1 });
ServiceAreaSchema.index({ allowIndexing: 1, published: 1 });

export const ServiceArea: Model<IServiceArea> =
  (mongoose.models.ServiceArea as Model<IServiceArea>) ||
  mongoose.model<IServiceArea>("ServiceArea", ServiceAreaSchema);
