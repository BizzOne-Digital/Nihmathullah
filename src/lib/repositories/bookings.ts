import { Types } from "mongoose";
import connectDB from "@/lib/db/connect";
import { generateBookingReference } from "@/lib/utils";
import { mapRepositoryDoc } from "./serialize";
import {
  BookingRequest,
  type BookingMode,
  type BookingStatus,
  type IBookingAuditEntry,
  type IBookingRequest,
  type IBookingTripDetails,
} from "@/models";
import { RepositoryError, handleRepositoryError } from "./errors";

export type CreateBookingInput = {
  mode: BookingMode;
  tripDetails: IBookingTripDetails;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
};

export type UpdateBookingInput = Partial<{
  status: BookingStatus;
  tripDetails: Partial<IBookingTripDetails>;
  internalNotes: string;
  assignedVehicle: string;
  assignedDriver: string;
  auditEntry: IBookingAuditEntry;
}>;

export type ListBookingsOptions = {
  status?: BookingStatus;
  mode?: BookingMode;
  limit?: number;
  skip?: number;
};

export async function createBooking(
  data: CreateBookingInput
): Promise<IBookingRequest> {
  try {
    await connectDB();

    const booking = await BookingRequest.create({
      reference: generateBookingReference(),
      mode: data.mode,
      status: "New",
      tripDetails: data.tripDetails,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      referrer: data.referrer,
      auditLog: [
        {
          action: "created",
          timestamp: new Date(),
          note: `Booking created via ${data.mode} form`,
        },
      ],
    });

    return mapRepositoryDoc(booking.toObject()) as IBookingRequest;
  } catch (error) {
    handleRepositoryError(error, "create booking");
  }
}

export async function getBookingById(
  id: string
): Promise<IBookingRequest | null> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const booking = await BookingRequest.findById(id).lean();
    return booking ? (mapRepositoryDoc(booking) as IBookingRequest) : null;
  } catch (error) {
    handleRepositoryError(error, "get booking by id");
  }
}

export async function getBookingByReference(
  reference: string
): Promise<IBookingRequest | null> {
  try {
    await connectDB();
    const booking = await BookingRequest.findOne({
      reference: reference.trim(),
    }).lean();
    return booking ? (mapRepositoryDoc(booking) as IBookingRequest) : null;
  } catch (error) {
    handleRepositoryError(error, "get booking by reference");
  }
}

export async function updateBooking(
  id: string,
  data: UpdateBookingInput
): Promise<IBookingRequest> {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new RepositoryError("Invalid booking id", "VALIDATION");
    }

    const update: Record<string, unknown> = {};

    if (data.status !== undefined) update.status = data.status;
    if (data.internalNotes !== undefined) {
      update.internalNotes = data.internalNotes;
    }
    if (data.assignedVehicle !== undefined) {
      update.assignedVehicle = data.assignedVehicle;
    }
    if (data.assignedDriver !== undefined) {
      update.assignedDriver = data.assignedDriver;
    }

    if (data.tripDetails) {
      for (const [key, value] of Object.entries(data.tripDetails)) {
        update[`tripDetails.${key}`] = value;
      }
    }

    const updateOps: Record<string, unknown> = { $set: update };

    if (data.auditEntry) {
      updateOps.$push = { auditLog: data.auditEntry };
    }

    const booking = await BookingRequest.findByIdAndUpdate(id, updateOps, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      throw new RepositoryError("Booking not found", "NOT_FOUND");
    }

    return mapRepositoryDoc(booking.toObject()) as IBookingRequest;
  } catch (error) {
    handleRepositoryError(error, "update booking");
  }
}

export async function listBookings(
  options: ListBookingsOptions = {}
): Promise<IBookingRequest[]> {
  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;
    if (options.mode) filter.mode = options.mode;

    const query = BookingRequest.find(filter).sort({ createdAt: -1 });

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);

    const bookings = await query.lean();
    return mapRepositoryDoc(bookings) as IBookingRequest[];
  } catch (error) {
    handleRepositoryError(error, "list bookings");
  }
}
