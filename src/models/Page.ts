import mongoose, { Document, Model, Schema } from "mongoose";
import type { PageHero, PageSection, SeoFields } from "@/types";
import {
  PageHeroSchema,
  PageSectionSchema,
  SeoFieldsSchema,
} from "./schemas";

export interface IPage extends Document {
  slug: string;
  title: string;
  hero?: PageHero;
  sections: PageSection[];
  seo?: SeoFields;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    hero: { type: PageHeroSchema },
    sections: { type: [PageSectionSchema], default: [] },
    seo: { type: SeoFieldsSchema },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PageSchema.index({ slug: 1 }, { unique: true });
PageSchema.index({ published: 1, order: 1 });

export const Page: Model<IPage> =
  (mongoose.models.Page as Model<IPage>) ||
  mongoose.model<IPage>("Page", PageSchema);
