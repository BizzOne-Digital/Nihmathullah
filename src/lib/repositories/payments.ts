import { Types } from "mongoose";
import connectDB from "@/lib/db/connect";
import {
  PaymentRecord,
  type IPaymentRecord,
  type PaymentStatus,
} from "@/models";
import { mapRepositoryDoc } from "./serialize";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreatePaymentRecordInput = {
  quoteId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status?: PaymentStatus;
  providerSessionId?: string;
  providerPaymentIntentId?: string;
};

export type UpdatePaymentStatusInput = {
  status: PaymentStatus;
  providerSessionId?: string;
  providerPaymentIntentId?: string;
  providerConfirmedAt?: Date;
};

export async function listPayments(
  options: { status?: PaymentStatus; limit?: number; skip?: number } = {}
): Promise<IPaymentRecord[]> {
  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;

    const query = PaymentRecord.find(filter).sort({ createdAt: -1 });
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    const payments = await query.lean();
    return mapRepositoryDoc(payments) as IPaymentRecord[];
  } catch (error) {
    handleRepositoryError(error, "list payments");
  }
}

export async function createPaymentRecord(
  data: CreatePaymentRecordInput
): Promise<IPaymentRecord> {
  try {
    await connectDB();

    if (
      !Types.ObjectId.isValid(data.quoteId) ||
      !Types.ObjectId.isValid(data.bookingId)
    ) {
      throw new RepositoryError("Invalid quote or booking id", "VALIDATION");
    }

    const payment = await PaymentRecord.create({
      quoteId: data.quoteId,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: data.currency,
      status: data.status ?? "Pending",
      providerSessionId: data.providerSessionId,
      providerPaymentIntentId: data.providerPaymentIntentId,
    });

    return mapRepositoryDoc(payment.toObject()) as IPaymentRecord;
  } catch (error) {
    handleRepositoryError(error, "create payment record");
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  data: UpdatePaymentStatusInput
): Promise<IPaymentRecord> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(paymentId)) {
      throw new RepositoryError("Invalid payment id", "VALIDATION");
    }

    const update: Record<string, unknown> = {
      status: data.status,
    };

    if (data.providerSessionId !== undefined) {
      update.providerSessionId = data.providerSessionId;
    }

    if (data.providerPaymentIntentId !== undefined) {
      update.providerPaymentIntentId = data.providerPaymentIntentId;
    }

    if (data.providerConfirmedAt !== undefined) {
      update.providerConfirmedAt = data.providerConfirmedAt;
    } else if (data.status === "Paid") {
      update.providerConfirmedAt = new Date();
    }

    const payment = await PaymentRecord.findByIdAndUpdate(
      paymentId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!payment) {
      throw new RepositoryError("Payment record not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(payment.toObject()) as IPaymentRecord;
  } catch (error) {
    handleRepositoryError(error, "update payment status");
  }
}

export async function getPaymentsByQuote(
  quoteId: string
): Promise<IPaymentRecord[]> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(quoteId)) {
      throw new RepositoryError("Invalid quote id", "VALIDATION");
    }

    const payments = await PaymentRecord.find({ quoteId })
      .sort({ createdAt: -1 })
      .lean();

    return mapRepositoryDoc(payments) as IPaymentRecord[];
  } catch (error) {
    handleRepositoryError(error, "get payments by quote");
  }
}

export async function getPaymentBySessionId(
  providerSessionId: string
): Promise<IPaymentRecord | null> {
  try {
    await connectDB();
    const payment = await PaymentRecord.findOne({ providerSessionId }).lean();
    return payment ? (mapRepositoryDoc(payment) as IPaymentRecord) : null;
  } catch (error) {
    handleRepositoryError(error, "get payment by session id");
  }
}
