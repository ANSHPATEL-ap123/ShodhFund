"use client";
import { AppShell } from "@/components/AppShell";
import { useList } from "@/lib/useList";
export default function P() {
  const { data } = useList<{ id: string; action: string; entityType: string; entityId: string; createdAt: string; userId: string }>("/api/audit-logs");
  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold mb-4">Audit Trail</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left"><tr>{["When","Action","Entity","User"].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{data.map(r=>(
            <tr key={r.id} className="border-t border-border">
              <td className="px-4 py-2 tabular text-xs">{r.createdAt?.slice(0,19).replace("T"," ")}</td>
              <td className="px-4 py-2">{r.action}</td>
              <td className="px-4 py-2 font-mono text-xs">{r.entityType} {r.entityId}</td>
              <td className="px-4 py-2">{r.userId}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </AppShell>
  );
}
