"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type Grant } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Page() {
  const { data, error, reload } = useList<Grant>("/api/grants");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", agency: "DST", amount: "2500000", department: "Biotechnology" });
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    if (!s) return data;
    return data.filter((g) => `${g.id} ${g.title} ${g.agency} ${g.pi}`.toLowerCase().includes(s));
  }, [data, q]);

  return (
    <AppShell role="PI">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">My Grants</h1>
        <div className="flex gap-2">
          <input className="max-w-xs" placeholder="Search grant, agency, PI…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn-lime shrink-0" onClick={() => setOpen(true)}>+ Register grant</button>
        </div>
      </div>
      {error && <p className="text-danger text-sm mb-2">{error}</p>}
      <div className="card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead className="bg-surface text-muted text-left">
            <tr>{["Code", "Title", "Agency", "Sanctioned", "Spent", "Status"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{g.id}</td>
                <td className="px-4 py-3"><Link className="hover:underline font-medium" href={`/grants/${g.id}`}>{g.title}</Link></td>
                <td className="px-4 py-3">{g.agency}</td>
                <td className="px-4 py-3 tabular">{inr(g.amount)}</td>
                <td className="px-4 py-3 tabular">{inr(g.spent)}</td>
                <td className="px-4 py-3"><StatusChip s={g.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="font-semibold mb-4">Register sanction</h2>
            <label className="text-xs text-muted block mb-3">Title
              <input className="mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="text-xs text-muted block mb-3">Agency
              <select className="mt-1" value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })}>
                {["DST", "SERB", "ICMR", "UGC", "CSIR"].map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="text-xs text-muted block mb-4">Sanctioned amount (₹)
              <input className="mt-1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button
                className="btn-lime"
                disabled={busy || !form.title}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const u = getUser();
                    await api("/api/grants", {
                      method: "POST",
                      body: JSON.stringify({ ...form, amount: Number(form.amount), pi: u?.name, piId: u?.id }),
                    });
                    setOpen(false);
                    reload();
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Save grant
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
