"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getUser } from "@/lib/session";
import type { Grant } from "@/lib/types";
import { ScanLine, Upload, X } from "lucide-react";

export function AddExpense({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    grantId: "",
    head: "Equipment",
    vendor: "",
    invoice: "",
    amount: "",
    date: "",
    gst: "",
    description: "",
  });

  useEffect(() => {
    api<Grant[]>("/api/grants").then((g) => {
      setGrants(g);
      setForm((f) => ({ ...f, grantId: f.grantId || g[0]?.id || "" }));
    }).catch(() => {});
  }, []);

  async function runOcr() {
    setLoading(true);
    try {
      const data = await api<{
        vendor: string; invoice: string; amount: string; date: string; gst: string; desc: string; head: string;
      }>("/api/ocr/extract", { method: "POST", body: JSON.stringify({ hint: "equipment" }) });
      setForm((f) => ({
        ...f,
        vendor: data.vendor,
        invoice: data.invoice,
        amount: data.amount,
        date: data.date,
        gst: data.gst,
        description: data.desc,
        head: data.head,
      }));
      setExtracted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button className="btn-lime" onClick={() => setOpen(true)}>+ Add Expense</button>
      {toast && <div className="fixed bottom-6 right-6 bg-black text-white text-sm px-4 py-3 rounded-xl z-50">{toast}</div>}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[720px] shadow-[0_10px_30px_rgba(10,37,64,0.12)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Add Expense · AI OCR</h2>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-5 border-r border-border">
                <button
                  onClick={runOcr}
                  className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-sm text-muted hover:bg-surface"
                >
                  {loading ? "Extracting bill fields…" : extracted ? (
                    <>
                      <ScanLine className="w-6 h-6 text-success mb-2" />
                      <span className="text-ink">bill extracted</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2" />
                      Click to run demo OCR
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 space-y-3">
                <label className="text-xs text-muted block">Grant
                  <select className="mt-1" value={form.grantId} onChange={(e) => setForm({ ...form, grantId: e.target.value })}>
                    {grants.map((g) => <option key={g.id} value={g.id}>{g.id}</option>)}
                  </select>
                </label>
                <label className="text-xs text-muted block">Budget head
                  <select className="mt-1" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })}>
                    {["Equipment", "Consumables", "Travel", "Contingency", "Manpower", "Overhead"].map((h) => <option key={h}>{h}</option>)}
                  </select>
                </label>
                {(["vendor", "invoice", "amount", "date", "gst"] as const).map((k) => (
                  <label key={k} className="text-xs text-muted block capitalize">{k}
                    <input className="mt-1" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </label>
                ))}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button
                className="btn-lime"
                onClick={async () => {
                  const user = getUser();
                  const created = await api<{ id: string; compliance: string }>("/api/expenses", {
                    method: "POST",
                    body: JSON.stringify({ ...form, submittedById: user?.id }),
                  });
                  setOpen(false);
                  setToast(`Saved ${created.id}. GFR: ${created.compliance}`);
                  onCreated?.();
                  setTimeout(() => setToast(""), 3500);
                }}
              >
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
