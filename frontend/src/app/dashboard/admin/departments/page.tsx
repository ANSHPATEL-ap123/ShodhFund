"use client";
import { AppShell } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Grant } from "@/lib/types";
import { useMemo } from "react";

export default function P() {
  const { data } = useList<Grant>("/api/grants");
  const rows = useMemo(() => {
    const map = new Map<string, { n: number; amount: number; spent: number }>();
    for (const g of data) {
      const cur = map.get(g.department) || { n: 0, amount: 0, spent: 0 };
      cur.n += 1;
      cur.amount += g.amount;
      cur.spent += g.spent;
      map.set(g.department, cur);
    }
    return [...map.entries()];
  }, [data]);
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold mb-4">Departments</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Department", "Grants", "Sanctioned", "Spent"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([name, r]) => (
              <tr key={name} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{name}</td>
                <td className="px-4 py-3">{r.n}</td>
                <td className="px-4 py-3 tabular">{inr(r.amount)}</td>
                <td className="px-4 py-3 tabular">{inr(r.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
