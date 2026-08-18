import { Types } from "mongoose";
import connectDB from "@/lib/db/connect";
import {
  Inquiry,
  type IInquiry,
  type InquiryStatus,
  type InquiryType,
} from "@/models";
import { mapRepositoryDoc } from "./serialize";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreateInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  inquiryType: InquiryType;
  pickup?: string;
  destination?: string;
  preferredDateTime?: string;
  message: string;
  consent: boolean;
};

export type ListInquiriesOptions = {
  status?: InquiryStatus;
  inquiryType?: InquiryType;
  limit?: number;
  skip?: number;
};

export async function updateInquiry(
  id: string,
  data: Partial<{
    status: InquiryStatus;
    internalNotes: string;
  }>
): Promise<IInquiry> {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(id)) {
      throw new RepositoryError("Invalid inquiry id", "VALIDATION");
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      throw new RepositoryError("Inquiry not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(inquiry.toObject()) as IInquiry;
  } catch (error) {
    handleRepositoryError(error, "update inquiry");
  }
}

export async function createInquiry(
  data: CreateInquiryInput
): Promise<IInquiry> {
  try {
    await connectDB();
    const inquiry = await Inquiry.create({
      ...data,
      status: "New",
    });
    return mapRepositoryDoc(inquiry.toObject()) as IInquiry;
  } catch (error) {
    handleRepositoryError(error, "create inquiry");
  }
}

export async function listInquiries(
  options: ListInquiriesOptions = {}
): Promise<IInquiry[]> {
  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;
    if (options.inquiryType) filter.inquiryType = options.inquiryType;

    const query = Inquiry.find(filter).sort({ createdAt: -1 });

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    const inquiries = await query.lean();
    return mapRepositoryDoc(inquiries) as IInquiry[];
  } catch (error) {
    handleRepositoryError(error, "list inquiries");
  }
}
