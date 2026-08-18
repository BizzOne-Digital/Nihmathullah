"use client";

import { useEffect, useState } from "react";
import { FAQ_CATEGORIES } from "@/lib/constants";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import {
  adminButtonPrimary,
  adminButtonSecondary,
  adminCardClass,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/admin-styles";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
}

export default function FAQsPage() {
  const { success, error } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((data) => data.faqs && setFaqs(data.faqs))
      .catch(() => error("Failed to load FAQs"));
  };

  useEffect(() => { load(); }, [error]);

  const handleSave = async () => {
    if (!editing?.question || !editing.answer) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const res = await fetch("/api/admin/faqs", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success(isNew ? "FAQ created" : "FAQ updated");
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
      title="FAQs"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "FAQs" }]}
      actions={
        <button
          className={adminButtonPrimary}
          onClick={() =>
            setEditing({
              question: "",
              answer: "",
              category: "Booking",
              published: false,
              order: 0,
            })
          }
        >
          Add FAQ
        </button>
      }
    >
      <div className={adminCardClass}>
        <DataTable
          data={faqs}
          searchKeys={["question", "category"]}
          getRowId={(r) => r._id}
          columns={[
            { key: "question", header: "Question", sortable: true },
            { key: "category", header: "Category" },
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
            <div className="space-y-4">
              <div>
                <label className={adminLabelClass}>Question</label>
                <input
                  className={adminInputClass}
                  value={editing.question ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, question: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={adminLabelClass}>Answer</label>
                <textarea
                  className={`${adminInputClass} min-h-[120px]`}
                  value={editing.answer ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, answer: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={adminLabelClass}>Category</label>
                <select
                  className={adminInputClass}
                  value={editing.category ?? "Booking"}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete FAQ"
        message="This cannot be undone."
        variant="danger"
        onConfirm={async () => {
          if (!deleteId) return;
          await fetch(`/api/admin/faqs?id=${deleteId}`, { method: "DELETE" });
          success("Deleted");
          load();
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </AdminPage>
  );
}
