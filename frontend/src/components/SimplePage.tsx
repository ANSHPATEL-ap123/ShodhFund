import { AppShell } from "./AppShell";
import type { Role } from "@/lib/data";

export function SimplePage({ role, title, children }: { role: Role; title: string; children?: React.ReactNode }) {
  return (
    <AppShell role={role}>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">{title}</h1>
      <div className="card p-6 text-sm text-ink-2">{children || "No data available."}</div>
    </AppShell>
  );
}
