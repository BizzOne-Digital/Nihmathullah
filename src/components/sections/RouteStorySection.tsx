"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

gsap.registerPlugin(ScrollTrigger);

interface RouteItem {
  from?: string;
  to?: string;
  label?: string;
  description?: string;
}

interface RouteStorySectionProps {
  section: PageSection;
}

export function RouteStorySection({ section }: RouteStorySectionProps) {
  const dark = isDarkTheme(section.theme);
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const items = (section.items as RouteItem[] | undefined) ?? [
    { from: "Albany", to: "JFK", label: "Capital Region to JFK" },
    { from: "Saratoga", to: "ALB", label: "Saratoga to Albany Airport" },
    { from: "Clifton Park", to: "Manhattan", label: "Clifton Park to NYC" },
  ];

  useEffect(() => {
    const path = lineRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: container,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading || "Routes We Know"}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
        </RevealOnScroll>

        <div ref={containerRef} className="relative">
          <svg
            className="absolute left-0 top-1/2 w-full -translate-y-1/2"
            viewBox="0 0 800 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={lineRef}
              d="M 0 50 Q 200 10 400 50 T 800 50"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#AC9461" />
                <stop offset="50%" stopColor="#D0AF6F" />
                <stop offset="100%" stopColor="#E2C179" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {items.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.15} direction="bottom">
                <div className="text-center md:text-left">
                  <div className="mx-auto md:mx-0 h-3 w-3 rounded-full bg-signature-gold mb-4" />
                  <h3 className="font-display text-lg text-ivory">
                    {item.label || `${item.from} → ${item.to}`}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-silver">{item.description}</p>
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
