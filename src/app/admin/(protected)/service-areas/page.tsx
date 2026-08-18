"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { slugify } from "@/lib/utils";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface ServiceArea {
  _id: string;
  city: string;
  slug: string;
  shortSummary: string;
  published: boolean;
  order: number;
}

export default function ServiceAreasPage() {
  const { success, error } = useToast();
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [editing, setEditing] = useState<Partial<ServiceArea> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/service-areas")
      .then((r) => r.json())
      .then((data) => data.areas && setAreas(data.areas))
      .catch(() => error("Failed to load"));
  };

  useEffect(() => { load(); }, [error]);

  const handleSave = async () => {
    if (!editing?.city || !editing.shortSummary) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const res = await fetch("/api/admin/service-areas", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editing,
          slug: editing.slug || slugify(editing.city),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success(isNew ? "Area created" : "Area updated");
      setEditing(null);
      load();
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/service-areas?id=${deleteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      success("Area deleted");
      load();
    } else error("Delete failed");
    setDeleteId(null);
  };

  return (
    <AdminPage
      title="Service Areas"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Service Areas" }]}
      actions={
        <button
          className={adminButtonPrimary}
          onClick={() =>
            setEditing({ city: "", slug: "", shortSummary: "", published: false, order: 0 })
          }
        >
          Add area
        </button>
      }
    >
      <div className={adminCardClass}>
        <DataTable
          data={areas}
          searchKeys={["city", "slug"]}
          getRowId={(r) => r._id}
          columns={[
            { key: "city", header: "City", sortable: true },
            { key: "slug", header: "Slug" },
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
            { key: "order", header: "Order" },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="flex gap-2">
                  <button
                    className="text-signature-gold hover:underline"
                    onClick={() => setEditing(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-400 hover:underline"
                    onClick={() => setDeleteId(r._id)}
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
            <h2 className="mb-4 font-display text-lg text-ivory">
              {editing._id ? "Edit area" : "New area"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={adminLabelClass}>City</label>
                <input
                  className={adminInputClass}
                  value={editing.city ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      city: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className={adminLabelClass}>Summary</label>
                <textarea
                  className={adminInputClass}
                  value={editing.shortSummary ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, shortSummary: e.target.value })
                  }
                />
              </div>
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
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete service area"
        message="This cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminPage>
  );
}
