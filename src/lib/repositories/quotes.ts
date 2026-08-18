import { Types } from "mongoose";
import connectDB from "@/lib/db/connect";
import { hashToken } from "@/lib/auth/tokens";
import { generateQuoteReference } from "@/lib/utils";
import { Quote, type IQuote, type QuoteStatus } from "@/models";
import { mapRepositoryDoc } from "./serialize";
import type { QuoteLineItem } from "@/types";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreateQuoteInput = {
  bookingId: string;
  token: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  total: number;
  depositAmount: number;
  customerNotes?: string;
  internalNotes?: string;
  status?: QuoteStatus;
  expiresAt: Date;
};

const PAYABLE_QUOTE_STATUSES: QuoteStatus[] = [
  "Sent/Shared",
  "Viewed",
  "Accepted",
];

export async function listQuotes(
  options: { status?: QuoteStatus; limit?: number; skip?: number } = {}
): Promise<IQuote[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;

    const query = Quote.find(filter).sort({ createdAt: -1 });
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    const quotes = await query.lean();
    return mapRepositoryDoc(quotes) as IQuote[];
  } catch (error) {
    handleRepositoryError(error, "list quotes");
  }
}

export async function getQuoteById(quoteId: string): Promise<IQuote | null> {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(quoteId)) {
      return null;
    }
    const quote = await Quote.findById(quoteId).lean();
    return quote ? (mapRepositoryDoc(quote) as IQuote) : null;
  } catch (error) {
    handleRepositoryError(error, "get quote by id");
  }
}

export type UpdateQuoteInput = Partial<{
  status: QuoteStatus;
  customerNotes: string;
  internalNotes: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  total: number;
  depositAmount: number;
  expiresAt: Date;
}>;

export async function updateQuote(
  quoteId: string,
  data: UpdateQuoteInput
): Promise<IQuote> {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(quoteId)) {
      throw new RepositoryError("Invalid quote id", "VALIDATION");
    }

    const quote = await Quote.findByIdAndUpdate(
      quoteId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!quote) {
      throw new RepositoryError("Quote not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(quote.toObject()) as IQuote;
  } catch (error) {
    handleRepositoryError(error, "update quote");
  }
}

export async function createQuote(data: CreateQuoteInput): Promise<IQuote> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(data.bookingId)) {
      throw new RepositoryError("Invalid booking id", "VALIDATION");
    }

    const quote = await Quote.create({
      reference: generateQuoteReference(),
      bookingId: data.bookingId,
      tokenHash: hashToken(data.token),
      lineItems: data.lineItems,
      subtotal: data.subtotal,
      taxAmount: data.taxAmount,
      feeAmount: data.feeAmount,
      total: data.total,
      depositAmount: data.depositAmount,
      customerNotes: data.customerNotes,
      internalNotes: data.internalNotes,
      status: data.status ?? "Draft",
      expiresAt: data.expiresAt,
    });

    return mapRepositoryDoc(quote.toObject()) as IQuote;
  } catch (error) {
    handleRepositoryError(error, "create quote");
  }
}

export async function getQuoteByToken(
  token: string
): Promise<IQuote | null> {
  try {
    await connectDB();
    const quote = await Quote.findOne({ tokenHash: hashToken(token) }).lean();
    return quote ? (mapRepositoryDoc(quote) as IQuote) : null;
  } catch (error) {
    handleRepositoryError(error, "get quote by token");
  }
}

export async function revokeQuote(quoteId: string): Promise<IQuote> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(quoteId)) {
      throw new RepositoryError("Invalid quote id", "VALIDATION");
    }

    const quote = await Quote.findByIdAndUpdate(
      quoteId,
      { $set: { status: "Cancelled" } },
      { new: true, runValidators: true }
    );

    if (!quote) {
      throw new RepositoryError("Quote not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(quote.toObject()) as IQuote;
  } catch (error) {
    handleRepositoryError(error, "revoke quote");
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus
): Promise<IQuote> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(quoteId)) {
      throw new RepositoryError("Invalid quote id", "VALIDATION");
    }

    const update: Record<string, unknown> = { status };

    if (status === "Viewed") {
      update.viewedAt = new Date();
    }

    if (status === "Accepted") {
      update.acceptedAt = new Date();
    }

    const quote = await Quote.findByIdAndUpdate(
      quoteId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!quote) {
      throw new RepositoryError("Quote not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(quote.toObject()) as IQuote;
  } catch (error) {
    handleRepositoryError(error, "update quote status");
  }
}

export function isQuotePayable(quote: Pick<IQuote, "status" | "expiresAt">): boolean {
  if (!PAYABLE_QUOTE_STATUSES.includes(quote.status)) {
    return false;
  }

  return quote.expiresAt.getTime() > Date.now();
}

export { PAYABLE_QUOTE_STATUSES };
