"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const donut = [
  { name: "Compliant", value: 78, fill: "#0D9488" },
  { name: "Partial", value: 14, fill: "#D97706" },
  { name: "Non-compliant", value: 8, fill: "#E11D48" },
];
const cats = [
  { n: "Duplicate bills", v: 9 },
  { n: "GST mismatch", v: 6 },
  { n: "Over-cap travel", v: 5 },
  { n: "Missing UC", v: 4 },
];

export default function AuditorDash() {
  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Audit workspace</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Assignments" value="18" />
        <Stat label="Documents to Review" value="156" />
        <Stat label="Objections Raised" value="24" />
        <Stat label="Compliance Score" value="85%" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="card p-5 h-[260px]">
          <h3 className="font-medium">Compliance Overview</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={donut} dataKey="value" innerRadius={50} outerRadius={75}>
                {donut.map((d) => <Cell key={d.name} fill={d.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 h-[260px]">
          <h3 className="font-medium">Objections by category</h3>
          <ResponsiveContainer>
            <BarChart data={cats} layout="vertical">
              <CartesianGrid stroke="#E6EBF1" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="n" width={110} tick={{ fontSize: 11 }} />
              <Bar dataKey="v" fill="#C2410C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-3">GFR Checklist</h3>
          {[
            ["Rule 149 GeM", "PASS"],
            ["Rule 21 UC timely", "WARN"],
            ["GST invoice", "PASS"],
            ["Bank reconciliation", "PASS"],
            ["Asset register", "FAIL"],
          ].map(([r, s]) => (
            <div key={r} className="flex justify-between py-2 border-b border-border text-[13px]">
              <span>{r}</span>
              <StatusChip s={s === "PASS" ? "COMPLIANT" : s === "WARN" ? "WARNING" : "NON_COMPLIANT"} />
            </div>
          ))}
        </div>
      </div>
      <div className="card p-5 mt-4">
        <h3 className="font-medium mb-3">Recent Observations</h3>
        {[
          "Duplicate Thermo Fisher invoice on DST CRISPR grant — recommend recovery.",
          "Travel voucher MMT-B2B-9921 exceeds metro DA by ₹320.",
          "Asset tag missing for QuantStudio PCR listed under Equipment.",
        ].map((o) => (
          <p key={o} className="text-[13px] py-2 border-b border-border text-ink-2">{o}</p>
        ))}
      </div>
    </AppShell>
  );
}
