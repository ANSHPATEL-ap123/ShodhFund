"use client";
import { AppShell, Stat } from "@/components/AppShell";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const depts = [
  { name: "Biotech", value: 28, fill: "#6D28D9" },
  { name: "Chem", value: 18, fill: "#1E40AF" },
  { name: "CS", value: 22, fill: "#0F766E" },
  { name: "Physics", value: 16, fill: "#C2410C" },
  { name: "Other", value: 16, fill: "#697386" },
];
const trend = [
  { m: "Jan", v: 54 }, { m: "Feb", v: 57 }, { m: "Mar", v: 59 }, { m: "Apr", v: 61 }, { m: "May", v: 64 }, { m: "Jun", v: 66 }, { m: "Jul", v: 67 },
];

export default function AdminDash() {
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">University research office</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Grants" value="256" />
        <Stat label="Funding" value="₹102.3 Cr" />
        <Stat label="Utilization" value="66.7%" />
        <Stat label="Departments" value="42" />
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
        <div className="card p-5">
          <h3 className="font-medium mb-4">Milestone Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["On Track", "142", "#0D9488"],
              ["At Risk", "28", "#D97706"],
              ["Delayed", "11", "#E11D48"],
              ["Completed", "75", "#1E40AF"],
            ].map(([l, n, c]) => (
              <div key={l} className="border border-border rounded-xl p-4">
                <div className="text-xs text-muted">{l}</div>
                <div className="text-2xl font-semibold mt-1" style={{ color: c as string }}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-5">
          <h3 className="font-medium">NIRF Research Metrics</h3>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div><div className="text-3xl font-semibold tabular">82.4</div><div className="text-xs text-muted">Score / 100</div></div>
            <div><div className="text-3xl font-semibold tabular">32</div><div className="text-xs text-muted">University rank</div></div>
            <div><div className="text-3xl font-semibold tabular">58</div><div className="text-xs text-muted">National rank</div></div>
          </div>
        </div>
        <div className="card p-5 h-[220px]">
          <h3 className="font-medium">Grant Progress Overview</h3>
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
