"use client";
import { AppShell } from "@/components/AppShell";
import { downloadFile } from "@/lib/download";
export default function P() {
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <div className="card p-6">
        <p className="text-sm text-ink-2 mb-4">University-wide expense extract.</p>
        <button className="btn-black" onClick={() => downloadFile("/api/export/expenses.csv", "university-expenses.csv")}>
          Download all expenses CSV
        </button>
      </div>
    </AppShell>
  );
}
