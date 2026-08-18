import type { SectionTheme } from "@/types";
import { cn } from "@/lib/utils";

export function getSectionThemeClass(theme?: SectionTheme): string {
  switch (theme) {
    case "charcoal":
      return "section-theme-charcoal";
    case "gold":
      return "section-theme-gold";
    case "ivory":
      return "section-theme-ivory";
    case "white":
      return "section-theme-white";
    default:
      return "section-theme-black";
  }
}

export function sectionWrapperClass(theme?: SectionTheme, className?: string) {
  return cn(
    "w-full max-w-full overflow-x-clip py-[var(--section-padding-y)]",
    getSectionThemeClass(theme),
    className
  );
}

export function isDarkTheme(theme?: SectionTheme): boolean {
  return !theme || theme === "black" || theme === "charcoal";
}
