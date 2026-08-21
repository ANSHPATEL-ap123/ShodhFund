"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { getUser, logout, viewRole } from "@/lib/session";
import type { Role, User } from "@/lib/types";
import {
  LayoutDashboard, FolderKanban, Receipt, FileText, Flag, Bell, HelpCircle,
  ShieldCheck, PieChart, Building2, ClipboardList, History, AlertTriangle, Wallet, BookOpen, LogOut,
  MessageSquare, CalendarDays
} from "lucide-react";

const nav: Record<Role, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  PI: [
    { href: "/dashboard/pi", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/pi/grants", label: "My Grants", icon: FolderKanban },
    { href: "/dashboard/pi/expenses", label: "Expenses", icon: Receipt },
    { href: "/pi/uc-generator", label: "Utilization Cert.", icon: FileText },
    { href: "/dashboard/pi/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/dashboard/pi/ask", label: "Ask", icon: MessageSquare },
    { href: "/dashboard/pi/milestones", label: "Milestones", icon: Flag },
    { href: "/dashboard/pi/reports", label: "Reports", icon: PieChart },
    { href: "/dashboard/pi/notifications", label: "Notifications", icon: Bell },
  ],
  FINANCE: [
    { href: "/dashboard/finance", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/finance/grants", label: "Grant Management", icon: FolderKanban },
    { href: "/dashboard/finance/verify", label: "Expense Verification", icon: ShieldCheck },
    { href: "/dashboard/finance/budget", label: "Budget Allocation", icon: Wallet },
    { href: "/dashboard/finance/uc", label: "UC Verification", icon: FileText },
    { href: "/dashboard/finance/anomalies", label: "Alerts", icon: AlertTriangle },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/grants", label: "All Grants", icon: FolderKanban },
    { href: "/dashboard/admin/departments", label: "Departments", icon: Building2 },
    { href: "/dashboard/admin/nirf", label: "NIRF Reports", icon: BookOpen },
    { href: "/dashboard/admin/reports", label: "Analytics", icon: PieChart },
    { href: "/dashboard/admin/settings", label: "Settings", icon: ShieldCheck },
  ],
  AUDITOR: [
    { href: "/dashboard/auditor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/auditor/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/dashboard/auditor/compliance", label: "Compliance Review", icon: ShieldCheck },
    { href: "/dashboard/auditor/trail", label: "Audit Trail", icon: History },
    { href: "/dashboard/auditor/objections", label: "Objections", icon: AlertTriangle },
  ],
};

const accent: Record<Role, string> = { PI: "#1E40AF", FINANCE: "#0F766E", ADMIN: "#6D28D9", AUDITOR: "#C2410C" };

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const color = accent[role];
  const items = nav[role];

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    fetch(`/api/notifications?userId=${u.id}`)
      .then((r) => r.json())
      .then((rows: { read?: boolean }[]) => setUnread(Array.isArray(rows) ? rows.filter((n) => !n.read).length : 0))
      .catch(() => {});
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-[248px] bg-white border-r border-border flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-border">
          <Logo size={24} />
        </div>
        <nav className="p-3 flex-1 space-y-0.5">
          {items.map((i) => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px]"
                style={active ? { background: `${color}14`, color, fontWeight: 600 } : { color: "#425466" }}
              >
                <i.icon className="w-4 h-4" />
                {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-0.5">
          <Link href="/select-role" className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink-2">
            <HelpCircle className="w-4 h-4" /> Switch role
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink-2 w-full"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between">
          <div className="text-sm text-muted">Viewing as {role}{user && viewRole() !== user.role ? " (demo switch)" : ""}</div>
          <div className="flex items-center gap-3">
            <span className="badge text-white" style={{ background: color }}>{role}</span>
            <Link href={role === "PI" ? "/dashboard/pi/notifications" : "/dashboard/finance/anomalies"} className="relative">
              <Bell className="w-4 h-4 text-muted" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#C8F135] text-[9px] font-semibold text-black flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
            <div className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center">
              {(user?.name || "U").split(" ").slice(-1)[0][0]}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[13px] font-medium leading-4">{user?.name || "…"}</div>
              <div className="text-[11px] text-muted">{user?.dept}</div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-[12px] text-muted">{label}</div>
      <div className="text-[24px] font-semibold tabular mt-1 tracking-tight">{value}</div>
    </div>
  );
}

export function StatusChip({ s }: { s: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-teal-50 text-teal-800",
    COMPLIANT: "bg-teal-50 text-teal-800",
    SUBMITTED: "bg-blue-50 text-blue-800",
    ACTIVE: "bg-blue-50 text-blue-800",
    WARNING: "bg-amber-50 text-amber-800",
    CORRECTION_REQUESTED: "bg-amber-50 text-amber-800",
    NON_COMPLIANT: "bg-rose-50 text-rose-800",
    REJECTED: "bg-rose-50 text-rose-800",
    HIGH: "bg-rose-50 text-rose-800",
    MEDIUM: "bg-amber-50 text-amber-800",
    LOW: "bg-slate-100 text-slate-700",
    DRAFT: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-50 text-blue-800",
    DELAYED: "bg-rose-50 text-rose-800",
    PENDING: "bg-amber-50 text-amber-800",
    OPEN: "bg-amber-50 text-amber-800",
  };
  return <span className={`badge ${map[s] || "bg-slate-100"}`}>{String(s).replaceAll("_", " ")}</span>;
}


