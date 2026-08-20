"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr } from "@/lib/types";

type UC = { id: string; grantId: string; financialYear: string; totalUtilized: number; balanceAmount: number; status: string };

export default function P() {
  const { data, reload } = useList<UC>("/api/ucs");
  return (
    <AppShell role="FINANCE">
      <h1 className="text-2xl font-semibold mb-4">UC Verification</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["UC", "Grant", "FY", "Utilized", "Status", ""].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td className="px-4 py-6 text-muted" colSpan={6}>No UCs yet. Generate from PI → Utilization Cert.</td></tr>}
            {data.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-xs">{u.id}</td>
                <td className="px-4 py-2 font-mono text-xs">{u.grantId}</td>
                <td className="px-4 py-2">{u.financialYear}</td>
                <td className="px-4 py-2 tabular">{inr(u.totalUtilized)}</td>
                <td className="px-4 py-2"><StatusChip s={u.status} /></td>
                <td className="px-4 py-2 space-x-2">
                  <a className="text-xs text-info" href={`/api/uc/${u.id}/pdf`} target="_blank">PDF</a>
                  {u.status === "DRAFT" && (
                    <button className="text-xs text-success" onClick={async () => {
                      await api(`/api/ucs/${u.id}/status`, { method: "POST", body: JSON.stringify({ status: "APPROVED", userId: getUser()?.id }) });
                      reload();
                    }}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
