"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Anomaly, type BudgetHead, type Expense } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const monthly = [
  { m: "Feb", v: 2.1 }, { m: "Mar", v: 2.8 }, { m: "Apr", v: 3.1 }, { m: "May", v: 2.4 }, { m: "Jun", v: 3.6 }, { m: "Jul", v: 4.1 },
];

export default function FinanceDash() {
  const expenses = useList<Expense>("/api/expenses");
  const anomalies = useList<Anomaly>("/api/anomalies");
  const heads = useList<BudgetHead>("/api/budget-heads");
  const [stats, setStats] = useState({ grants: 0, sanctioned: 0, spent: 0, utilization: 0, pendingExpenses: 0 });
  useEffect(() => {
    api<typeof stats>("/api/stats").then(setStats).catch(() => {});
  }, [expenses.data]);

  const pie = [
    { name: "High", value: anomalies.data.filter((a) => a.severity === "HIGH" && !a.resolved).length || 1, fill: "#E11D48" },
    { name: "Med", value: anomalies.data.filter((a) => a.severity === "MEDIUM").length || 1, fill: "#D97706" },
    { name: "Queue", value: expenses.data.filter((e) => e.status === "SUBMITTED").length || 1, fill: "#0D9488" },
  ];

  return (
    <AppShell role="FINANCE">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Finance operations</h1>
        <Link href="/dashboard/finance/verify" className="btn-black text-sm">Open verification queue</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active Grants" value={String(stats.grants)} />
        <Stat label="Total Funding" value={inr(stats.sanctioned)} />
        <Stat label="Verified Spent" value={inr(stats.spent)} />
        <Stat label="Avg Utilization" value={`${stats.utilization}%`} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <h3 className="font-medium mb-2">Expense Verification Queue</h3>
          <div className="h-[160px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={45} outerRadius={70}>
                  {pie.map((p) => <Cell key={p.name} fill={p.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {expenses.data.filter((e) => e.status === "SUBMITTED").map((e) => (
            <div key={e.id} className="flex justify-between text-[13px] border-t border-border py-2">
              <span>{e.vendor}</span>
              <span className="tabular">{inr(e.amount)}</span>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-4">Budget heads (all grants)</h3>
          {["Equipment", "Consumables", "Travel", "Contingency"].map((name) => {
            const rows = heads.data.filter((b) => b.name === name);
            const allocated = rows.reduce((s, b) => s + b.allocated, 0) || 1;
            const spent = rows.reduce((s, b) => s + b.spent, 0);
            const pct = Math.min(100, Math.round((spent / allocated) * 100));
            return (
              <div key={name} className="mb-3">
                <div className="flex justify-between text-[12px] mb-1"><span>{name}</span><span className="tabular text-muted">{pct}%</span></div>
                <div className="h-2 bg-surface-2 rounded-full"><div className="h-2 bg-[#0F766E] rounded-full" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5 h-[260px]">
          <h3 className="font-medium mb-2">Monthly Expenditure (₹ Cr)</h3>
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid stroke="#E6EBF1" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="v" fill="#0F766E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-medium">AI Anomalies</h3>
          <div className="mt-3 space-y-3">
            {anomalies.data.filter((a) => !a.resolved).map((a) => (
              <div key={a.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <StatusChip s={a.severity} />
                  <span className="text-[11px] font-mono text-muted">{a.expenseId}</span>
                </div>
                <p className="text-[13px] text-ink-2">{a.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
