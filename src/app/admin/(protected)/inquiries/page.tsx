"use client";

import { useEffect, useState } from "react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  status: string;
  internalNotes?: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const { success, error } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((data) => data.inquiries && setInquiries(data.inquiries))
      .catch(() => error("Failed to load inquiries"));
  };

  useEffect(() => { load(); }, [error]);

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected._id,
          status: selected.status,
          internalNotes: selected.internalNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      success("Inquiry updated");
      setSelected(null);
      load();
    } catch (err) {
      error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Inquiries"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Inquiries" }]}
    >
      <div className={adminCardClass}>
        <DataTable
          data={inquiries}
          searchKeys={["name", "email", "inquiryType"]}
          getRowId={(r) => r._id}
          onRowClick={(r) => setSelected(r)}
          columns={[
            { key: "name", header: "Name", sortable: true },
            { key: "email", header: "Email" },
            { key: "inquiryType", header: "Type" },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "createdAt",
              header: "Date",
              render: (r) => new Date(r.createdAt).toLocaleDateString(),
            },
          ]}
        />
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/80" onClick={() => setSelected(null)} />
          <div className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto ${adminCardClass}`}>
            <h2 className="mb-4 font-display text-lg text-ivory">{selected.name}</h2>
            <p className="mb-2 text-sm text-muted-silver">{selected.email}</p>
            <p className="mb-4 text-sm text-ivory">{selected.message}</p>
            <div className="space-y-4">
              <div>
                <label className={adminLabelClass}>Status</label>
                <select
                  className={adminInputClass}
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                >
                  {["New", "Read", "In Progress", "Responded", "Archived"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Internal notes</label>
                <textarea
                  className={`${adminInputClass} min-h-[80px]`}
                  value={selected.internalNotes ?? ""}
                  onChange={(e) =>
                    setSelected({ ...selected, internalNotes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className={adminButtonSecondary} onClick={() => setSelected(null)}>
                  Cancel
                </button>
                <button className={adminButtonPrimary} onClick={handleUpdate} disabled={saving}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
