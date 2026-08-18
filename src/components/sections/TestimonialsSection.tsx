import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { TestimonialSlider } from "@/components/testimonials/TestimonialSlider";
import type { PageSection } from "@/types";
import type { ITestimonial } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface TestimonialsSectionProps {
  section: PageSection;
  testimonials?: ITestimonial[];
}

export function TestimonialsSection({ section, testimonials = [] }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  const dark = isDarkTheme(section.theme);

  return (
    <section className={sectionWrapperClass(section.theme)}>
      <Container>
        <RevealOnScroll>
          <SectionHeading
            eyebrow={section.eyebrow}
            heading={section.heading}
            subheading={section.subheading}
            dark={!dark}
            align="center"
          />
          {section.body && (
            <p className="mx-auto mb-8 max-w-2xl text-center text-muted-silver">{section.body}</p>
          )}
        </RevealOnScroll>

        {testimonials.length > 0 ? (
          <TestimonialSlider testimonials={testimonials} />
        ) : null}

        {section.media?.[0] && (
          <RevealOnScroll delay={0.2}>
            <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-sm">
              <OptimizedImage
                src={section.media[0].url}
                alt={section.media[0].alt}
                fill
                className="object-cover"
              />
            </div>
          </RevealOnScroll>
        )}
      </Container>
    </section>
  );
}
