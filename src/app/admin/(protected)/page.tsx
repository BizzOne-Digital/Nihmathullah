import Link from "next/link";
import connectDB from "@/lib/db/connect";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import {
  BookingRequest,
  Inquiry,
  PaymentRecord,
  Quote,
} from "@/models";
import {
  isMapsEnabled,
  isPaymentsEnabled,
  isSmtpEnabled,
} from "@/lib/utils";
import { AdminPage } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminCardClass } from "@/components/admin/admin-styles";
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  FileCheck,
  Mail,
} from "lucide-react";

interface ConfigWarning {
  message: string;
  severity: "warning" | "error";
}

async function getDashboardData() {
  await connectDB();

  const [
    settings,
    pricing,
    totalBookings,
    newBookings,
    needsQuoteBookings,
    totalInquiries,
    newInquiries,
    totalQuotes,
    pendingPayments,
    paidPayments,
    recentBookings,
    recentInquiries,
  ] = await Promise.all([
    getSiteSettings(),
    getPricingSettings(),
    BookingRequest.countDocuments(),
    BookingRequest.countDocuments({ status: "New" }),
    BookingRequest.countDocuments({ status: "Needs Quote" }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "New" }),
    Quote.countDocuments(),
    PaymentRecord.countDocuments({ status: "Pending" }),
    PaymentRecord.countDocuments({ status: "Paid" }),
    BookingRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("reference status mode createdAt tripDetails.contactName")
      .lean(),
    Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email inquiryType status createdAt")
      .lean(),
  ]);

  const warnings: ConfigWarning[] = [];

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    warnings.push({
      message: "AUTH_SECRET is missing or too short (min 32 chars)",
      severity: "error",
    });
  }

  if (!process.env.MONGODB_URI) {
    warnings.push({
      message: "MONGODB_URI is not configured",
      severity: "error",
    });
  }

  if (!isSmtpEnabled()) {
    warnings.push({
      message: "SMTP email is not configured — booking notifications disabled",
      severity: "warning",
    });
  }

  if (!isPaymentsEnabled()) {
    warnings.push({
      message: "Stripe payments are not fully configured",
      severity: "warning",
    });
  }

  if (!isMapsEnabled()) {
    warnings.push({
      message: "Google Maps API key is not set",
      severity: "warning",
    });
  }

  if (!settings?.logoUrl) {
    warnings.push({
      message: "Site logo is not configured in settings",
      severity: "warning",
    });
  }

  if (!pricing?.paymentEnabled && pricing) {
    warnings.push({
      message: "Payments are disabled in pricing settings",
      severity: "warning",
    });
  }

  return {
    stats: {
      bookings: { total: totalBookings, new: newBookings, needsQuote: needsQuoteBookings },
      inquiries: { total: totalInquiries, new: newInquiries },
      quotes: { total: totalQuotes },
      payments: { pending: pendingPayments, paid: paidPayments },
    },
    recent: {
      bookings: recentBookings.map((b) => ({
        _id: b._id.toString(),
        reference: b.reference,
        status: b.status,
        mode: b.mode,
        contactName: b.tripDetails?.contactName,
        createdAt: b.createdAt.toISOString(),
      })),
      inquiries: recentInquiries.map((i) => ({
        _id: i._id.toString(),
        name: i.name,
        email: i.email,
        inquiryType: i.inquiryType,
        status: i.status,
        createdAt: i.createdAt.toISOString(),
      })),
    },
    warnings,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const statCards = [
    {
      label: "Bookings",
      value: data.stats.bookings.total,
      sub: `${data.stats.bookings.new} new · ${data.stats.bookings.needsQuote} need quote`,
      icon: Calendar,
      href: "/admin/bookings",
    },
    {
      label: "Inquiries",
      value: data.stats.inquiries.total,
      sub: `${data.stats.inquiries.new} new`,
      icon: Mail,
      href: "/admin/inquiries",
    },
    {
      label: "Quotes",
      value: data.stats.quotes.total,
      sub: "All time",
      icon: FileCheck,
      href: "/admin/quotes",
    },
    {
      label: "Payments",
      value: data.stats.payments.paid,
      sub: `${data.stats.payments.pending} pending`,
      icon: CreditCard,
      href: "/admin/payments",
    },
  ];

  return (
    <AdminPage title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      {data.warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.warnings.map((w, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
                w.severity === "error"
                  ? "border-red-500/30 bg-red-950/30 text-red-200"
                  : "border-amber-500/30 bg-amber-950/30 text-amber-200"
              }`}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">{w.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`${adminCardClass} group transition-colors hover:border-signature-gold/30`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-silver">
                    {card.label}
                  </p>
                  <p className="mt-1 font-display text-3xl text-ivory">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-silver">{card.sub}</p>
                </div>
                <Icon className="h-5 w-5 text-signature-gold/60 transition-colors group-hover:text-signature-gold" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Recent bookings</h2>
          {data.recent.bookings.length === 0 ? (
            <p className="text-sm text-muted-silver">No bookings yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recent.bookings.map((b) => (
                <li key={b._id}>
                  <Link
                    href={`/admin/bookings/${b._id}`}
                    className="flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-signature-gold/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-ivory">
                        {b.reference}
                      </p>
                      <p className="text-xs text-muted-silver">
                        {b.contactName} · {b.mode}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={adminCardClass}>
          <h2 className="mb-4 font-display text-lg text-ivory">Recent inquiries</h2>
          {data.recent.inquiries.length === 0 ? (
            <p className="text-sm text-muted-silver">No inquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recent.inquiries.map((inq) => (
                <li key={inq._id}>
                  <Link
                    href="/admin/inquiries"
                    className="flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-signature-gold/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-ivory">{inq.name}</p>
                      <p className="text-xs text-muted-silver">
                        {inq.inquiryType} · {inq.email}
                      </p>
                    </div>
                    <StatusBadge status={inq.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
