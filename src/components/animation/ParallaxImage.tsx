"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useProviders } from "@/components/providers/Providers";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  speed?: number;
  priority?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  speed = 0.15,
  priority,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useProviders();

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image || reducedMotion) return;

    const tween = gsap.to(image, {
      y: () => container.offsetHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, reducedMotion]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div
        ref={imageRef}
        className={cn("absolute inset-0 -top-[10%] h-[120%] w-full", imageClassName)}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
