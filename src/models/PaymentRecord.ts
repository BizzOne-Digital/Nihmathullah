import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { PAYMENT_STATUSES } from "@/lib/constants";

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface IPaymentRecord extends Document {
  quoteId: Types.ObjectId;
  bookingId: Types.ObjectId;
  providerSessionId?: string;
  providerPaymentIntentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  providerConfirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    quoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "BookingRequest",
      required: true,
    },
    providerSessionId: { type: String },
    providerPaymentIntentId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "USD", uppercase: true },
    status: {
      type: String,
      required: true,
      enum: PAYMENT_STATUSES,
      default: "Not Requested",
    },
    providerConfirmedAt: { type: Date },
  },
  { timestamps: true }
);

PaymentRecordSchema.index({ quoteId: 1 });
PaymentRecordSchema.index({ bookingId: 1 });
PaymentRecordSchema.index({ providerSessionId: 1 });
PaymentRecordSchema.index({ providerPaymentIntentId: 1 });
PaymentRecordSchema.index({ status: 1, createdAt: -1 });
PaymentRecordSchema.index({ createdAt: -1 });

export const PaymentRecord: Model<IPaymentRecord> =
  (mongoose.models.PaymentRecord as Model<IPaymentRecord>) ||
  mongoose.model<IPaymentRecord>("PaymentRecord", PaymentRecordSchema);
