"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import type { MediaItem } from "@/types";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";
import { toMutationPayload } from "@/lib/admin/mutation-payload";

interface Testimonial {
  _id: string;
  customerName: string;
  quote: string;
  company?: string;
  rating?: number;
  featured: boolean;
  published: boolean;
  order: number;
  image?: MediaItem;
}

export default function TestimonialsPage() {
  const { success, error } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => data.testimonials && setItems(data.testimonials))
      .catch(() => error("Failed to load"));
  };

  useEffect(() => { load(); }, [error]);

  const handleSave = async () => {
    if (!editing?.customerName || !editing.quote) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const res = await fetch("/api/admin/testimonials", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toMutationPayload(editing)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success(isNew ? "Created" : "Updated");
      setEditing(null);
      load();
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Testimonials"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Testimonials" }]}
      actions={
        <button
          className={adminButtonPrimary}
          onClick={() =>
            setEditing({
              customerName: "",
              quote: "",
              featured: false,
              published: false,
              order: 0,
            })
          }
        >
          Add testimonial
        </button>
      }
    >
      <div className={adminCardClass}>
        <DataTable
          data={items}
          searchKeys={["customerName", "quote"]}
          getRowId={(r) => r._id}
          columns={[
            { key: "customerName", header: "Customer", sortable: true },
            {
              key: "quote",
              header: "Quote",
              render: (r) =>
                r.quote.length > 60 ? `${r.quote.slice(0, 60)}…` : r.quote,
            },
            {
              key: "featured",
              header: "Featured",
              render: (r) => (r.featured ? "Yes" : "—"),
            },
            {
              key: "published",
              header: "Status",
              render: (r) => (
                <StatusBadge
                  status={r.published ? "Published" : "Draft"}
                  variant={r.published ? "success" : "muted"}
                />
              ),
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-signature-gold hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(r);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-red-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(r._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/80" onClick={() => setEditing(null)} />
          <div className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto ${adminCardClass}`}>
            <div className="space-y-4">
              <div>
                <label className={adminLabelClass}>Customer name</label>
                <input
                  className={adminInputClass}
                  value={editing.customerName ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, customerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={adminLabelClass}>Quote</label>
                <textarea
                  className={adminInputClass}
                  value={editing.quote ?? ""}
                  onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                />
              </div>
              <MediaUpload
                directory="testimonials"
                value={editing.image}
                onChange={(img) => setEditing({ ...editing, image: img })}
              />
              <label className="flex items-center gap-2 text-sm text-ivory">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-ivory">
                <input
                  type="checkbox"
                  checked={editing.published ?? false}
                  onChange={(e) =>
                    setEditing({ ...editing, published: e.target.checked })
                  }
                />
                Published
              </label>
              <div className="flex justify-end gap-2">
                <button className={adminButtonSecondary} onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button className={adminButtonPrimary} onClick={handleSave} disabled={saving}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete testimonial"
        message="This cannot be undone."
        variant="danger"
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            const res = await fetch(`/api/admin/testimonials?id=${deleteId}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            success("Deleted");
            load();
          } catch (err) {
            error(err instanceof Error ? err.message : "Delete failed");
          } finally {
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </AdminPage>
  );
}
