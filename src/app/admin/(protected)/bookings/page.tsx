"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import { BOOKING_STATUSES } from "@/lib/constants";
import { adminButtonSecondary, adminCardClass } from "@/components/admin/admin-styles";

interface Booking {
  _id: string;
  reference: string;
  status: string;
  mode: string;
  createdAt: string;
  tripDetails: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    pickupAddress: string;
    destinationAddress: string;
    pickupDate: string;
    pickupTime: string;
    rideType: string;
  };
}

type BookingRow = Booking & {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export default function BookingsPage() {
  const router = useRouter();
  const { error } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "500" });
    if (statusFilter) params.set("status", statusFilter);
    if (modeFilter) params.set("mode", modeFilter);

    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings) setBookings(data.bookings);
        else error(data.error || "Failed to load bookings");
      })
      .catch(() => error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, [statusFilter, modeFilter, error]);

  useEffect(() => {
    load();
  }, [load]);

  const rows: BookingRow[] = useMemo(
    () =>
      bookings.map((booking) => ({
        ...booking,
        customerName: booking.tripDetails.contactName,
        customerEmail: booking.tripDetails.contactEmail,
        customerPhone: booking.tripDetails.contactPhone,
      })),
    [bookings]
  );

  return (
    <AdminPage
      title="Bookings"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Bookings" }]}
      actions={
        <button type="button" className={adminButtonSecondary} onClick={load}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      }
    >
      <div className={`mb-4 flex flex-wrap gap-3 ${adminCardClass}`}>
        <select
          className="rounded-md border border-antique-gold/20 bg-rich-black px-3 py-2 text-sm text-ivory"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-antique-gold/20 bg-rich-black px-3 py-2 text-sm text-ivory"
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option value="booking">Bookings</option>
          <option value="quote">Quote requests</option>
        </select>
        <p className="self-center text-sm text-muted-silver">
          {loading ? "Loading…" : `${rows.length} request${rows.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className={adminCardClass}>
        {loading ? (
          <p className="text-muted-silver">Loading bookings…</p>
        ) : (
          <DataTable
            data={rows}
            searchKeys={["reference", "customerName", "customerEmail", "customerPhone"]}
            searchPlaceholder="Search reference, name, email, phone…"
            emptyMessage="No bookings or quote requests yet."
            getRowId={(r) => r._id}
            onRowClick={(r) => router.push(`/admin/bookings/${r._id}`)}
            columns={[
              { key: "reference", header: "Reference", sortable: true },
              {
                key: "customerName",
                header: "Customer",
                sortable: true,
              },
              {
                key: "customerPhone",
                header: "Phone",
              },
              {
                key: "route",
                header: "Route",
                render: (r) =>
                  `${r.tripDetails.pickupAddress} → ${r.tripDetails.destinationAddress}`,
              },
              {
                key: "pickupDate",
                header: "Pickup",
                render: (r) =>
                  `${r.tripDetails.pickupDate} ${r.tripDetails.pickupTime}`,
              },
              {
                key: "rideType",
                header: "Service",
                render: (r) => r.tripDetails.rideType,
              },
              {
                key: "status",
                header: "Status",
                render: (r) => <StatusBadge status={r.status} />,
              },
              {
                key: "mode",
                header: "Type",
                render: (r) => (r.mode === "quote" ? "Quote" : "Booking"),
              },
              {
                key: "createdAt",
                header: "Submitted",
                sortable: true,
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
            ]}
          />
        )}
      </div>
    </AdminPage>
  );
}
