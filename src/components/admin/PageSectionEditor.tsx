"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { PageSection, PageSectionType, SectionTheme } from "@/types";
import { cn } from "@/lib/utils";
import { MediaUpload } from "./MediaUpload";
import {
  adminButtonDanger,
  adminButtonSecondary,
  adminInputClass,
  adminLabelClass,
} from "./admin-styles";

const SECTION_TYPES: PageSectionType[] = [
  "hero",
  "quickQuote",
  "richText",
  "splitMedia",
  "serviceCards",
  "airportSpotlight",
  "routeStory",
  "serviceAreas",
  "fleetPreview",
  "imageMosaic",
  "galleryRail",
  "process",
  "testimonials",
  "faqs",
  "contactPanel",
  "cta",
  "editorial",
  "comparison",
  "passengerTypes",
  "pricingInfo",
  "bookingProcess",
  "locationGrid",
  "blogPreview",
];

const THEMES: SectionTheme[] = ["black", "charcoal", "gold", "ivory", "white"];

interface PageSectionEditorProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
}

function emptySection(order: number): PageSection {
  return {
    key: `section-${order + 1}`,
    type: "richText",
    adminLabel: `Section ${order + 1}`,
    visible: true,
    order,
  };
}

export function PageSectionEditor({ sections, onChange }: PageSectionEditorProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const updateSection = (index: number, patch: Partial<PageSection>) => {
    const next = sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
    setExpanded(target);
  };

  const removeSection = (index: number) => {
    onChange(
      sections
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i }))
    );
    setExpanded(null);
  };

  const addSection = () => {
    const next = [...sections, emptySection(sections.length)];
    onChange(next);
    setExpanded(sections.length);
  };

  return (
    <div className="space-y-3">
      {sections.map((section, index) => {
        const isOpen = expanded === index;
        return (
          <div
            key={`${section.key}-${index}`}
            className="rounded-lg border border-antique-gold/15 bg-rich-black/50"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpanded(isOpen ? null : index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-silver">#{index + 1}</span>
                <span className="font-medium text-ivory">
                  {section.adminLabel || section.key}
                </span>
                <span className="rounded bg-charcoal px-2 py-0.5 text-[10px] uppercase text-muted-silver">
                  {section.type}
                </span>
                {!section.visible && (
                  <span className="text-[10px] uppercase text-amber-400">Hidden</span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-silver transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-antique-gold/10 px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={adminLabelClass}>Admin label</label>
                    <input
                      className={adminInputClass}
                      value={section.adminLabel}
                      onChange={(e) =>
                        updateSection(index, { adminLabel: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Key</label>
                    <input
                      className={adminInputClass}
                      value={section.key}
                      onChange={(e) => updateSection(index, { key: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Type</label>
                    <select
                      className={adminInputClass}
                      value={section.type}
                      onChange={(e) =>
                        updateSection(index, {
                          type: e.target.value as PageSectionType,
                        })
                      }
                    >
                      {SECTION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={adminLabelClass}>Theme</label>
                    <select
                      className={adminInputClass}
                      value={section.theme ?? "charcoal"}
                      onChange={(e) =>
                        updateSection(index, {
                          theme: e.target.value as SectionTheme,
                        })
                      }
                    >
                      {THEMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={adminLabelClass}>Eyebrow</label>
                    <input
                      className={adminInputClass}
                      value={section.eyebrow ?? ""}
                      onChange={(e) =>
                        updateSection(index, { eyebrow: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Heading</label>
                    <input
                      className={adminInputClass}
                      value={section.heading ?? ""}
                      onChange={(e) =>
                        updateSection(index, { heading: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={adminLabelClass}>Subheading</label>
                  <input
                    className={adminInputClass}
                    value={section.subheading ?? ""}
                    onChange={(e) =>
                      updateSection(index, { subheading: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className={adminLabelClass}>Body</label>
                  <textarea
                    className={cn(adminInputClass, "min-h-[100px]")}
                    value={section.body ?? ""}
                    onChange={(e) => updateSection(index, { body: e.target.value })}
                  />
                </div>

                <MediaUpload
                  label="Primary media"
                  directory="pages"
                  value={section.primaryMedia}
                  onChange={(media) =>
                    updateSection(index, { primaryMedia: media })
                  }
                />

                <label className="flex items-center gap-2 text-sm text-ivory">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={(e) =>
                      updateSection(index, { visible: e.target.checked })
                    }
                    className="rounded border-antique-gold/30"
                  />
                  Visible on page
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={adminButtonSecondary}
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" /> Up
                  </button>
                  <button
                    type="button"
                    className={adminButtonSecondary}
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sections.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" /> Down
                  </button>
                  <button
                    type="button"
                    className={adminButtonDanger}
                    onClick={() => removeSection(index)}
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className={adminButtonSecondary} onClick={addSection}>
        <Plus className="h-4 w-4" /> Add section
      </button>
    </div>
  );
}
