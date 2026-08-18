import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageSection } from "@/types";
import type { IGalleryImage } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface GalleryRailSectionProps {
  section: PageSection;
  galleryImages?: IGalleryImage[];
}

export function GalleryRailSection({ section, galleryImages = [] }: GalleryRailSectionProps) {
  const dark = isDarkTheme(section.theme);
  const images =
    galleryImages.length > 0
      ? galleryImages.slice(0, 8).map((img) => ({
          url: img.url,
          alt: img.alt,
          title: img.title,
          caption: img.caption,
        }))
      : (section.media ?? []);

  if (!images.length) return null;

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            subheading={section.subheading}
            dark={!dark}
          />
        </RevealOnScroll>

        <div className="w-full max-w-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.05} className="shrink-0">
                <div className="relative aspect-[3/4] w-56 flex-shrink-0 snap-start overflow-hidden rounded-sm sm:w-64">
                <OptimizedImage src={item.url} alt={item.alt} fill className="object-cover" />
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {section.primaryCta && (
          <div className="mt-6">
            <Link
              href={section.primaryCta.href}
              className="text-sm font-medium text-signature-gold hover:text-champagne"
            >
              {section.primaryCta.label} →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
