import { NextResponse } from "next/server";
import {
  getStoredUpload,
  isStoredUploadFolder,
} from "@/lib/uploads/stored";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ folder: string; filename: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { folder, filename } = await params;

  if (!isStoredUploadFolder(folder)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const doc = await getStoredUpload(folder, filename);

  if (!doc) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(doc.data), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
