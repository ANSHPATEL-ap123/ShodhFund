"use client";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type Grant } from "@/lib/types";
import { useState } from "react";
import { downloadFile } from "@/lib/download";

type UC = {
  id: string;
  grant: Grant;
  financialYear: string;
  period: string;
  totalUtilized: number;
  balanceAmount: number;
  utilizationPct: number;
  summary: string;
  heads?: { name: string; allocated: number; spent: number }[];
};

export default function UCPage() {
  const grants = useList<Grant>("/api/grants");
  const [grantId, setGrantId] = useState("");
  const [uc, setUc] = useState<UC | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const gId = grantId || grants.data[0]?.id || "";

  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold tracking-tight">Generate Utilization Certificate</h1>
      <p className="text-sm text-ink-2 mt-1 mb-6">GFR 12-A · drafted from approved expenses on the backend</p>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 space-y-3">
          <label className="text-xs text-muted block">Grant
            <select className="mt-1" value={gId} onChange={(e) => setGrantId(e.target.value)}>
              {grants.data.map((x) => <option key={x.id} value={x.id}>{x.id} — {x.title}</option>)}
            </select>
          </label>
          <button
            className="btn-lime w-full justify-center mt-2"
            disabled={!gId || busy}
            onClick={async () => {
              setBusy(true);
              try {
                const doc = await api<UC>("/api/uc/generate", {
                  method: "POST",
                  body: JSON.stringify({ grantId: gId, userId: getUser()?.id }),
                });
                setUc(doc);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Drafting…" : "Generate UC with AI"}
          </button>
        </div>
        <div className="lg:col-span-2 card p-8 min-h-[520px] bg-[#fbfaf7]">
          {!uc ? (
            <p className="text-sm text-muted">Preview appears after generation.</p>
          ) : (
            <article className="text-[13px] leading-6 text-ink">
              <p className="text-center font-semibold">GFR 12 – A</p>
              <p className="text-center text-xs text-muted">FORM OF UTILIZATION CERTIFICATE · {uc.id}</p>
              <p className="mt-6">
                Certified that out of <b>{inr(uc.grant.amount)}</b> sanctioned in favour of <b>{uc.grant.pi}</b> under {uc.grant.id},
                a sum of <b>{inr(uc.totalUtilized)}</b> has been utilized for <i>{uc.grant.title}</i>, leaving a balance of <b>{inr(uc.balanceAmount)}</b>.
              </p>
              <table className="w-full mt-6 text-xs border border-border">
                <thead className="bg-white">
                  <tr>{["Head", "Sanctioned", "Utilized"].map((h) => <th key={h} className="border border-border p-2 text-left">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(uc.heads || []).map((h) => (
                    <tr key={h.name}>
                      <td className="border border-border p-2">{h.name}</td>
                      <td className="border border-border p-2 tabular">{inr(h.allocated)}</td>
                      <td className="border border-border p-2 tabular">{inr(h.spent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-8 p-3 bg-white border border-border rounded-lg text-xs">
                <b>AI summary:</b> {uc.summary} Utilization {uc.utilizationPct}%.
              </div>
              {err && <p className="text-danger text-sm mt-3">{err}</p>}
              <button
                className="btn-black mt-6"
                onClick={async () => {
                  setErr("");
                  try {
                    await downloadFile(`/api/uc/${uc.id}/pdf`, `${uc.id}.pdf`);
                  } catch (e) {
                    setErr(e instanceof Error ? e.message : "PDF failed");
                  }
                }}
              >
                Download PDF
              </button>
            </article>
          )}
        </div>
      </div>
    </AppShell>
  );
}
