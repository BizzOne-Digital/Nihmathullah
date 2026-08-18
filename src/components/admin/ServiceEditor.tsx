"use client";

import { useState } from "react";
import type { PageSection, ServiceDetailPage, ServiceListing } from "@/types";
import { slugify } from "@/lib/utils";
import { MediaUpload } from "./MediaUpload";
import { PageSectionEditor } from "./PageSectionEditor";
import { cn } from "@/lib/utils";
import {
  adminButtonPrimary,
  adminInputClass,
  adminLabelClass,
} from "./admin-styles";

interface ServiceEditorProps {
  listing: ServiceListing;
  detailPage: ServiceDetailPage;
  onListingChange: (listing: ServiceListing) => void;
  onDetailChange: (detail: ServiceDetailPage) => void;
  onSubmit: () => void;
  saving?: boolean;
  submitLabel?: string;
}

type Tab = "listing" | "detail";

export function ServiceEditor({
  listing,
  detailPage,
  onListingChange,
  onDetailChange,
  onSubmit,
  saving = false,
  submitLabel = "Save service",
}: ServiceEditorProps) {
  const [tab, setTab] = useState<Tab>("listing");
  const [featureInput, setFeatureInput] = useState("");

  const addFeature = () => {
    if (!featureInput.trim()) return;
    onListingChange({
      ...listing,
      features: [...(listing.features ?? []), featureInput.trim()],
    });
    setFeatureInput("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="flex gap-1 rounded-lg border border-antique-gold/15 bg-rich-black p-1">
        {(["listing", "detail"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "bg-signature-gold/15 text-signature-gold"
                : "text-muted-silver hover:text-ivory"
            )}
          >
            {t === "listing" ? "Listing / Description" : "Detail Page"}
          </button>
        ))}
      </div>

      {tab === "listing" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Title</label>
              <input
                className={adminInputClass}
                value={listing.title}
                onChange={(e) => {
                  const title = e.target.value;
                  onListingChange({
                    ...listing,
                    title,
                    slug: listing.slug || slugify(title),
                  });
                }}
                required
              />
            </div>
            <div>
              <label className={adminLabelClass}>Slug</label>
              <input
                className={adminInputClass}
                value={listing.slug}
                onChange={(e) =>
                  onListingChange({ ...listing, slug: slugify(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className={adminLabelClass}>Short description</label>
            <textarea
              className={cn(adminInputClass, "min-h-[80px]")}
              value={listing.shortDescription}
              onChange={(e) =>
                onListingChange({ ...listing, shortDescription: e.target.value })
              }
              required
            />
          </div>

          <MediaUpload
            label="Main image"
            directory="services"
            value={listing.mainImage}
            onChange={(media) =>
              onListingChange({ ...listing, mainImage: media })
            }
          />

          <div>
            <label className={adminLabelClass}>Features</label>
            <div className="flex gap-2">
              <input
                className={adminInputClass}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <button type="button" className={adminButtonPrimary} onClick={addFeature}>
                Add
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {(listing.features ?? []).map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded bg-charcoal px-3 py-1.5 text-sm"
                >
                  {f}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300"
                    onClick={() =>
                      onListingChange({
                        ...listing,
                        features: listing.features?.filter((_, j) => j !== i),
                      })
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Order</label>
              <input
                type="number"
                className={adminInputClass}
                value={listing.order}
                onChange={(e) =>
                  onListingChange({
                    ...listing,
                    order: Number(e.target.value),
                  })
                }
              />
            </div>
            <label className="flex items-center gap-2 self-end text-sm text-ivory">
              <input
                type="checkbox"
                checked={listing.published}
                onChange={(e) =>
                  onListingChange({ ...listing, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>
        </div>
      )}

      {tab === "detail" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Hero eyebrow</label>
              <input
                className={adminInputClass}
                value={detailPage.hero?.eyebrow ?? ""}
                onChange={(e) =>
                  onDetailChange({
                    ...detailPage,
                    hero: { ...detailPage.hero, eyebrow: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className={adminLabelClass}>Hero heading</label>
              <input
                className={adminInputClass}
                value={detailPage.hero?.heading ?? ""}
                onChange={(e) =>
                  onDetailChange({
                    ...detailPage,
                    hero: { ...detailPage.hero, heading: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className={adminLabelClass}>Hero subheading</label>
            <input
              className={adminInputClass}
              value={detailPage.hero?.subheading ?? ""}
              onChange={(e) =>
                onDetailChange({
                  ...detailPage,
                  hero: { ...detailPage.hero, subheading: e.target.value },
                })
              }
            />
          </div>

          <MediaUpload
            label="Hero background"
            directory="services"
            value={detailPage.hero?.backgroundImage}
            onChange={(media) =>
              onDetailChange({
                ...detailPage,
                hero: { ...detailPage.hero, backgroundImage: media },
              })
            }
          />

          <div>
            <h3 className="mb-3 font-display text-lg text-ivory">Detail sections</h3>
            <PageSectionEditor
              sections={detailPage.sections.map((s) => ({
                ...s,
                key: s._id ?? `detail-${s.order}`,
                type: s.type as PageSection["type"],
                adminLabel: s.heading ?? `Section ${s.order + 1}`,
              }))}
              onChange={(sections) =>
                onDetailChange({
                  ...detailPage,
                  sections: sections.map((s) => ({
                    type: s.type,
                    heading: s.heading,
                    subheading: s.subheading,
                    body: s.body,
                    items: s.items,
                    media: s.media,
                    primaryCta: s.primaryCta,
                    layout: s.layout,
                    theme: s.theme,
                    visible: s.visible,
                    order: s.order,
                  })),
                })
              }
            />
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-antique-gold/15 pt-4">
        <button type="submit" className={adminButtonPrimary} disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
