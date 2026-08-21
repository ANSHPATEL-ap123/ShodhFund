"use client";
import { AppShell, Stat } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { inr } from "@/lib/types";

export default function P() {
  const [s, setS] = useState({ grants: 0, sanctioned: 0, utilization: 0, departments: 0 });
  useEffect(() => { api<typeof s>("/api/stats").then(setS).catch(() => {}); }, []);
  const score = Math.min(100, Math.round(50 + s.utilization * 0.4));
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold mb-4">NIRF Reports</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Research score (demo)" value={String(score)} />
        <Stat label="Active grants" value={String(s.grants)} />
        <Stat label="Funding" value={inr(s.sanctioned)} />
        <Stat label="Departments" value={String(s.departments)} />
      </div>
      <p className="text-sm text-ink-2 mt-6">Demo metric from live grant utilization. Phase 3 will map official NIRF RP fields.</p>
    </AppShell>
  );
}
