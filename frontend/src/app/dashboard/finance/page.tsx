"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Anomaly, type BudgetHead, type Expense } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const monthly = [
  { m: "Feb", v: 2.1 },
  { m: "Mar", v: 2.8 },
  { m: "Apr", v: 3.1 },
  { m: "May", v: 2.4 },
  { m: "Jun", v: 3.6 },
  { m: "Jul", v: 4.1 },
];

export default function FinanceDash() {
  const expenses = useList<Expense>("/api/expenses");
  const anomalies = useList<Anomaly>("/api/anomalies");
  const heads = useList<BudgetHead>("/api/budget-heads");

  const [stats, setStats] = useState({
    grants: 0,
    sanctioned: 0,
    spent: 0,
    utilization: 0,
    pendingExpenses: 0,
  });

  useEffect(() => {
    api<typeof stats>("/api/stats")
      .then(setStats)
      .catch(() => {});
  }, [expenses.data]);

  const submittedExpenses = expenses.data.filter(
    (e) => e.status === "SUBMITTED"
  );

  const unresolvedAnomalies = anomalies.data.filter(
    (a) => !a.resolved
  );

  const highAnomalies = anomalies.data.filter(
    (a) => a.severity === "HIGH" && !a.resolved
  );

  const mediumAnomalies = anomalies.data.filter(
    (a) => a.severity === "MEDIUM"
  );

  const pie = [
    {
      name: "High",
      value: highAnomalies.length || 1,
      fill: "#E11D48",
    },
    {
      name: "Med",
      value: mediumAnomalies.length || 1,
      fill: "#D97706",
    },
    {
      name: "Queue",
      value: submittedExpenses.length || 1,
      fill: "#0D9488",
    },
  ];

  const budgetHeads = ["Equipment", "Consumables", "Travel", "Contingency"];

  return (
    <AppShell role="FINANCE">
      <div className="min-h-full bg-[#F4F7FB]">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-[#F0F9E8]" />

          <div className="relative px-1 pt-1 pb-7">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                {/* Workspace pill */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-[12px] font-medium text-[#475569] mb-5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D9FF38] text-[#17324D]">
                    ✦
                  </span>
                  ShodhFund Workspace
                </div>

                <h1 className="text-[34px] md:text-[40px] leading-[1.08] font-semibold tracking-[-0.035em] text-[#102A43]">
                  Finance operations{" "}
                  <span className="inline-block ml-1">👋</span>
                </h1>

                <p className="mt-3 text-[15px] text-[#64748B]">
                  Monitor funding, verify expenses and maintain financial
                  compliance.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[12px] text-[#718096]">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  Live data from backend · JSON store
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/finance/verify"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-white border border-[#DCE3EB] shadow-sm text-[14px] font-semibold text-[#17324D] hover:bg-[#F8FAFC] transition"
                >
                  Open verification queue
                  <span className="text-[17px]">↗</span>
                </Link>

                <Link
                  href="/dashboard/finance/verify"
                  className="inline-flex items-center justify-center h-11 px-5 rounded-xl bg-[#C8F51A] text-[#102A0A] text-[14px] font-bold shadow-sm hover:bg-[#B9EA0E] transition"
                >
                  + Verify expense
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Active grants */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Active grants
                </p>
                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {stats.grants}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2454D6] text-xl">
                ▥
              </div>
            </div>

            <div className="flex items-center gap-2 mt-7 text-[12px] text-[#315DCE]">
              <span>↗</span>
              <span>Active funding portfolio</span>
            </div>
          </div>

          {/* Total funding */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total funding
                </p>
                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(stats.sanctioned)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#F0FFD0] flex items-center justify-center text-[#7EA900] text-xl font-semibold">
                ₹
              </div>
            </div>

            <div className="flex items-center gap-2 mt-7 text-[12px] text-[#6C9900]">
              <span>✓</span>
              <span>Approved research funding</span>
            </div>
          </div>

          {/* Spent */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Verified spent
                </p>
                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(stats.spent)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488] text-xl">
                ▣
              </div>
            </div>

            <div className="flex items-center gap-2 mt-7 text-[12px] text-[#0D9488]">
              <span>▣</span>
              <span>Recorded verified expenses</span>
            </div>
          </div>

          {/* Utilization */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white shadow-[0_8px_24px_rgba(7,32,42,0.12)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8B9CA4]">
                  Avg utilization
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em]">
                  {stats.utilization}%
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100] text-xl">
                ↗
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[11px] text-[#A8B8BE] mb-2">
                <span>Current fund utilization</span>
                <span>{stats.utilization}%</span>
              </div>

              <div className="h-2 rounded-full bg-[#29424B] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#BDF21A] transition-all"
                  style={{
                    width: `${Math.min(100, stats.utilization)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid xl:grid-cols-[1.55fr_1fr] gap-4 mt-5">
          {/* Verification queue */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="px-5 py-4 border-b border-[#E7ECF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6]">
                  ✓
                </div>

                <div>
                  <h2 className="font-semibold text-[16px] text-[#102A43]">
                    Expense verification queue
                  </h2>
                  <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                    Expenses awaiting finance verification
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/finance/verify"
                className="text-[12px] font-semibold text-[#173F9E] flex items-center gap-1"
              >
                View all
                <span className="text-base">›</span>
              </Link>
            </div>

            <div className="grid md:grid-cols-[190px_1fr]">
              {/* Pie */}
              <div className="px-5 py-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E7ECF2]">
                <div className="h-[150px] w-[150px] relative">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pie}
                        dataKey="value"
                        innerRadius={46}
                        outerRadius={68}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {pie.map((p) => (
                          <Cell key={p.name} fill={p.fill} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[23px] font-semibold text-[#102A43]">
                      {submittedExpenses.length}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#8291A5]">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-[10px] text-[#718096]">
                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-[#E11D48]" />
                    High
                  </span>

                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-[#D97706]" />
                    Medium
                  </span>

                  <span className="flex items-center gap-1">
                    <i className="w-2 h-2 rounded-full bg-[#0D9488]" />
                    Queue
                  </span>
                </div>
              </div>

              {/* Queue list */}
              <div>
                {submittedExpenses.length === 0 ? (
                  <div className="h-full min-h-[180px] flex items-center justify-center text-[13px] text-[#8291A5]">
                    No expenses awaiting verification.
                  </div>
                ) : (
                  submittedExpenses.map((e, index) => (
                    <div
                      key={e.id}
                      className={`px-5 py-4 flex items-center justify-between gap-4 ${
                        index !== submittedExpenses.length - 1
                          ? "border-b border-[#E7ECF2]"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#18324D] truncate">
                          {e.vendor}
                        </p>

                        <p className="text-[10px] text-[#8291A5] mt-1 font-mono">
                          {e.id}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-semibold tabular text-[#102A43]">
                          {inr(e.amount)}
                        </p>

                        <span className="inline-flex mt-1 px-2 py-1 rounded-full bg-[#FFF7E8] text-[#B45D00] text-[9px] font-semibold uppercase">
                          Submitted
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Budget heads */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488]">
                ₹
              </div>

              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Budget heads
                </h2>
                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  Spending across all active grants
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {budgetHeads.map((name) => {
                const rows = heads.data.filter((b) => b.name === name);
                const allocated =
                  rows.reduce((s, b) => s + b.allocated, 0) || 1;
                const spent = rows.reduce((s, b) => s + b.spent, 0);
                const pct = Math.min(
                  100,
                  Math.round((spent / allocated) * 100)
                );

                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-medium text-[#334E68]">
                        {name}
                      </span>

                      <span className="text-[11px] font-semibold tabular text-[#6B7C91]">
                        {pct}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-[#E9EEF3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0F766E] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between mt-1.5 text-[9px] text-[#9AA7B5]">
                      <span>{inr(spent)} spent</span>
                      <span>{inr(allocated)} allocated</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid xl:grid-cols-2 gap-4 mt-4">
          {/* Monthly expenditure */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Monthly expenditure
                </h2>
                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  Spending trend · ₹ Cr
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-[#F2F7F5] text-[#0F766E] text-[10px] font-semibold">
                Feb – Jul
              </div>
            </div>

            <div className="h-[250px] mt-4">
              <ResponsiveContainer>
                <BarChart
                  data={monthly}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#E8EDF2"
                    vertical={false}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="m"
                    tick={{
                      fontSize: 11,
                      fill: "#718096",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "#718096",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                      fontSize: 12,
                    }}
                    formatter={(value) => [`₹${value} Cr`, "Expenditure"]}
                  />

                  <Bar
                    dataKey="v"
                    fill="#0F766E"
                    radius={[6, 6, 2, 2]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI anomalies */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="px-5 py-4 border-b border-[#E7ECF2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0FFD0] flex items-center justify-center text-[#6E9700]">
                  ✦
                </div>

                <div>
                  <h2 className="font-semibold text-[16px] text-[#102A43]">
                    AI anomalies
                  </h2>
                  <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                    Potential issues detected in expenses
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#FFF1F3] text-[#C61C40] text-[10px] font-semibold">
                {unresolvedAnomalies.length} open
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {unresolvedAnomalies.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-[13px] text-[#8291A5]">
                  No unresolved anomalies.
                </div>
              ) : (
                unresolvedAnomalies.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-[#E6EBF0] bg-[#FAFCFD] p-3.5 hover:bg-white transition"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <StatusChip s={a.severity} />

                        <span className="text-[10px] font-mono text-[#8291A5]">
                          {a.expenseId}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#A0ACB8]">
                        AI flagged
                      </span>
                    </div>

                    <p className="text-[12px] leading-5 text-[#40566D]">
                      {a.reason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}