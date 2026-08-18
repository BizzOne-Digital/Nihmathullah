"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import type { ITestimonial } from "@/models";

interface TestimonialSliderProps {
  testimonials: ITestimonial[];
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((prev) => (prev + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => go(1), 8000);
    return () => clearInterval(timer);
  }, [count, go]);

  if (count === 0) return null;

  const current = testimonials[index];
  const hasRating = typeof current.rating === "number" && current.rating > 0;

  return (
    <div className="relative mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id?.toString() || index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="rounded-sm border border-antique-gold/20 bg-charcoal/40 p-8 md:p-10"
        >
          {hasRating && (
            <div className="mb-4 flex gap-1" aria-label={`${current.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (current.rating ?? 0)
                      ? "fill-signature-gold text-signature-gold"
                      : "text-muted-silver"
                  }`}
                />
              ))}
            </div>
          )}

          <blockquote className="font-display text-xl md:text-2xl text-ivory leading-relaxed">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="mt-6 flex items-center gap-4">
            {current.image?.url && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <OptimizedImage
                  src={current.image.url}
                  alt={current.image.alt || current.customerName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-ivory">{current.customerName}</p>
              {(current.role || current.company) && (
                <p className="text-sm text-muted-silver">
                  {[current.role, current.company].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-antique-gold/30 text-signature-gold hover:bg-charcoal"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-silver">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-antique-gold/30 text-signature-gold hover:bg-charcoal"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
