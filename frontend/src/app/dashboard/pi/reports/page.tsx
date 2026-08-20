"use client";
import { AppShell } from "@/components/AppShell";
export default function P() {
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-2">Reports</h1>
      <p className="text-sm text-ink-2 mb-4">Download live expense register as CSV (from backend).</p>
      <a className="btn-black" href="/api/export/expenses.csv">Download expenses CSV</a>
    </AppShell>
  );
}
