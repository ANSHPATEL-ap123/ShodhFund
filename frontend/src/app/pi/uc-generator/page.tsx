"use client";
import { AppShell } from "@/components/AppShell";
import { grants, inr } from "@/lib/data";
import { useState } from "react";

export default function UCPage() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const g = grants[0];

  return (
    <AppShell role="PI">
      <h1 className="text-2xl font-semibold tracking-tight">Generate Utilization Certificate</h1>
      <p className="text-sm text-ink-2 mt-1 mb-6">GFR 12-A format · AI drafted from live expenditure</p>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 space-y-3">
          <label className="text-xs text-muted block">Grant
            <select className="mt-1">{grants.map((x) => <option key={x.id}>{x.id} — {x.title}</option>)}</select>
          </label>
          <label className="text-xs text-muted block">Financial year
            <select className="mt-1"><option>2025-26</option><option>2024-25</option></select>
          </label>
          <label className="text-xs text-muted block">Reporting period
            <select className="mt-1"><option>01 Apr 2025 – 31 Mar 2026</option></select>
          </label>
          <button
            className="btn-lime w-full justify-center mt-2"
            onClick={async () => {
              setBusy(true);
              await fetch("/api/uc/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ grantId: g.id, financialYear: "2025-26" }),
              });
              setBusy(false);
              setReady(true);
            }}
          >
            {busy ? "Drafting with Gemini…" : "Generate UC with AI"}
          </button>
        </div>
        <div className="lg:col-span-2 card p-8 min-h-[520px] bg-[#fbfaf7]">
          {!ready ? (
            <p className="text-sm text-muted">Preview appears here after generation.</p>
          ) : (
            <article className="text-[13px] leading-6 text-ink">
              <p className="text-center font-semibold">GFR 12 – A</p>
              <p className="text-center text-xs text-muted">FORM OF UTILIZATION CERTIFICATE</p>
              <p className="mt-6">Certified that out of <b>{inr(g.amount)}</b> of grants-in-aid sanctioned during the year 2025-26 in favour of <b>{g.pi}</b> under this Ministry / Department letter No. {g.id} and ₹0 on account of unspent balance of the previous year, a sum of <b>{inr(g.spent)}</b> has been utilized for the purpose of <i>{g.title}</i> for which it was sanctioned, and that the balance of <b>{inr(g.amount - g.spent)}</b> remaining unutilized at the end of the year will be adjusted towards the grants-in-aid payable during the next year.</p>
              <table className="w-full mt-6 text-xs border border-border">
                <thead className="bg-white">
                  <tr>
                    {["Sl", "Head", "Sanctioned", "Utilized", "Balance"].map((h) => <th key={h} className="border border-border p-2 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {["Equipment", "Consumables", "Travel", "Contingency"].map((h, i) => (
                    <tr key={h}>
                      <td className="border border-border p-2">{i + 1}</td>
                      <td className="border border-border p-2">{h}</td>
                      <td className="border border-border p-2 tabular">₹{(i + 2) * 4}L</td>
                      <td className="border border-border p-2 tabular">₹{(i + 1) * 3}L</td>
                      <td className="border border-border p-2 tabular">₹{4}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-6">Certified that I have satisfied myself that the conditions on which the grants-in-aid was sanctioned have been duly fulfilled / are being fulfilled and that I have exercised the following checks to see that the money was actually utilized for the purpose for which it was sanctioned.</p>
              <div className="grid grid-cols-2 gap-8 mt-10 text-xs">
                <div>
                  <div className="h-10 border-b border-ink/30" />
                  <div className="mt-1">Signature of PI</div>
                </div>
                <div>
                  <div className="h-10 border-b border-ink/30" />
                  <div className="mt-1">Finance Officer / Registrar</div>
                </div>
              </div>
              <div className="mt-8 p-3 bg-white border border-border rounded-lg text-xs">
                <b>AI summary:</b> Utilization 66.5%. No blocked GFR 21 delay. Duplicate invoice EXP-1035 excluded from this UC pending finance resolution.
              </div>
              <div className="flex gap-2 mt-6">
                <button className="btn-black">Download PDF</button>
                <button className="btn-outline">Send for Review</button>
                <button className="btn-outline">Edit</button>
              </div>
            </article>
          )}
        </div>
      </div>
    </AppShell>
  );
}
