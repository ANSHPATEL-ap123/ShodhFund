"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Grant } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Page() {
  const { data, error } = useList<Grant>("/api/grants");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return data;
    return data.filter((g) => `${g.id} ${g.title} ${g.agency} ${g.pi}`.toLowerCase().includes(s));
  }, [data, q]);
  return (
    <AppShell role="PI">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold">My Grants</h1>
        <input className="max-w-xs" placeholder="Search grant, agency, PI…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {error && <p className="text-danger text-sm mb-2">{error}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Code", "Title", "Agency", "Sanctioned", "Spent", "Status"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{g.id}</td>
                <td className="px-4 py-3"><Link className="hover:underline font-medium" href={`/grants/${g.id}`}>{g.title}</Link></td>
                <td className="px-4 py-3">{g.agency}</td>
                <td className="px-4 py-3 tabular">{inr(g.amount)}</td>
                <td className="px-4 py-3 tabular">{inr(g.spent)}</td>
                <td className="px-4 py-3"><StatusChip s={g.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
