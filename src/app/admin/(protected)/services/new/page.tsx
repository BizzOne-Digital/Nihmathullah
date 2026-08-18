"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { useToast } from "@/components/admin/Toast";
import type { ServiceDetailPage, ServiceListing } from "@/types";
import { adminCardClass } from "@/components/admin/admin-styles";

const defaultListing: ServiceListing = {
  title: "",
  slug: "",
  shortDescription: "",
  published: false,
  order: 0,
  features: [],
};

const defaultDetail: ServiceDetailPage = { sections: [] };

export default function NewServicePage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [listing, setListing] = useState<ServiceListing>(defaultListing);
  const [detailPage, setDetailPage] = useState<ServiceDetailPage>(defaultDetail);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing, detailPage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      success("Service created");
      router.push(`/admin/services/${data.service._id}`);
    } catch (err) {
      error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="New Service"
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Services", href: "/admin/services" },
        { label: "New" },
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
          submitLabel="Create service"
        />
      </div>
    </AdminPage>
  );
}
