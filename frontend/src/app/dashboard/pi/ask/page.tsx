"use client";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export default function AskPage() {
  const [q, setQ] = useState("how much spent on DST");
  const [res, setRes] = useState<{ answer: string; rows: { id: string; label: string; value: string }[] } | null>(null);
  const [busy, setBusy] = useState(false);
  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    try {
      setRes(await api("/api/ask", { method: "POST", body: JSON.stringify({ q }) }));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold tracking-tight">Ask ShodhFund</h1>
      <p className="text-sm text-ink-2 mt-1 mb-6">Natural language over live grants (no Gemini required).</p>
      <form onSubmit={run} className="flex gap-2 max-w-2xl">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='e.g. "pending expenses"' />
        <button className="btn-lime shrink-0" disabled={busy}>{busy ? "…" : "Ask"}</button>
      </form>
      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        {["how much spent on DST", "pending expenses", "open anomalies", "UC due"].map((s) => (
          <button key={s} className="badge bg-surface-2 text-ink-2" onClick={() => { setQ(s); }}>{s}</button>
        ))}
      </div>
      {res && (
        <div className="card p-5 mt-6 max-w-2xl">
          <p className="font-medium">{res.answer}</p>
          <div className="mt-4 space-y-2">
            {res.rows.map((r) => (
              <div key={r.id} className="flex justify-between text-sm border-t border-border pt-2">
                <Link href={`/grants/${r.id}`} className="hover:underline">{r.label}</Link>
                <span className="tabular text-muted">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
