import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { QUOTE_STATUSES } from "@/lib/constants";
import type { QuoteLineItem } from "@/types";
import { QuoteLineItemSchema } from "./schemas";

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export interface IQuote extends Document {
  reference: string;
  bookingId: Types.ObjectId;
  tokenHash: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  total: number;
  depositAmount: number;
  customerNotes?: string;
  internalNotes?: string;
  status: QuoteStatus;
  expiresAt: Date;
  acceptedAt?: Date;
  viewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "BookingRequest",
      required: true,
    },
    tokenHash: { type: String, required: true },
    lineItems: { type: [QuoteLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    feeAmount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    depositAmount: { type: Number, required: true, default: 0 },
    customerNotes: { type: String },
    internalNotes: { type: String },
    status: {
      type: String,
      required: true,
      enum: QUOTE_STATUSES,
      default: "Draft",
    },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    viewedAt: { type: Date },
  },
  { timestamps: true }
);

QuoteSchema.index({ reference: 1 }, { unique: true });
QuoteSchema.index({ tokenHash: 1 });
QuoteSchema.index({ bookingId: 1, status: 1 });
QuoteSchema.index({ status: 1, expiresAt: 1 });
QuoteSchema.index({ createdAt: -1 });

export const Quote: Model<IQuote> =
  (mongoose.models.Quote as Model<IQuote>) ||
  mongoose.model<IQuote>("Quote", QuoteSchema);
