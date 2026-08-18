"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { useToast } from "@/components/admin/Toast";
import type { ServiceDetailPage, ServiceListing } from "@/types";
import { adminCardClass } from "@/components/admin/admin-styles";

export default function EditServicePage() {
  const params = useParams();
  const id = params.id as string;
  const { success, error } = useToast();
  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [detailPage, setDetailPage] = useState<ServiceDetailPage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.service) {
          setListing(data.service.listing);
          setDetailPage(data.service.detailPage ?? { sections: [] });
        } else error(data.error || "Service not found");
      })
      .catch(() => error("Failed to load service"));
  }, [id, error]);

  const handleSubmit = async () => {
    if (!listing || !detailPage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing, detailPage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      success("Service saved");
    } catch (err) {
      error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!listing || !detailPage) {
    return (
      <AdminPage title="Edit Service" breadcrumbs={[{ label: "Services", href: "/admin/services" }]}>
        <p className="text-muted-silver">Loading…</p>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title={`Edit: ${listing.title}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Services", href: "/admin/services" },
        { label: listing.title },
      ]}
    >
      <div className={adminCardClass}>
        <ServiceEditor
          listing={listing}
          detailPage={detailPage}
          onListingChange={setListing}
          onDetailChange={setDetailPage}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </div>
    </AdminPage>
  );
}
