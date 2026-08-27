"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isBlockedMediaUrl } from "@/lib/media/sanitize";
import { resolveMediaUrl } from "@/lib/uploads/resolve-media-url";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
  priority,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (!src || error || isBlockedMediaUrl(src)) {
    return null;
  }

  const resolvedSrc = resolveMediaUrl(src);
  const isApiUpload = resolvedSrc.startsWith("/api/uploads/");

  const objectClass =
    objectFit === "cover"
      ? "object-cover"
      : objectFit === "contain"
        ? "object-contain"
        : "object-fill";

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        priority={priority}
        className={cn(objectClass, className)}
        unoptimized={isApiUpload}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
      priority={priority}
      className={cn(objectClass, className)}
      unoptimized={isApiUpload}
      onError={() => setError(true)}
    />
  );
}
