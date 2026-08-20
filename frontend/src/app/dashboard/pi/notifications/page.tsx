"use client";
import { AppShell } from "@/components/AppShell";
import { notifications } from "@/lib/data";
export default function P() {
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.title} className="card p-4">
            <div className="text-xs text-muted">{n.type}</div>
            <div className="font-medium">{n.title}</div>
            <p className="text-sm text-ink-2">{n.message}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
