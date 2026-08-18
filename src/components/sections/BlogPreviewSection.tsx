import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/animation/RevealOnScroll";
import { BlogCard } from "@/components/blog/BlogCard";
import type { PageSection } from "@/types";
import type { IBlogPost } from "@/models";
import { sectionWrapperClass, isDarkTheme } from "./theme";

interface BlogPreviewSectionProps {
  section: PageSection;
  blogPosts?: IBlogPost[];
}

export function BlogPreviewSection({ section, blogPosts = [] }: BlogPreviewSectionProps) {
  const dark = isDarkTheme(section.theme);
  const posts = blogPosts.slice(0, 3);

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

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <RevealOnScroll key={post.slug} delay={i * 0.08}>
                <BlogCard post={post} />
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <p className="text-muted-silver">Blog posts coming soon.</p>
        )}

        <div className="mt-8">
          <Button href="/blog" variant="outline">
            {section.primaryCta?.label || "View All Posts"}
          </Button>
        </div>
      </Container>
    </section>
  );
}
