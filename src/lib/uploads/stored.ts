import { randomBytes } from "crypto";
import connectDB from "@/lib/db/connect";
import {
  STORED_MAX_UPLOAD_SIZE,
  STORED_UPLOAD_FOLDERS,
  STORED_UPLOAD_MIME_TYPES,
  type StoredUploadFolder,
} from "@/lib/constants";
import { StoredUpload } from "@/models/StoredUpload";

export interface StoredUploadResult {
  success: true;
  url: string;
  filename: string;
  size: number;
  folder: StoredUploadFolder;
}

export interface StoredUploadError {
  success: false;
  error: string;
}

export type StoreUploadOutcome = StoredUploadResult | StoredUploadError;

const ALLOWED_MIME = new Set<string>(STORED_UPLOAD_MIME_TYPES);

export function isStoredUploadFolder(value: string): value is StoredUploadFolder {
  return (STORED_UPLOAD_FOLDERS as readonly string[]).includes(value);
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export function generateStoredFilename(mimeType: string): string {
  const randomHex = randomBytes(8).toString("hex");
  return `${Date.now()}-${randomHex}.${extensionForMime(mimeType)}`;
}

export function buildStoredUploadUrl(
  folder: StoredUploadFolder,
  filename: string
): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(
  url: string
): { folder: StoredUploadFolder; filename: string } | null {
  if (!url.startsWith("/api/uploads/")) {
    return null;
  }

  const path = url.replace(/\\/g, "/");
  const match = path.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const folder = match[1];
  const filename = match[2];

  if (!isStoredUploadFolder(folder)) return null;
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return null;
  }

  return { folder, filename };
}

export async function storeUpload(
  file: File,
  folder: StoredUploadFolder
): Promise<StoreUploadOutcome> {
  if (!isStoredUploadFolder(folder)) {
    return { success: false, error: "Invalid upload folder" };
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF",
    };
  }

  if (file.size > STORED_MAX_UPLOAD_SIZE) {
    return { success: false, error: "File exceeds the 8MB size limit" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = generateStoredFilename(file.type);

  try {
    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    });

    return {
      success: true,
      url: buildStoredUploadUrl(folder, filename),
      filename,
      size: buffer.length,
      folder,
    };
  } catch {
    return { success: false, error: "Failed to store uploaded file" };
  }
}

export async function getStoredUpload(
  folder: StoredUploadFolder,
  filename: string
): Promise<IStoredUploadDoc | null> {
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return null;
  }

  await connectDB();
  const doc = await StoredUpload.findOne({ folder, filename }).lean();
  if (!doc) return null;

  return {
    mimeType: doc.mimeType,
    size: doc.size,
    data: doc.data as Buffer,
  };
}

export interface IStoredUploadDoc {
  mimeType: string;
  size: number;
  data: Buffer;
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return false;

  await connectDB();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });

  return result.deletedCount > 0;
}
