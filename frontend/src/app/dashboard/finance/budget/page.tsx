"use client";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type BudgetHead } from "@/lib/types";
import { useState } from "react";

export default function P() {
  const { data, reload } = useList<BudgetHead>("/api/budget-heads");
  const [edit, setEdit] = useState<Record<string, string>>({});
  return (
    <AppShell role="FINANCE">
      <h1 className="text-2xl font-semibold mb-2">Budget Allocation</h1>
      <p className="text-sm text-ink-2 mb-4">Change allocated amount per head. Saved on the backend.</p>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Grant", "Head", "Allocated", "Spent", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-xs">{b.grantId}</td>
                <td className="px-4 py-2">{b.name}</td>
                <td className="px-4 py-2">
                  <input
                    className="w-36"
                    value={edit[b.id!] ?? String(b.allocated)}
                    onChange={(e) => setEdit({ ...edit, [b.id!]: e.target.value })}
                  />
                </td>
                <td className="px-4 py-2 tabular">{inr(b.spent)}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-xs text-info"
                    onClick={async () => {
                      await api(`/api/budget-heads/${b.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ allocated: Number(edit[b.id!] ?? b.allocated), userId: getUser()?.id }),
                      });
                      reload();
                    }}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
