"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useProviders } from "@/components/providers/Providers";
import type { SiteSettingsData } from "@/types";

interface CinematicIntroProps {
  settings: Pick<SiteSettingsData, "logoUrl" | "shortName" | "headline">;
  introEnabled?: boolean;
}

const DEFAULT_LOGO = "/uploads/settings/sierralink-logo.png";

export function CinematicIntro({
  settings,
  introEnabled: introEnabledProp = true,
}: CinematicIntroProps) {
  const {
    reducedMotion,
    introComplete,
    setIntroComplete,
    setScrollLocked,
  } = useProviders();
  const introEnabled = introEnabledProp;

  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const logoUrl = settings.logoUrl || DEFAULT_LOGO;

  useEffect(() => {
    if (!introEnabled || introComplete) return;

    if (reducedMotion) {
      setIntroComplete(true);
      return;
    }

    setShow(true);
    setScrollLocked(true);

    const container = containerRef.current;
    const line = lineRef.current;
    const shield = shieldRef.current;
    const logo = logoRef.current;
    const labels = labelsRef.current;
    const tagline = taglineRef.current;

    if (!container || !line || !shield || !logo || !labels || !tagline) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
        setScrollLocked(false);
        setIntroComplete(true);
      },
    });

    tl.set(container, { display: "flex" })
      .from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power2.inOut",
      })
      .from(
        shield,
        {
          clipPath: "circle(0% at 50% 50%)",
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        logo,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.4)",
        },
        "-=0.5"
      )
      .from(
        labels.children,
        {
          y: 20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .from(
        tagline,
        {
          y: 15,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(container, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.4,
      });

    return () => {
      tl.kill();
      setScrollLocked(false);
    };
  }, [
    introEnabled,
    introComplete,
    reducedMotion,
    setIntroComplete,
    setScrollLocked,
  ]);

  if (!show && introComplete) return null;
  if (introComplete && !show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] hidden flex-col items-center justify-center bg-obsidian"
      aria-hidden={introComplete}
      role="presentation"
    >
      <div
        ref={lineRef}
        className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-signature-gold to-transparent"
      />

      <div
        ref={shieldRef}
        className="relative flex flex-col items-center justify-center"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <div
          ref={logoRef}
          className="relative h-24 w-48 md:h-32 md:w-64"
        >
          <OptimizedImage
            src={logoUrl}
            alt={settings.shortName}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div
          ref={labelsRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[10px] font-sans uppercase tracking-[0.18em] text-muted-silver sm:gap-6 sm:text-xs sm:tracking-[0.25em]"
        >
          <span>ALB</span>
          <span className="h-3 w-px bg-signature-gold/50" />
          <span>Capital Region</span>
          <span className="h-3 w-px bg-signature-gold/50" />
          <span>JFK</span>
        </div>

        <p
          ref={taglineRef}
          className="mt-6 font-display text-lg md:text-xl text-ivory/90"
        >
          Private Travel, Precisely Arranged
        </p>
      </div>
    </div>
  );
}
