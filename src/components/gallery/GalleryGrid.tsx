"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { Lightbox, type LightboxImage } from "./Lightbox";
import type { IGalleryCategory, IGalleryImage } from "@/models";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  categories: IGalleryCategory[];
  images: IGalleryImage[];
}

export function GalleryGrid({ categories, images }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.categoryId?.toString() === activeCategory);

  const lightboxImages: LightboxImage[] = filtered.map((img) => ({
    url: img.url,
    alt: img.alt,
    title: img.title,
    caption: img.caption,
  }));

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-signature-gold text-obsidian"
                : "border border-antique-gold/30 text-ivory hover:border-signature-gold"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id?.toString()}
              type="button"
              onClick={() => setActiveCategory(cat._id?.toString() || cat.slug)}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat._id?.toString()
                  ? "bg-signature-gold text-obsidian"
                  : "border border-antique-gold/30 text-ivory hover:border-signature-gold"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, i) => (
          <RevealOnScroll key={image._id?.toString() || i} delay={i * 0.03}>
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature-gold"
            >
              <div className="relative aspect-auto">
                <OptimizedImage
                  src={image.url}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              {image.title && (
                <p className="mt-2 text-sm text-muted-silver group-hover:text-signature-gold">
                  {image.title}
                </p>
              )}
            </button>
          </RevealOnScroll>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-silver">No images in this category yet.</p>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
