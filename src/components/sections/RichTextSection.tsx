import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface RichTextSectionProps {
  section: PageSection;
}

export function RichTextSection({ section }: RichTextSectionProps) {
  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {section.primaryMedia?.url && (
            <RevealOnScroll direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <OptimizedImage
                  src={section.primaryMedia.url}
                  alt={section.primaryMedia.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          )}
          <RevealOnScroll direction="right">
            <SectionHeading
              eyebrow={section.eyebrow}
              heading={section.heading}
              subheading={section.subheading}
              dark={!dark}
            />
            {section.body && (
              <div
                className={
                  dark ? "text-muted-silver leading-relaxed" : "text-obsidian/70 leading-relaxed"
                }
              >
                {section.body.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>{line}</p>
                ))}
              </div>
            )}
            {section.primaryCta && (
              <Link
                href={section.primaryCta.href}
                className="mt-6 inline-block text-sm font-medium text-signature-gold hover:text-champagne"
              >
                {section.primaryCta.label} →
              </Link>
            )}
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
