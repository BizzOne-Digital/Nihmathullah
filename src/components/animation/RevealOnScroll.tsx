"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useProviders } from "@/components/providers/Providers";

gsap.registerPlugin(ScrollTrigger);

type RevealDirection = "left" | "right" | "top" | "bottom" | "clip";

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

function getDirectionOffsets(
  direction: RevealDirection,
  horizontalOffset: number
): gsap.TweenVars {
  switch (direction) {
    case "left":
      return { x: -horizontalOffset, opacity: 0 };
    case "right":
      return { x: horizontalOffset, opacity: 0 };
    case "top":
      return { y: -Math.min(horizontalOffset, 40), opacity: 0 };
    case "bottom":
      return { y: Math.min(horizontalOffset, 40), opacity: 0 };
    case "clip":
      return { clipPath: "inset(0 100% 0 0)", opacity: 0 };
    default:
      return { y: Math.min(horizontalOffset, 40), opacity: 0 };
  }
}

export function RevealOnScroll({
  children,
  direction = "bottom",
  delay = 0,
  duration = 0.8,
  className,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useProviders();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, clipPath: "none" });
      return;
    }

    const horizontalOffset = window.matchMedia("(max-width: 767px)").matches ? 20 : 60;
    const from = getDirectionOffsets(direction, horizontalOffset);
    const to: gsap.TweenVars = {
      x: 0,
      y: 0,
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: once ? "play none none none" : "play none none reverse",
      },
    };

    gsap.fromTo(el, from, to);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay, duration, once, reducedMotion]);

  return (
    <div ref={ref} className={cn("min-w-0 max-w-full overflow-x-clip", className)}>
      {children}
    </div>
  );
}
