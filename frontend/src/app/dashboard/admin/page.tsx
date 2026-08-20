"use client";
import { AppShell, Stat } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { inr, type Grant } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const trend = [
  { m: "Jan", v: 54 }, { m: "Feb", v: 57 }, { m: "Mar", v: 59 }, { m: "Apr", v: 61 }, { m: "May", v: 64 }, { m: "Jun", v: 66 }, { m: "Jul", v: 67 },
];

export default function AdminDash() {
  const grants = useList<Grant>("/api/grants");
  const [stats, setStats] = useState({ grants: 0, sanctioned: 0, spent: 0, utilization: 0, departments: 0 });
  useEffect(() => { api<typeof stats>("/api/stats").then(setStats).catch(() => {}); }, [grants.data]);
  const depts = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of grants.data) map.set(g.department, (map.get(g.department) || 0) + g.amount);
    const colors = ["#6D28D9", "#1E40AF", "#0F766E", "#C2410C", "#697386"];
    return [...map.entries()].map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }));
  }, [grants.data]);

  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">University research office</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Grants" value={String(stats.grants)} />
        <Stat label="Funding" value={inr(stats.sanctioned)} />
        <Stat label="Utilization" value={`${stats.utilization}%`} />
        <Stat label="Departments" value={String(stats.departments)} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5 h-[280px]">
          <h3 className="font-medium">Funding by Department</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={depts} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {depts.map((d) => <Cell key={d.name} fill={d.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-[280px]">
          <h3 className="font-medium">Grant progress</h3>
          <ResponsiveContainer>
            <LineChart data={trend}>
              <CartesianGrid stroke="#E6EBF1" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke="#6D28D9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
