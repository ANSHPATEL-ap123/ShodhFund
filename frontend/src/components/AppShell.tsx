"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { getUser, logout, viewRole } from "@/lib/session";
import type { Role, User } from "@/lib/types";
import {
  LayoutDashboard, FolderKanban, Receipt, FileText, Flag, Bell, HelpCircle,
  ShieldCheck, PieChart, Building2, ClipboardList, History, AlertTriangle, Wallet, BookOpen, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";

const nav: Record<Role, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  PI: [
    { href: "/dashboard/pi", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/pi/grants", label: "My Grants", icon: FolderKanban },
    { href: "/dashboard/pi/expenses", label: "Expenses", icon: Receipt },
    { href: "/pi/uc-generator", label: "Utilization Cert.", icon: FileText },
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
  const [collapsed, setCollapsed] = useState(false);
  const [notifPulse, setNotifPulse] = useState(true);
  const color = accent[role];
  const items = nav[role];

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    const t = setTimeout(() => setNotifPulse(false), 4000);
    return () => clearTimeout(t);
  }, [router]);

  const sidebarW = collapsed ? "w-[68px]" : "w-[248px]";

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className={`${sidebarW} bg-white border-r border-border flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] relative`}>
        <div className="h-16 px-4 flex items-center border-b border-border">
          <Logo size={24} />
        </div>
        <nav className="p-2 flex-1 space-y-0.5 mt-1">
          {items.map((i, idx) => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] group relative overflow-hidden animate-fade-in"
                style={{
                  animationDelay: `${idx * 40}ms`,
                  background: active ? `${color}14` : "transparent",
                  color: active ? color : "#425466",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {/* Active indicator bar */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: color }}
                  />
                )}
                <i.icon className={`w-[18px] h-[18px] transition-transform duration-200 ${!active ? "group-hover:scale-110" : ""}`} />
                {!collapsed && <span className="truncate">{i.label}</span>}
                {/* Hover background */}
                {!active && (
                  <span className="absolute inset-0 rounded-lg bg-surface opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-2 mb-1 p-2 rounded-lg text-muted hover:bg-surface hover:text-ink transition-colors duration-150 flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className="p-2 border-t border-border space-y-0.5">
          <Link href="/select-role" className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink-2 rounded-lg hover:bg-surface transition-colors duration-150">
            <HelpCircle className="w-4 h-4" />
            {!collapsed && "Switch role"}
          </Link>
          <button
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink-2 w-full rounded-lg hover:bg-surface transition-colors duration-150"
            onClick={() => { logout(); router.push("/login"); }}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm text-muted animate-fade-in">
            Viewing as <span className="font-medium text-ink">{role}</span>
            {user && viewRole() !== user.role && <span className="text-[11px] text-muted ml-1">(demo switch)</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="badge text-white animate-fade-in" style={{ background: color }}>{role}</span>
            <button className={`relative p-2 rounded-lg hover:bg-surface transition-colors duration-150 ${notifPulse ? "animate-pulse" : ""}`}>
              <Bell className="w-4 h-4 text-muted" />
              {notifPulse && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />}
            </button>
            <div className="w-8 h-8 rounded-full text-white text-xs flex items-center justify-center font-medium transition-transform duration-200 hover:scale-110" style={{ background: color }}>
              {(user?.name || "U").split(" ").slice(-1)[0][0]}
            </div>
            {!collapsed && (
              <div className="text-right hidden sm:block animate-fade-in">
                <div className="text-[13px] font-medium leading-4">{user?.name || "…"}</div>
                <div className="text-[11px] text-muted">{user?.dept}</div>
              </div>
            )}
          </div>
        </header>
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

export function Stat({ label, value, icon: Icon, trend }: { label: string; value: string; icon?: typeof LayoutDashboard; trend?: string }) {
  return (
    <div className="card card-hover p-4 animate-fade-in-scale group">
      <div className="flex items-start justify-between">
        <div className="text-[12px] text-muted font-medium">{label}</div>
        {Icon && <Icon className="w-4 h-4 text-muted/50 group-hover:text-muted transition-colors duration-200" />}
      </div>
      <div className="text-[24px] font-semibold tabular mt-1 tracking-tight animate-count">{value}</div>
      {trend && (
        <div className={`text-[11px] mt-1 font-medium ${trend.startsWith("+") ? "text-success" : trend.startsWith("-") ? "text-danger" : "text-muted"}`}>
          {trend}
        </div>
      )}
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
    PASS: "bg-teal-50 text-teal-800",
    FAIL: "bg-rose-50 text-rose-800",
    WARN: "bg-amber-50 text-amber-800",
  };
  return (
    <span className={`badge ${map[s] || "bg-slate-100"} transition-all duration-200`}>
      {String(s).replaceAll("_", " ")}
    </span>
  );
}
