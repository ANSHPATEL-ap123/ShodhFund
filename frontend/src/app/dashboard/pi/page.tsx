"use client";

import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { AddExpense } from "@/components/AddExpense";
import { useList } from "@/lib/useList";
import { inr, type Expense, type Grant } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getUser } from "@/lib/session";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  FileCheck2,
  IndianRupee,
  Landmark,
  TrendingUp,
  Wallet,
  Sparkles,
  Clock3,
  CircleCheck,
} from "lucide-react";

const trend = [
  { m: "Jan", u: 42 },
  { m: "Feb", u: 48 },
  { m: "Mar", u: 51 },
  { m: "Apr", u: 55 },
  { m: "May", u: 59 },
  { m: "Jun", u: 63 },
  { m: "Jul", u: 68 },
];

export default function PIDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hello, setHello] = useState("PI");

  useEffect(() => {
    const u = getUser();

    setUserId(u?.id || "u-pi");

    const nick =
      u?.name?.split(" ").find((p) => p && p !== "Dr.") || "PI";

    setHello(nick);
  }, []);

  const grants = useList<Grant>(
    userId ? `/api/grants?piId=${userId}` : "/api/grants"
  );

  const expenses = useList<Expense>("/api/expenses");

  const [stats, setStats] = useState({
    grants: 0,
    sanctioned: 0,
    spent: 0,
    utilization: 0,
  });

  useEffect(() => {
    if (!userId) return;

    api<typeof stats>(`/api/stats?role=PI&userId=${userId}`)
      .then(setStats)
      .catch(() => {});
  }, [userId, expenses.data.length]);

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />
        <div className="pointer-events-none absolute top-64 -left-32 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative">
          {/* =========================================================
              HEADER
          ========================================================= */}
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between mb-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#9ACF00]" />
                <span className="text-[11px] font-medium text-ink-2">
                  ShodhFund Workspace
                </span>
              </div>

              <h1 className="mt-4 text-[30px] sm:text-[34px] font-semibold tracking-[-0.035em] text-[#071C2C]">
                Good to see you, {hello}.
                <span className="ml-2">👋</span>
              </h1>

              <p className="mt-2 text-sm text-ink-2">
                Here's your research funding overview for today.
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">
                <span className="flex h-2 w-2 rounded-full bg-[#A8E500] shadow-[0_0_0_3px_rgba(168,229,0,0.12)]" />
                Live data from backend · JSON store
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/pi/grants"
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#B7F51A] hover:shadow-md"
              >
                View grants
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <AddExpense onCreated={() => expenses.reload()} />
            </div>
          </div>

          {/* =========================================================
              KPI CARDS
          ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Grants */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-[0_6px_24px_rgba(7,28,44,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(7,28,44,0.08)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-50 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Active Grants
                  </div>

                  <div className="mt-3 text-[28px] font-semibold tracking-tight text-[#071C2C]">
                    {stats.grants}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#2146C7]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Active research portfolio
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2146C7]">
                  <Landmark className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Sanctioned */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-[0_6px_24px_rgba(7,28,44,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(7,28,44,0.08)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#B7F51A]/10 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Total Sanctioned
                  </div>

                  <div className="mt-3 text-[28px] font-semibold tracking-tight text-[#071C2C]">
                    {inr(stats.sanctioned)}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#739700]">
                    <CircleCheck className="h-3.5 w-3.5" />
                    Approved funding
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2FFD1] text-[#779900]">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Spent */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-[0_6px_24px_rgba(7,28,44,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(7,28,44,0.08)]">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-teal-50 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    Total Spent
                  </div>

                  <div className="mt-3 text-[28px] font-semibold tracking-tight text-[#071C2C]">
                    {inr(stats.spent)}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#12877D]">
                    <Wallet className="h-3.5 w-3.5" />
                    Recorded expenses
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#12877D]">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Utilization */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-[#071C2C] p-5 shadow-[0_8px_28px_rgba(7,28,44,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(7,28,44,0.18)]">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#B7F51A]/10 blur-2xl" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
                    Utilization
                  </div>

                  <div className="mt-3 text-[28px] font-semibold tracking-tight text-white">
                    {stats.utilization}%
                  </div>

                  <div className="mt-2 text-[11px] text-[#B7F51A]">
                    Current fund utilization
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B7F51A] text-[#071C2C]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#B7F51A] transition-all duration-700"
                  style={{
                    width: `${Math.min(stats.utilization, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {grants.error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
              API: {grants.error} — start backend on port 4000.
            </div>
          )}

          {/* =========================================================
              GRANTS + EXPENSES
          ========================================================= */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            {/* Grants */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_6px_24px_rgba(7,28,44,0.04)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#2146C7]">
                      <Landmark className="h-4 w-4" />
                    </div>

                    <h3 className="font-semibold text-[#071C2C]">
                      My Grants
                    </h3>
                  </div>

                  <p className="mt-1 text-[11px] text-muted">
                    Your active research funding portfolio
                  </p>
                </div>

                <Link
                  href="/dashboard/pi/grants"
                  className="group flex items-center gap-1 text-xs font-medium text-[#2146C7]"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border bg-[#F8FAFC] text-left">
                      <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                        Grant
                      </th>
                      <th className="px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                        Agency
                      </th>
                      <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                        UC Due
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {grants.data.map((g) => (
                      <tr
                        key={g.id}
                        className="group border-b border-border last:border-0 transition-colors hover:bg-[#F8FAFC]"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/grants/${g.id}`}
                            className="block font-medium text-[#071C2C] transition-colors group-hover:text-[#2146C7]"
                          >
                            {g.title}
                          </Link>

                          <div className="mt-1 text-[10px] font-mono text-muted">
                            {g.id}
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <span className="inline-flex rounded-full bg-[#EEF4FF] px-2.5 py-1 text-[10px] font-medium text-[#2146C7]">
                            {g.agency}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium tabular text-[#071C2C]">
                            <CalendarDays className="h-3.5 w-3.5 text-muted" />
                            {g.ucDue}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_6px_24px_rgba(7,28,44,0.04)]">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF9F7] text-[#12877D]">
                    <Wallet className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#071C2C]">
                      Recent Expenses
                    </h3>

                    <p className="mt-0.5 text-[11px] text-muted">
                      Latest activity across your grants
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border">
                {expenses.data.slice(0, 5).map((e) => (
                  <div
                    key={e.id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium text-[#071C2C]">
                        {e.vendor}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
                        <span>{e.head}</span>
                        <span>·</span>
                        <span>{e.date}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-[13px] font-semibold tabular text-[#071C2C]">
                        {inr(e.amount)}
                      </div>

                      <div className="mt-1">
                        <StatusChip s={e.status} />
                      </div>
                    </div>
                  </div>
                ))}

                {expenses.data.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-muted">
                    No recent expenses found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              ANALYTICS + UPCOMING UC
          ========================================================= */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            {/* Utilization Chart */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_6px_24px_rgba(7,28,44,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F7FF] text-[#2146C7]">
                      <TrendingUp className="h-4 w-4" />
                    </div>

                    <h3 className="font-semibold text-[#071C2C]">
                      Utilization Trend
                    </h3>
                  </div>

                  <p className="mt-1 text-[11px] text-muted">
                    Fund utilization over the current financial period
                  </p>
                </div>

                <div className="rounded-full bg-[#F2FFD1] px-3 py-1 text-[11px] font-semibold text-[#719300]">
                  {stats.utilization}% utilized
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trend}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="utilizationGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2146C7"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="#2146C7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#E8EDF2"
                      vertical={false}
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="m"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8290A0",
                      }}
                    />

                    <YAxis
                      domain={[0, 80]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8290A0",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E6EBF1",
                        boxShadow: "0 8px 25px rgba(7,28,44,0.10)",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [`${value}%`, "Utilization"]}
                    />

                    <Area
                      type="monotone"
                      dataKey="u"
                      stroke="#2146C7"
                      strokeWidth={2.5}
                      fill="url(#utilizationGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        strokeWidth: 3,
                        stroke: "#fff",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="u"
                      stroke="#2146C7"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming UCs */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_6px_24px_rgba(7,28,44,0.04)]">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3EEFF] text-[#7131D9]">
                      <FileCheck2 className="h-4 w-4" />
                    </div>

                    <h3 className="font-semibold text-[#071C2C]">
                      Upcoming UCs
                    </h3>
                  </div>

                  <p className="mt-1 text-[11px] text-muted">
                    Utilization certificates requiring attention
                  </p>
                </div>

                <Clock3 className="h-4 w-4 text-muted" />
              </div>

              <div>
                {grants.data.slice(0, 3).map((g, index) => (
                  <div
                    key={g.id}
                    className="group flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-0 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            index === 0
                              ? "bg-[#B7F51A]"
                              : index === 1
                              ? "bg-[#2146C7]"
                              : "bg-[#7131D9]"
                          }`}
                        />

                        <span className="text-xs font-semibold text-[#071C2C]">
                          {g.agency}
                        </span>
                      </div>

                      <div className="mt-1 truncate text-[11px] text-muted">
                        {g.title}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="flex items-center justify-end gap-1 text-[11px] font-medium tabular text-[#071C2C]">
                        <CalendarDays className="h-3 w-3 text-muted" />
                        {g.ucDue}
                      </div>

                      <Link
                        href="/pi/uc-generator"
                        className="group/link mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#2146C7]"
                      >
                        Generate
                        <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {grants.data.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-muted">
                    No upcoming UCs found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              FOOTER STATUS
          ========================================================= */}
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#DCE7D0] bg-[#F7FBEF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B7F51A] text-[#071C2C]">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <div className="text-xs font-semibold text-[#071C2C]">
                  ShodhFund AI is available
                </div>

                <div className="text-[10px] text-[#66735B]">
                  Ask the virtual assistant about grants, expenses or GFR
                  compliance.
                </div>
              </div>
            </div>

            <span className="flex items-center gap-2 text-[10px] font-medium text-[#718200]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A8E500]" />
              System operational
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}