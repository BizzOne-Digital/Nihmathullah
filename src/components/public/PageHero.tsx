import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/animation/ParallaxImage";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import type { PageHero as PageHeroData } from "@/types";

interface PageHeroProps {
  hero?: PageHeroData;
  title?: string;
}

export function PageHero({ hero, title }: PageHeroProps) {
  if (!hero && !title) return null;

  const bgImage = hero?.backgroundImage?.url;

  return (
    <section className="relative flex min-h-[45vh] items-center overflow-hidden bg-obsidian py-16 md:min-h-[50vh]">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={bgImage}
            alt={hero?.backgroundImage?.alt || hero?.heading || title || "Page hero"}
            className="absolute inset-0 h-full w-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian" />
        </div>
      )}

      <Container className="relative z-10">
        <RevealOnScroll direction="bottom">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow={hero?.eyebrow}
              heading={hero?.heading || title}
              subheading={hero?.subheading}
            />
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
