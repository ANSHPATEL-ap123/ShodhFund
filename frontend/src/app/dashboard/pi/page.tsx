"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { expenses, grants, inr } from "@/lib/data";
import { AddExpense } from "@/components/AddExpense";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";

const trend = [
  { m: "Jan", u: 42 }, { m: "Feb", u: 48 }, { m: "Mar", u: 51 }, { m: "Apr", u: 55 },
  { m: "May", u: 59 }, { m: "Jun", u: 63 }, { m: "Jul", u: 68 },
];

export default function PIDashboard() {
  const mine = grants.filter((g) => g.pi === "Dr. Arjun Sharma");
  return (
    <AppShell role="PI">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Dr. Arjun!</h1>
          <p className="text-sm text-ink-2 mt-1">3 active grants · next UC due 31 Aug 2026</p>
        </div>
        <AddExpense />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active Grants" value="5" />
        <Stat label="Total Sanctioned" value="₹2.45 Cr" />
        <Stat label="Total Spent" value="₹1.67 Cr" />
        <Stat label="Utilization" value="68.2%" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">My Grants</h3>
            <Link href="/dashboard/pi/grants" className="text-xs text-info">View all</Link>
          </div>
          <table className="w-full text-[13px]">
            <thead className="text-muted text-left">
              <tr><th className="pb-2">Grant</th><th>Agency</th><th>UC due</th></tr>
            </thead>
            <tbody>
              {mine.map((g) => (
                <tr key={g.id} className="border-t border-border">
                  <td className="py-3">
                    <Link href={`/grants/${g.id}`} className="font-medium hover:underline">{g.title}</Link>
                    <div className="text-[11px] text-muted font-mono">{g.id}</div>
                  </td>
                  <td>{g.agency}</td>
                  <td className="tabular">{g.ucDue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-3">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between text-[13px]">
                <div>
                  <div className="font-medium">{e.vendor}</div>
                  <div className="text-[11px] text-muted">{e.head} · {e.date}</div>
                </div>
                <div className="text-right">
                  <div className="tabular font-medium">{inr(e.amount)}</div>
                  <StatusChip s={e.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5 h-[280px]">
          <h3 className="font-medium mb-3">Utilization Trend</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trend}>
              <CartesianGrid stroke="#E6EBF1" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="u" stroke="#1E40AF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-3">Upcoming UCs</h3>
          {mine.slice(0, 2).map((g) => (
            <div key={g.id} className="flex justify-between py-3 border-b border-border text-[13px]">
              <div>
                <div className="font-medium">{g.agency}</div>
                <div className="text-muted text-xs">{g.title}</div>
              </div>
              <div className="text-right">
                <div className="tabular">{g.ucDue}</div>
                <Link href="/pi/uc-generator" className="text-xs text-info">Generate</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-5 mt-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-pi">AI Insights</div>
          <p className="text-sm mt-1">Based on your spending pattern, you might save up to ₹5.2 Lakhs by better budget planning.</p>
        </div>
        <button className="btn-black shrink-0">View AI Insights</button>
      </div>
    </AppShell>
  );
}
