"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { UploadDir } from "@/lib/constants";
import type { MediaItem } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "./Toast";
import { adminButtonSecondary, adminInputClass, adminLabelClass } from "./admin-styles";

interface MediaUploadProps {
  value?: MediaItem;
  onChange: (media: MediaItem | undefined) => void;
  directory: UploadDir;
  label?: string;
  className?: string;
}

export function MediaUpload({
  value,
  onChange,
  directory,
  label = "Image",
  className,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [alt, setAlt] = useState(value?.alt ?? "");
  const { success, error } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", directory);

      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const media: MediaItem = {
        url: data.url,
        alt: alt || file.name.replace(/\.[^.]+$/, ""),
      };
      onChange(media);
      success("Image uploaded");
    } catch (err) {
      error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.url) {
      try {
        await fetch("/api/admin/uploads/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value.url }),
        });
      } catch {
        // Non-blocking
      }
    }
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className={adminLabelClass}>{label}</label>

      {value?.url ? (
        <div className="relative overflow-hidden rounded-lg border border-antique-gold/20">
          <div className="relative aspect-video w-full max-w-xs bg-rich-black">
            <Image
              src={value.url}
              alt={value.alt || "Uploaded image"}
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-obsidian/80 p-1.5 text-ivory transition-colors hover:bg-red-950/80"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
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
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div>
        <label className={adminLabelClass}>Alt text</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            if (value) onChange({ ...value, alt: e.target.value });
          }}
          className={adminInputClass}
          placeholder="Describe the image"
        />
      </div>
    </div>
  );
}
