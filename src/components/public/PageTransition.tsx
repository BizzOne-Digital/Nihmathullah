"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useProviders } from "@/components/providers/Providers";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useProviders();
  const isFirstMount = useRef(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    if (reducedMotion) {
      gsap.set(overlay, { display: "none" });
      gsap.set(content, { opacity: 1 });
      return;
    }

    if (isFirstMount.current) {
      isFirstMount.current = false;
      gsap.set(overlay, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(content, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    tl.set(overlay, { scaleX: 0, transformOrigin: "left center", display: "block" })
      .to(overlay, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.inOut",
      })
      .set(content, { opacity: 0 })
      .set(overlay, { transformOrigin: "right center" })
      .to(overlay, {
        scaleX: 0,
        duration: 0.4,
        ease: "power2.inOut",
      })
      .to(content, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

    return () => {
      tl.kill();
    };
  }, [pathname, reducedMotion]);

  return (
    <>
      <div
        ref={overlayRef}
        className={cn(
          "pointer-events-none fixed inset-0 z-[100] hidden origin-left",
          "bg-gradient-to-r from-antique-gold via-signature-gold to-champagne"
        )}
        aria-hidden="true"
      />
      <div ref={contentRef} className="w-full min-w-0 max-w-full overflow-x-clip">
        {children}
      </div>
    </>
  );
}
