import mongoose, { Document, Model, Schema } from "mongoose";
import type { ServiceListing, ServiceDetailPage } from "@/types";
import {
  CtaLinkSchema,
  MediaItemSchema,
  PageHeroSchema,
  SeoFieldsSchema,
  ServiceDetailSectionSchema,
} from "./schemas";

const ServiceListingSchema = new Schema<ServiceListing>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    mainImage: { type: MediaItemSchema },
    icon: { type: String },
    features: { type: [String], default: undefined },
    cta: { type: CtaLinkSchema },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: { type: SeoFieldsSchema },
  },
  { _id: false }
);

const ServiceDetailPageSchema = new Schema<ServiceDetailPage>(
  {
    hero: { type: PageHeroSchema },
    sections: { type: [ServiceDetailSectionSchema], default: [] },
    relatedServiceAreas: { type: [String], default: undefined },
    relatedFleetIds: { type: [String], default: undefined },
    relatedFaqIds: { type: [String], default: undefined },
    seo: { type: SeoFieldsSchema },
  },
  { _id: false }
);

export interface IService extends Document {
  listing: ServiceListing;
  detailPage: ServiceDetailPage;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    listing: { type: ServiceListingSchema, required: true },
    detailPage: { type: ServiceDetailPageSchema, default: () => ({ sections: [] }) },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ServiceSchema.index({ "listing.slug": 1 }, { unique: true });
ServiceSchema.index({ "listing.published": 1, "listing.order": 1 });
ServiceSchema.index({ archived: 1 });

export const Service: Model<IService> =
  (mongoose.models.Service as Model<IService>) ||
  mongoose.model<IService>("Service", ServiceSchema);
