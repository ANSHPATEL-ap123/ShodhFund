"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Grant } from "@/lib/types";
import Link from "next/link";
export default function P() {
  const { data } = useList<Grant>("/api/grants");
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold mb-4">All Grants</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left"><tr>{["Code","Title","Dept","PI","Utilisation"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{data.map(g=>(
            <tr key={g.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">{g.id}</td>
              <td className="px-4 py-3"><Link href={`/grants/${g.id}`} className="hover:underline">{g.title}</Link></td>
              <td className="px-4 py-3">{g.department}</td>
              <td className="px-4 py-3">{g.pi}</td>
              <td className="px-4 py-3 tabular">{g.amount ? Math.round(g.spent/g.amount*100) : 0}%</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
