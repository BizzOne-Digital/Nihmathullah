"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useProviders } from "@/components/providers/Providers";

export interface LightboxImage {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const { setScrollLocked } = useProviders();
  const current = images[currentIndex];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setScrollLocked(true);
    return () => setScrollLocked(false);
  }, [setScrollLocked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight" && hasMultiple) onNavigate((currentIndex + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, images.length, hasMultiple, onClose, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-obsidian/95 p-4 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-antique-gold/30 text-ivory hover:bg-charcoal"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-sm border border-antique-gold/30 text-ivory hover:bg-charcoal"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 z-10 mr-12 flex h-10 w-10 items-center justify-center rounded-sm border border-antique-gold/30 text-ivory hover:bg-charcoal"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-h-[85vh] max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm">
            <OptimizedImage
              src={current.url}
              alt={current.alt}
              fill
              className="object-contain"
              objectFit="contain"
            />
          </div>
          {(current.title || current.caption) && (
            <div className="mt-4 text-center">
              {current.title && <p className="font-display text-lg text-ivory">{current.title}</p>}
              {current.caption && <p className="mt-1 text-sm text-muted-silver">{current.caption}</p>}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
