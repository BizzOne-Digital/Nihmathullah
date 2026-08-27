"use client";

import { useState } from "react";
import type { UploadDir, StoredUploadFolder } from "@/lib/constants";
import { UPLOAD_DIR_TO_STORED_FOLDER } from "@/lib/constants";
import type { MediaItem } from "@/types";
import { cn } from "@/lib/utils";
import { LocalImageField } from "./LocalImageField";
import { adminInputClass, adminLabelClass } from "./admin-styles";

interface MediaUploadProps {
  value?: MediaItem;
  onChange: (media: MediaItem | undefined) => void;
  directory: UploadDir;
  /** Override stored folder (defaults from directory mapping). */
  folder?: StoredUploadFolder;
  label?: string;
  className?: string;
}

export function MediaUpload({
  value,
  onChange,
  directory,
  folder,
  label = "Image",
  className,
}: MediaUploadProps) {
  const [alt, setAlt] = useState(value?.alt ?? "");
  const storedFolder = folder ?? UPLOAD_DIR_TO_STORED_FOLDER[directory];

  return (
    <div className={cn("space-y-3", className)}>
      <LocalImageField
        label={label}
        folder={storedFolder}
        value={value?.url}
        onChange={(url) => {
          if (!url) {
            onChange(undefined);
            return;
          }
          onChange({ url, alt: alt || "Image" });
        }}
      />

      <div>
        <label className={adminLabelClass}>Alt text</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => {
            setAlt(e.target.value);
            if (value?.url) onChange({ url: value.url, alt: e.target.value });
          }}
          className={adminInputClass}
          placeholder="Describe the image"
        />
      </div>
    </div>
  );
}
