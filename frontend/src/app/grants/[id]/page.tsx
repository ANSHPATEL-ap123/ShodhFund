"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { inr, type BudgetHead, type Expense, type Grant } from "@/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Detail = Grant & { budgetHeads: BudgetHead[]; expenses: Expense[]; milestones: { id: string; title: string; dueDate: string; status: string }[] };

export default function GrantDetail() {
  const { id } = useParams<{ id: string }>();
  const [g, setG] = useState<Detail | null>(null);
  const [tab, setTab] = useState("Overview");
  const [err, setErr] = useState("");

  useEffect(() => {
    api<Detail>(`/api/grants/${id}`).then(setG).catch((e) => setErr(String(e.message)));
  }, [id]);

  if (err) return <AppShell role="PI"><p className="text-danger">{err}</p></AppShell>;
  if (!g) return <AppShell role="PI"><p className="text-muted">Loading…</p></AppShell>;
  const pct = g.amount ? Math.round((g.spent / g.amount) * 100) : 0;

  return (
    <AppShell role="PI">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{g.title}</h1>
        <StatusChip s={g.status} />
      </div>
      <p className="text-sm text-muted font-mono mt-1">{g.id} · {g.agency} · PI {g.pi}</p>
      <div className="flex gap-4 mt-6 border-b border-border text-sm">
        {["Overview", "Financials", "Milestones"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-2 ${tab === t ? "border-b-2 border-black font-medium" : "text-muted"}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Stat label="Sanctioned" value={inr(g.amount)} />
        <Stat label="Spent" value={inr(g.spent)} />
        <Stat label="Balance" value={inr(g.amount - g.spent)} />
        <Stat label="Utilization" value={`${pct}%`} />
      </div>
      {tab !== "Milestones" ? (
        <div className="card p-5 mt-4">
          <h3 className="font-medium mb-4">Budget heads</h3>
          {g.budgetHeads.map((b) => {
            const p = b.allocated ? Math.round((b.spent / b.allocated) * 100) : 0;
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
            <thead className="text-muted text-left"><tr><th className="pb-2">Expense</th><th>Head</th><th>Amount</th><th></th></tr></thead>
            <tbody>
              {g.expenses.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="py-2">{e.vendor}<div className="text-[11px] text-muted">{e.invoice}</div></td>
                  <td>{e.head}</td>
                  <td className="tabular">{inr(e.amount)}</td>
                  <td><StatusChip s={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-5 mt-4">
          {g.milestones.map((m) => (
            <div key={m.id} className="flex justify-between py-3 border-b border-border text-sm">
              <span>{m.title}</span>
              <span className="flex items-center gap-2"><span className="text-muted tabular">{m.dueDate}</span><StatusChip s={m.status} /></span>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
