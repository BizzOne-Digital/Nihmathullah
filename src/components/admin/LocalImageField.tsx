"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import type { StoredUploadFolder } from "@/lib/constants";
import { resolveMediaUrl } from "@/lib/uploads/resolve-media-url";
import { deleteStoredUploadByUrl } from "@/lib/uploads/delete-client";
import { cn } from "@/lib/utils";
import { useToast } from "./Toast";
import { adminButtonSecondary, adminLabelClass } from "./admin-styles";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif";

interface LocalImageFieldProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: StoredUploadFolder;
  label?: string;
  className?: string;
}

export function LocalImageField({
  value,
  onChange,
  folder,
  label = "Image",
  className,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { success, error } = useToast();

  const uploadFile = async (file: File, previousUrl?: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (previousUrl) {
        await deleteStoredUploadByUrl(previousUrl);
      }

      onChange(data.url as string);
      success("Image uploaded");
    } catch (err) {
      error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteStoredUploadByUrl(value);
    }
    onChange(undefined);
    success("Image removed");
  };

  const displayUrl = value ? resolveMediaUrl(value) : undefined;

  return (
    <div className={cn("space-y-3", className)}>
      <label className={adminLabelClass}>{label}</label>

      {displayUrl ? (
        <div className="relative overflow-hidden rounded-lg border border-antique-gold/20">
          <div className="relative aspect-video w-full max-w-xs bg-rich-black">
            <Image
              src={displayUrl}
              alt="Uploaded preview"
              fill
              className="object-cover"
              sizes="320px"
              unoptimized={displayUrl.startsWith("/api/uploads/")}
            />
          </div>
          <div className="absolute right-2 top-2 flex gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-obsidian/80 p-1.5 text-ivory transition-colors hover:bg-charcoal"
              aria-label="Replace image"
              title="Replace"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-full bg-obsidian/80 p-1.5 text-ivory transition-colors hover:bg-red-950/80"
              aria-label="Remove image"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            adminButtonSecondary,
            "flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 border-dashed"
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-signature-gold" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6 text-signature-gold" />
              <span className="text-xs text-muted-silver">Click to upload</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file, value);
          e.target.value = "";
        }}
      />
    </div>
  );
}
