import mongoose, { Document, Model, Schema } from "mongoose";
import type { BlogContentBlock, MediaItem, SeoFields } from "@/types";
import {
  BlogContentBlockSchema,
  MediaItemSchema,
  SeoFieldsSchema,
} from "./schemas";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  contentBlocks: BlogContentBlock[];
  featuredImage?: MediaItem;
  category?: string;
  tags?: string[];
  authorDisplay?: string;
  publishDate?: Date;
  draft: boolean;
  published: boolean;
  featured: boolean;
  seo?: SeoFields;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    contentBlocks: { type: [BlogContentBlockSchema], default: [] },
    featuredImage: { type: MediaItemSchema },
    category: { type: String, trim: true },
    tags: { type: [String], default: undefined },
    authorDisplay: { type: String, trim: true },
    publishDate: { type: Date },
    draft: { type: Boolean, default: true },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    seo: { type: SeoFieldsSchema },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ published: 1, publishDate: -1 });
BlogPostSchema.index({ featured: 1, published: 1 });
BlogPostSchema.index({ draft: 1 });
BlogPostSchema.index({ category: 1, published: 1 });

export const BlogPost: Model<IBlogPost> =
  (mongoose.models.BlogPost as Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
