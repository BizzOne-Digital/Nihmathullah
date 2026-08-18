"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useProviders } from "@/components/providers/Providers";

export function CustomCursor() {
  const { reducedMotion } = useProviders();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = window.innerWidth < 768;
    setEnabled(!reducedMotion && !isTouch && !isMobile);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, input, textarea, select, [role='button'], label"
      );
      setHovering(!!interactive);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.body.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.body.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[9999] mix-blend-difference transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={cn(
          "rounded-full border border-signature-gold/60 transition-all duration-300",
          hovering ? "h-12 w-12 bg-signature-gold/10" : "h-6 w-6 bg-transparent"
        )}
      />
    </div>
  );
}
