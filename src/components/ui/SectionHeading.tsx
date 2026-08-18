import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  className,
  dark = false,
}: SectionHeadingProps) {
  if (!eyebrow && !heading && !subheading) return null;

  return (
    <div
      className={cn(
        "mb-10 min-w-0 max-w-full md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-sans font-semibold uppercase tracking-[0.2em]",
            dark ? "text-obsidian/70" : "text-signature-gold"
          )}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2
          className={cn(
            "break-words font-display text-3xl leading-tight md:text-4xl lg:text-5xl",
            dark ? "text-obsidian" : "text-ivory"
          )}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p
          className={cn(
            "mt-4 max-w-2xl break-words text-base leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            dark ? "text-obsidian/70" : "text-muted-silver"
          )}
        >
          {subheading}
        </p>
      )}
      <div
        className={cn(
          "mt-6 h-px w-16 bg-gradient-to-r from-signature-gold to-transparent",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
