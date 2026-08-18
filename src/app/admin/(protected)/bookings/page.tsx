"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { adminCardClass } from "@/components/admin/admin-styles";

interface Booking {
  _id: string;
  reference: string;
  status: string;
  mode: string;
  createdAt: string;
  tripDetails: {
    contactName: string;
    contactEmail: string;
    pickupAddress: string;
    destinationAddress: string;
    pickupDate: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const { error } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const url = statusFilter
      ? `/api/admin/bookings?status=${encodeURIComponent(statusFilter)}`
      : "/api/admin/bookings";
    fetch(url)
      .then((r) => r.json())
      .then((data) => data.bookings && setBookings(data.bookings))
      .catch(() => error("Failed to load bookings"));
  }, [statusFilter, error]);

  return (
    <AdminPage
      title="Bookings"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Bookings" }]}
    >
      <div className={`mb-4 ${adminCardClass}`}>
        <select
          className="rounded-md border border-antique-gold/20 bg-rich-black px-3 py-2 text-sm text-ivory"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            "New",
            "Needs Quote",
            "Quoted",
            "Confirmed",
            "Completed",
            "Cancelled",
          ].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={adminCardClass}>
        <DataTable
          data={bookings}
          searchKeys={["reference"]}
          getRowId={(r) => r._id}
          onRowClick={(r) => router.push(`/admin/bookings/${r._id}`)}
          columns={[
            { key: "reference", header: "Reference", sortable: true },
            {
              key: "contact",
              header: "Customer",
              render: (r) => r.tripDetails.contactName,
            },
            {
              key: "route",
              header: "Route",
              render: (r) =>
                `${r.tripDetails.pickupAddress} → ${r.tripDetails.destinationAddress}`,
            },
            {
              key: "pickupDate",
              header: "Date",
              render: (r) => r.tripDetails.pickupDate,
            },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusBadge status={r.status} />,
            },
            {
              key: "mode",
              header: "Mode",
              render: (r) => r.mode,
            },
          ]}
        />
      </div>
    </AdminPage>
  );
}
