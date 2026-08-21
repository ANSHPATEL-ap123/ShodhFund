"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import type { Grant } from "@/lib/types";
export default function P() {
  const { data } = useList<Grant>("/api/grants");
  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold mb-4">Audit Assignments</h1>
      <div className="card divide-y divide-border">
        {data.map((g) => (
          <div key={g.id} className="px-4 py-3 flex justify-between text-sm">
            <div>
              <div className="font-medium">{g.title}</div>
              <div className="text-xs font-mono text-muted">{g.id} · {g.pi}</div>
            </div>
            <StatusChip s={g.status} />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
