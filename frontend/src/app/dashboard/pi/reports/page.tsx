"use client";
import { AppShell } from "@/components/AppShell";
import { downloadFile } from "@/lib/download";
import { useState } from "react";

export default function P() {
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold mb-2">Reports</h1>
      <p className="text-sm text-ink-2 mb-6">Export the live expense register from the backend JSON store.</p>
      <div className="card p-6 max-w-lg">
        <h2 className="font-medium">Expense register (CSV)</h2>
        <p className="text-sm text-muted mt-1 mb-4">Columns: id, grant, vendor, invoice, amount, date, head, status, GFR.</p>
        <button
          className="btn-lime"
          onClick={async () => {
            setErr("");
            setOk("");
            try {
              await downloadFile("/api/export/expenses.csv", "shodhfund-expenses.csv");
              setOk("Downloaded shodhfund-expenses.csv");
            } catch (e) {
              setErr(e instanceof Error ? e.message : "CSV failed — is backend running?");
            }
          }}
        >
          Download expenses CSV
        </button>
        {ok && <p className="text-sm text-success mt-3">{ok}</p>}
        {err && <p className="text-sm text-danger mt-3">{err}</p>}
      </div>
    </AppShell>
  );
}
