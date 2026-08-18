import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-antique-gold/30 bg-antique-gold/10 text-champagne",
  success: "border-emerald-500/30 bg-emerald-950/50 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-950/50 text-amber-300",
  danger: "border-red-500/30 bg-red-950/50 text-red-300",
  info: "border-blue-500/30 bg-blue-950/50 text-blue-300",
  muted: "border-muted-silver/20 bg-rich-black text-muted-silver",
};

const statusVariantMap: Record<string, BadgeVariant> = {
  New: "info",
  "Needs Quote": "warning",
  Quoted: "default",
  "Customer Accepted": "success",
  Confirmed: "success",
  Assigned: "info",
  "In Progress": "info",
  Completed: "success",
  Cancelled: "danger",
  Archived: "muted",
  Draft: "muted",
  "Sent/Shared": "info",
  Viewed: "info",
  Accepted: "success",
  Declined: "danger",
  Expired: "muted",
  Superseded: "muted",
  "Not Requested": "muted",
  Pending: "warning",
  Paid: "success",
  Failed: "danger",
  Refunded: "warning",
  "Partially Refunded": "warning",
  Open: "info",
  "In Review": "warning",
  Resolved: "success",
  Closed: "muted",
};

export function getStatusVariant(status: string): BadgeVariant {
  return statusVariantMap[status] ?? "default";
}

export function StatusBadge({
  status,
  variant,
  className,
}: StatusBadgeProps) {
  const resolved = variant ?? getStatusVariant(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantStyles[resolved],
        className
      )}
    >
      {status}
    </span>
  );
}
