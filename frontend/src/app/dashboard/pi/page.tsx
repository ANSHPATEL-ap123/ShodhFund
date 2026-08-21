"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { AddExpense } from "@/components/AddExpense";
import { useList } from "@/lib/useList";
import { inr, type Expense, type Grant } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getUser } from "@/lib/session";

const trend = [
  { m: "Jan", u: 42 }, { m: "Feb", u: 48 }, { m: "Mar", u: 51 }, { m: "Apr", u: 55 },
  { m: "May", u: 59 }, { m: "Jun", u: 63 }, { m: "Jul", u: 68 },
];

export default function PIDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hello, setHello] = useState("PI");
  useEffect(() => {
    const u = getUser();
    setUserId(u?.id || "u-pi");
    const nick = u?.name?.split(" ").find((p) => p && p !== "Dr.") || "PI";
    setHello(nick);
  }, []);
  const grants = useList<Grant>(userId ? `/api/grants?piId=${userId}` : "/api/grants");
  const expenses = useList<Expense>("/api/expenses");
  const [stats, setStats] = useState({ grants: 0, sanctioned: 0, spent: 0, utilization: 0 });
  useEffect(() => {
    if (!userId) return;
    api<typeof stats>(`/api/stats?role=PI&userId=${userId}`).then(setStats).catch(() => {});
  }, [userId, expenses.data.length]);

  return (
    <AppShell role="PI">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {hello}!</h1>
          <p className="text-sm text-ink-2 mt-1">Live data from backend · JSON store</p>
        </div>
        <AddExpense onCreated={() => expenses.reload()} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active Grants" value={String(stats.grants)} />
        <Stat label="Total Sanctioned" value={inr(stats.sanctioned)} />
        <Stat label="Total Spent" value={inr(stats.spent)} />
        <Stat label="Utilization" value={`${stats.utilization}%`} />
      </div>
      {grants.error && <p className="text-sm text-danger mt-3">API: {grants.error} — start backend on port 4000.</p>}
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">My Grants</h3>
            <Link href="/dashboard/pi/grants" className="text-xs text-info">View all</Link>
          </div>
          <table className="w-full text-[13px]">
            <thead className="text-muted text-left"><tr><th className="pb-2">Grant</th><th>Agency</th><th>UC due</th></tr></thead>
            <tbody>
              {grants.data.map((g) => (
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
            {expenses.data.slice(0, 5).map((e) => (
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
          {grants.data.slice(0, 3).map((g) => (
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
    </AppShell>
  );
}
