"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { AddExpense } from "@/components/AddExpense";
import { useList } from "@/lib/useList";
import { inr, type Expense } from "@/lib/types";

export default function Page() {
  const { data, reload, error } = useList<Expense>("/api/expenses");
  return (
    <AppShell role="PI">
      <div className="flex justify-between mb-4"><h1 className="text-2xl font-semibold">Expenses</h1><AddExpense onCreated={reload} /></div>
      {error && <p className="text-danger text-sm mb-2">{error}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["ID", "Vendor", "Head", "Amount", "Status", "GFR"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{e.id}</td>
                <td className="px-4 py-3">{e.vendor}<div className="text-[11px] text-muted">{e.invoice}</div></td>
                <td className="px-4 py-3">{e.head}</td>
                <td className="px-4 py-3 tabular">{inr(e.amount)}</td>
                <td className="px-4 py-3"><StatusChip s={e.status} /></td>
                <td className="px-4 py-3"><StatusChip s={e.compliance} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
