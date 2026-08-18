import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { FAQ_CATEGORIES } from "@/lib/constants";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  relatedServiceIds: Types.ObjectId[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: FAQ_CATEGORIES,
    },
    relatedServiceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

FAQSchema.index({ category: 1, published: 1, order: 1 });
FAQSchema.index({ published: 1, order: 1 });

export const FAQ: Model<IFAQ> =
  (mongoose.models.FAQ as Model<IFAQ>) ||
  mongoose.model<IFAQ>("FAQ", FAQSchema);
