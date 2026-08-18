import mongoose, { Document, Model, Schema } from "mongoose";
import type { ServiceListing, ServiceDetailPage } from "@/types";
import {
  CtaLinkSchema,
  MediaItemSchema,
  PageHeroSchema,
  SeoFieldsSchema,
  ServiceDetailSectionSchema,
} from "./schemas";

export type AdminRole = "admin" | "superadmin";

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    lastLogin: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AdminUserSchema.index({ email: 1 }, { unique: true });
AdminUserSchema.index({ active: 1 });

export const AdminUser: Model<IAdminUser> =
  (mongoose.models.AdminUser as Model<IAdminUser>) ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
