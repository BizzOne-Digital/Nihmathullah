import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IAuditEvent extends Document {
  entityType: string;
  entityId: string;
  action: string;
  changes?: Record<string, unknown>;
  adminUserId?: Types.ObjectId;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuditEventSchema = new Schema<IAuditEvent>(
  {
    entityType: { type: String, required: true, trim: true },
    entityId: { type: String, required: true },
    action: { type: String, required: true },
    changes: { type: Schema.Types.Mixed },
    adminUserId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    timestamp: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

AuditEventSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
AuditEventSchema.index({ adminUserId: 1, timestamp: -1 });
AuditEventSchema.index({ timestamp: -1 });
AuditEventSchema.index({ action: 1, timestamp: -1 });

export const AuditEvent: Model<IAuditEvent> =
  (mongoose.models.AuditEvent as Model<IAuditEvent>) ||
  mongoose.model<IAuditEvent>("AuditEvent", AuditEventSchema);
