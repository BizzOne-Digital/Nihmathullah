import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BOOKING_STATUSES } from "@/lib/constants";
import type { BookingFormData } from "@/types";

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type BookingMode = "booking" | "quote";

export interface IBookingAuditEntry {
  action: string;
  changes?: Record<string, unknown>;
  adminUserId?: Types.ObjectId;
  note?: string;
  timestamp: Date;
}

export interface IBookingTripDetails {
  rideType: string;
  tripStructure: "one-way" | "round-trip" | "hourly";
  pickupAddress: string;
  destinationAddress: string;
  durationHours?: number;
  stops?: string[];
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  timezone: string;
  airportCode?: string;
  flightType?: "arrival" | "departure";
  airline?: string;
  flightNumber?: string;
  passengerCount: number;
  luggageCount: number;
  childSeatRequest?: boolean;
  accessibilityRequest?: boolean;
  specialAssistance?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company?: string;
  preferredContact: "phone" | "email" | "either";
  specialInstructions?: string;
  consent: boolean;
}

export interface IBookingRequest extends Document {
  reference: string;
  mode: BookingMode;
  status: BookingStatus;
  tripDetails: IBookingTripDetails;
  internalNotes?: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  auditLog: IBookingAuditEntry[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingAuditEntrySchema = new Schema<IBookingAuditEntry>(
  {
    action: { type: String, required: true },
    changes: { type: Schema.Types.Mixed },
    adminUserId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    note: { type: String },
    timestamp: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const BookingTripDetailsSchema = new Schema<IBookingTripDetails>(
  {
    rideType: { type: String, required: true },
    tripStructure: {
      type: String,
      required: true,
      enum: ["one-way", "round-trip", "hourly"],
    },
    pickupAddress: { type: String, required: true },
    destinationAddress: { type: String, default: "" },
    durationHours: { type: Number, min: 1, max: 24 },
    stops: { type: [String], default: undefined },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    returnDate: { type: String },
    returnTime: { type: String },
    timezone: { type: String, required: true },
    airportCode: { type: String },
    flightType: { type: String, enum: ["arrival", "departure"] },
    airline: { type: String },
    flightNumber: { type: String },
    passengerCount: { type: Number, required: true, min: 1 },
    luggageCount: { type: Number, required: true, min: 0 },
    childSeatRequest: { type: Boolean },
    accessibilityRequest: { type: Boolean },
    specialAssistance: { type: String },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    contactPhone: { type: String, required: true },
    company: { type: String },
    preferredContact: {
      type: String,
      required: true,
      enum: ["phone", "email", "either"],
    },
    specialInstructions: { type: String },
    consent: { type: Boolean, required: true },
  },
  { _id: false }
);

const BookingRequestSchema = new Schema<IBookingRequest>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    mode: {
      type: String,
      required: true,
      enum: ["booking", "quote"],
    },
    status: {
      type: String,
      required: true,
      enum: BOOKING_STATUSES,
      default: "New",
    },
    tripDetails: { type: BookingTripDetailsSchema, required: true },
    internalNotes: { type: String },
    assignedVehicle: { type: String },
    assignedDriver: { type: String },
    auditLog: { type: [BookingAuditEntrySchema], default: [] },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    referrer: { type: String },
  },
  { timestamps: true }
);

BookingRequestSchema.index({ reference: 1 }, { unique: true });
BookingRequestSchema.index({ status: 1, createdAt: -1 });
BookingRequestSchema.index({ mode: 1, status: 1 });
BookingRequestSchema.index({ createdAt: -1 });
BookingRequestSchema.index({ "tripDetails.contactEmail": 1 });

export const BookingRequest: Model<IBookingRequest> =
  (mongoose.models.BookingRequest as Model<IBookingRequest>) ||
  mongoose.model<IBookingRequest>("BookingRequest", BookingRequestSchema);

// Re-export BookingFormData alignment helper type
export type { BookingFormData };
