"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
export default function P() {
  const { data } = useList<{ id: string; title: string; dueDate: string; status: string; grantId: string }>("/api/milestones");
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-4">Milestones</h1>
      <div className="card divide-y divide-border">
        {data.map((m) => (
          <div key={m.id} className="px-4 py-3 flex justify-between text-sm">
            <div><div className="font-medium">{m.title}</div><div className="text-xs text-muted">{m.grantId}</div></div>
            <div className="flex items-center gap-2"><span className="tabular text-muted">{m.dueDate}</span><StatusChip s={m.status} /></div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
