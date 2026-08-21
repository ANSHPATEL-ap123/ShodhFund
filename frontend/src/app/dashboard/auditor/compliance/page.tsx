"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Expense } from "@/lib/types";
export default function P() {
  const { data } = useList<Expense>("/api/expenses");
  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold mb-4">Compliance Review</h1>
      <div className="card overflow-hidden">
        {data.length === 0 ? (
          <p className="p-6 text-sm text-ink-2">No expenses to review.</p>
        ) : (
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Expense", "Vendor", "Amount", "GFR"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-xs">{e.id}</td>
                <td className="px-4 py-2">{e.vendor}</td>
                <td className="px-4 py-2 tabular">{inr(e.amount)}</td>
                <td className="px-4 py-2"><StatusChip s={e.compliance} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </AppShell>
  );
}