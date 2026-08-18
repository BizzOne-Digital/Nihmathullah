"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  HelpCircle,
  Image,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageSquareQuote,
  Newspaper,
  Settings,
} from "lucide-react";
import { SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  section: string;
}

type NavEntry = NavItem | NavSection;

const navItems: NavEntry[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Service Areas", href: "/admin/service-areas", icon: MapPin },
  { label: "Fleet", href: "/admin/fleet", icon: Car },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { section: "Operations" },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Quotes", href: "/admin/quotes", icon: FileCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Inquiries", href: "/admin/inquiries", icon: Mail },
  { section: "System" },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function isNavItem(entry: NavEntry): entry is NavItem {
  return "href" in entry;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col border-r border-antique-gold/15 bg-rich-black transition-all duration-300 md:w-auto",
        collapsed ? "md:w-[72px]" : "md:w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-antique-gold/15 px-4">
        {!collapsed && (
          <Link href="/admin" className="hidden font-display text-lg text-signature-gold md:inline">
            {SITE_SHORT_NAME}
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-auto rounded-md p-1.5 text-muted-silver transition-colors hover:bg-charcoal hover:text-ivory md:ml-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-2">
          {navItems.map((entry, i) => {
            if (!isNavItem(entry)) {
              return (
                !collapsed && (
                  <li key={entry.section} className="hidden px-3 pb-1 pt-4 md:block">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-silver/60">
                      {entry.section}
                    </span>
                  </li>
                )
              );
            }

            const Icon = entry.icon;
            const active = isActive(entry.href);

            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  title={collapsed ? entry.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
                    active
                      ? "bg-signature-gold/15 text-signature-gold"
                      : "text-muted-silver hover:bg-charcoal hover:text-ivory"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="hidden md:inline">{entry.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="hidden border-t border-antique-gold/15 p-4 md:block">
          <p className="text-[10px] uppercase tracking-widest text-muted-silver/50">
            Admin Portal
          </p>
        </div>
      )}
    </aside>
  );
}
