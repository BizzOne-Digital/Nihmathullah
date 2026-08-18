import mongoose, { Document, Model, Schema } from "mongoose";

export const INQUIRY_STATUSES = [
  "New",
  "Read",
  "In Progress",
  "Responded",
  "Archived",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_TYPES = [
  "general",
  "quote",
  "booking",
  "corporate",
  "feedback",
  "other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  inquiryType: InquiryType;
  pickup?: string;
  destination?: string;
  preferredDateTime?: string;
  message: string;
  status: InquiryStatus;
  internalNotes?: string;
  consent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    inquiryType: {
      type: String,
      required: true,
      enum: INQUIRY_TYPES,
      default: "general",
    },
    pickup: { type: String },
    destination: { type: String },
    preferredDateTime: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: INQUIRY_STATUSES,
      default: "New",
    },
    internalNotes: { type: String },
    consent: { type: Boolean, required: true },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ inquiryType: 1, status: 1 });
InquirySchema.index({ email: 1 });
InquirySchema.index({ createdAt: -1 });

export const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) ||
  mongoose.model<IInquiry>("Inquiry", InquirySchema);
