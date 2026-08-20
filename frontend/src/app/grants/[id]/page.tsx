"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { budgetHeads, expenses, grants, inr } from "@/lib/data";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function GrantDetail() {
  const { id } = useParams<{ id: string }>();
  const g = grants.find((x) => x.id === id) || grants[0];
  const [tab, setTab] = useState("Overview");
  const pct = Math.round((g.spent / g.amount) * 100);

  return (
    <AppShell role="PI">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{g.title}</h1>
            <StatusChip s={g.status} />
          </div>
          <p className="text-sm text-muted font-mono mt-1">{g.id} · {g.agency} · PI {g.pi}</p>
        </div>
      </div>
      <div className="flex gap-4 mt-6 border-b border-border text-sm">
        {["Overview", "Financials", "Milestones", "Documents", "Communications"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-2 ${tab === t ? "border-b-2 border-black font-medium" : "text-muted"}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Stat label="Sanctioned" value={inr(g.amount)} />
        <Stat label="Spent" value={inr(g.spent)} />
        <Stat label="Balance" value={inr(g.amount - g.spent)} />
        <Stat label="Utilization" value={`${pct}%`} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-medium mb-4">Budget head-wise utilization</h3>
          {budgetHeads.map((b) => {
            const p = Math.round((b.spent / b.allocated) * 100);
            return (
              <div key={b.name} className="mb-3">
                <div className="flex justify-between text-[12px] mb-1">
                  <span>{b.name}</span>
                  <span className="tabular">{inr(b.spent)} / {inr(b.allocated)}</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full"><div className="h-2 bg-[#1E40AF] rounded-full" style={{ width: `${p}%` }} /></div>
              </div>
            );
          })}
          <table className="w-full text-[13px] mt-6">
            <thead className="text-muted text-left"><tr><th className="pb-2">Recent expenses</th><th>Head</th><th>Amount</th><th></th></tr></thead>
            <tbody>
              {expenses.filter((e) => e.grant === g.id || true).slice(0, 5).map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="py-2">{e.vendor}<div className="text-[11px] text-muted">{e.invoice}</div></td>
                  <td>{e.head}</td>
                  <td className="tabular">{inr(e.amount)}</td>
                  <td><StatusChip s={e.compliance} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-5">
          <h3 className="font-medium mb-3">Activity</h3>
          {["Sanction letter ingested", "Budget heads allocated", "Expense EXP-1042 submitted", "Anomaly AN-01 flagged", "UC draft requested"].map((a, i) => (
            <div key={a} className="flex gap-3 py-2 text-[13px]">
              <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5" />
              <div>
                <div>{a}</div>
                <div className="text-[11px] text-muted">{i + 1}d ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
