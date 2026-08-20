"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { anomalies, budgetHeads, expenses, inr } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const pie = [
  { name: "High", value: 8, fill: "#E11D48" },
  { name: "Medium", value: 14, fill: "#D97706" },
  { name: "Low", value: 22, fill: "#0D9488" },
];
const monthly = [
  { m: "Feb", v: 2.1 }, { m: "Mar", v: 2.8 }, { m: "Apr", v: 3.1 }, { m: "May", v: 2.4 }, { m: "Jun", v: 3.6 }, { m: "Jul", v: 4.1 },
];

export default function FinanceDash() {
  return (
    <AppShell role="FINANCE">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Finance operations</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active Grants" value="128" />
        <Stat label="Total Funding" value="₹48.72 Cr" />
        <Stat label="Verified Spent" value="₹33.25 Cr" />
        <Stat label="Avg Utilization" value="68.1%" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <h3 className="font-medium mb-2">Expense Verification Queue</h3>
          <div className="h-[180px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={50} outerRadius={75}>
                  {pie.map((p) => <Cell key={p.name} fill={p.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {expenses.filter((e) => e.status === "SUBMITTED").map((e) => (
              <div key={e.id} className="flex justify-between text-[13px] border-t border-border py-2">
                <span>{e.vendor}</span>
                <span className="tabular">{inr(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-4">Budget Head Summary</h3>
          {budgetHeads.map((b) => {
            const pct = Math.round((b.spent / b.allocated) * 100);
            return (
              <div key={b.name} className="mb-3">
                <div className="flex justify-between text-[12px] mb-1">
                  <span>{b.name}</span>
                  <span className="tabular text-muted">{pct}%</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full">
                  <div className="h-2 bg-[#0F766E] rounded-full" style={{ width: `${pct}%` }} />
                </div>
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
          <div className="flex justify-between">
            <h3 className="font-medium">AI Anomalies</h3>
            <span className="text-xs text-muted">Pending UCs: 16</span>
          </div>
          <div className="mt-3 space-y-3">
            {anomalies.map((a) => (
              <div key={a.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <StatusChip s={a.severity} />
                  <span className="text-[11px] font-mono text-muted">{a.expense}</span>
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
