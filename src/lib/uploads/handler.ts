import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_SIZE,
  UPLOAD_DIRS,
  type UploadDir,
} from "@/lib/constants";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_MIME_TYPES = new Set<string>(ALLOWED_IMAGE_TYPES);

export interface UploadResult {
  success: true;
  url: string;
}

export interface UploadError {
  success: false;
  error: string;
}

export type HandleUploadResult = UploadResult | UploadError;

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const safeBase = base || "upload";
  const safeExt = ext.replace(/[^a-z0-9.]/g, "").slice(0, 10);

  return `${safeBase}${safeExt}`;
}

function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString("hex");
  return `${timestamp}-${random}-${sanitizeFilename(originalName)}`;
}

function getExtensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

export function validateUploadPath(url: string): string | null {
  if (!url.startsWith("/uploads/")) {
    return null;
  }

  const normalized = path.posix.normalize(url.replace(/\\/g, "/"));

  if (normalized.includes("..") || !normalized.startsWith("/uploads/")) {
    return null;
  }

  const relativePath = normalized.slice("/uploads/".length);
  const segments = relativePath.split("/").filter(Boolean);

  if (segments.length !== 2) {
    return null;
  }

  const [directory, filename] = segments;

  if (!UPLOAD_DIRS.includes(directory as UploadDir)) {
    return null;
  }

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return null;
  }

  const absolutePath = path.join(UPLOADS_ROOT, directory, filename);
  const resolvedRoot = path.resolve(UPLOADS_ROOT);
  const resolvedPath = path.resolve(absolutePath);

  if (
    resolvedPath !== resolvedRoot &&
    !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    return null;
  }

  return resolvedPath;
}

export async function handleUpload(
  formData: FormData,
  directory: UploadDir
): Promise<HandleUploadResult> {
  if (!UPLOAD_DIRS.includes(directory)) {
    return { success: false, error: "Invalid upload directory" };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, error: "No file provided" };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, SVG",
    };
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return { success: false, error: "File exceeds the 5MB size limit" };
  }

  const originalName = file.name || `upload${getExtensionForMime(file.type)}`;
  const filename = generateUniqueFilename(originalName);
  const targetDir = path.join(UPLOADS_ROOT, directory);
  const targetPath = path.join(targetDir, filename);

  try {
    await fs.mkdir(targetDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, buffer);

    return {
      success: true,
      url: `/uploads/${directory}/${filename}`,
    };
  } catch {
    return { success: false, error: "Failed to save uploaded file" };
  }
}

export async function deleteUpload(
  url: string
): Promise<{ success: boolean; error?: string }> {
  const absolutePath = validateUploadPath(url);

  if (!absolutePath) {
    return { success: false, error: "Invalid upload path" };
  }

  try {
    await fs.unlink(absolutePath);
    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return { success: true };
    }

    return { success: false, error: "Failed to delete uploaded file" };
  }
}
