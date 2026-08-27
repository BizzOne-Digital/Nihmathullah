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

interface Vehicle {
  _id: string;
  displayName: string;
  category: string;
  passengerCapacity?: number;
  published: boolean;
  order: number;
  primaryImage?: MediaItem;
}

export default function FleetPage() {
  const { success, error } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editing, setEditing] = useState<Partial<Vehicle> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/fleet")
      .then((r) => r.json())
      .then((data) => data.vehicles && setVehicles(data.vehicles))
      .catch(() => error("Failed to load fleet"));
  };

  useEffect(() => { load(); }, [error]);

  const handleSave = async () => {
    if (!editing?.displayName) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const res = await fetch("/api/admin/fleet", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toMutationPayload(editing)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success(isNew ? "Vehicle added" : "Vehicle updated");
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
      title="Fleet"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fleet" }]}
      actions={
        <button
          className={adminButtonPrimary}
          onClick={() =>
            setEditing({
              displayName: "",
              category: "sedan",
              published: false,
              order: 0,
            })
          }
        >
          Add vehicle
        </button>
      }
    >
      <div className={adminCardClass}>
        <DataTable
          data={vehicles}
          searchKeys={["displayName", "category"]}
          getRowId={(r) => r._id}
          columns={[
            { key: "displayName", header: "Name", sortable: true },
            { key: "category", header: "Category" },
            {
              key: "capacity",
              header: "Passengers",
              render: (r) => r.passengerCapacity ?? "—",
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
              {editing._id ? "Edit vehicle" : "New vehicle"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={adminLabelClass}>Display name</label>
                <input
                  className={adminInputClass}
                  value={editing.displayName ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, displayName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={adminLabelClass}>Category</label>
                <select
                  className={adminInputClass}
                  value={editing.category ?? "sedan"}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  {["sedan", "suv", "van", "sprinter", "luxury", "other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Passengers</label>
                <input
                  type="number"
                  min={1}
                  className={adminInputClass}
                  value={editing.passengerCapacity ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      passengerCapacity: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <MediaUpload
                directory="fleet"
                value={editing.primaryImage}
                onChange={(img) => setEditing({ ...editing, primaryImage: img })}
              />
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
        title="Delete vehicle"
        message="This cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            const res = await fetch(`/api/admin/fleet?id=${deleteId}`, { method: "DELETE" });
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
