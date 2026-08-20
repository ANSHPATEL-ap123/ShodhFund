"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type Expense } from "@/lib/types";

export default function Page() {
  const { data, reload, error } = useList<Expense>("/api/expenses");
  async function decide(id: string, action: string) {
    await api(`/api/expenses/${id}/decide`, {
      method: "POST",
      body: JSON.stringify({ action, approverId: getUser()?.id || "u-fin" }),
    });
    reload();
  }
  return (
    <AppShell role="FINANCE">
      <h1 className="text-2xl font-semibold mb-4">Expense Verification</h1>
      <p className="text-sm text-ink-2 mb-4">Approve, reject, or send back. Approved amounts update grant spent.</p>
      {error && <p className="text-danger text-sm mb-2">{error}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["ID", "Vendor", "Amount", "GFR", "Status", "Action"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{e.id}</td>
                <td className="px-4 py-3">{e.vendor}<div className="text-[11px] text-muted">{e.grantId}</div></td>
                <td className="px-4 py-3 tabular">{inr(e.amount)}</td>
                <td className="px-4 py-3"><StatusChip s={e.compliance} /></td>
                <td className="px-4 py-3"><StatusChip s={e.status} /></td>
                <td className="px-4 py-3 space-x-1">
                  {e.status === "SUBMITTED" || e.status === "CORRECTION_REQUESTED" ? (
                    <>
                      <button className="text-xs text-success" onClick={() => decide(e.id, "APPROVED")}>Approve</button>
                      <button className="text-xs text-warning" onClick={() => decide(e.id, "CORRECTION_REQUESTED")}>Fix</button>
                      <button className="text-xs text-danger" onClick={() => decide(e.id, "REJECTED")}>Reject</button>
                    </>
                  ) : <span className="text-muted text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
