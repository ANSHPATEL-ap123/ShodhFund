"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
export default function P() {
  const { data } = useList<{ id: string; title: string; status: string; grantId: string; note: string }>("/api/objections");
  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold mb-4">Objections</h1>
      <div className="space-y-3">
        {data.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex justify-between"><span className="font-medium">{o.title}</span><StatusChip s={o.status} /></div>
            <p className="text-sm text-ink-2 mt-1">{o.note}</p>
            <p className="text-xs font-mono text-muted mt-1">{o.grantId}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
