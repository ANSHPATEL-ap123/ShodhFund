"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import Link from "next/link";

export default function CalendarPage() {
  const { data } = useList<{ id: string; type: string; date: string; title: string; subtitle: string; href: string }>("/api/calendar");
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-4">Grant calendar</h1>
      <p className="text-sm text-ink-2 mb-4">UC due dates and milestones from live data.</p>
      <div className="card divide-y divide-border">
        {data.map((e) => (
          <Link key={e.id} href={e.href} className="px-4 py-3 flex justify-between gap-4 hover:bg-surface">
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-muted">{e.subtitle}</div>
            </div>
            <div className="text-right">
              <div className="tabular text-sm">{e.date}</div>
              <StatusChip s={e.type} />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
