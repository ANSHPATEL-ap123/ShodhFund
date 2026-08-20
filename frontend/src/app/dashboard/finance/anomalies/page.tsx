"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import type { Anomaly } from "@/lib/types";
export default function P() {
  const { data, reload } = useList<Anomaly>("/api/anomalies");
  return (
    <AppShell role="FINANCE">
      <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
      <div className="space-y-3">
        {data.map((a) => (
          <div key={a.id} className="card p-4 flex justify-between gap-4">
            <div>
              <StatusChip s={a.severity} /> <span className="text-xs font-mono text-muted">{a.expenseId}</span>
              <p className="text-sm mt-2">{a.reason}</p>
            </div>
            {!a.resolved ? (
              <button className="btn-outline text-sm h-fit" onClick={async () => { await api(`/api/anomalies/${a.id}/resolve`, { method: "POST" }); reload(); }}>Resolve</button>
            ) : <span className="text-xs text-success">Resolved</span>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
