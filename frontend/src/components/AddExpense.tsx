"use client";
import { useState } from "react";
import { grants } from "@/lib/data";
import { api } from "@/lib/api";
import { ScanLine, Upload, X } from "lucide-react";

export function AddExpense() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    grant: grants[0].id,
    head: "Equipment",
    vendor: "",
    invoice: "",
    amount: "",
    date: "",
    gst: "",
    desc: "",
  });

  function simulateOCR() {
    setLoading(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        vendor: "Thermo Fisher Scientific",
        invoice: "TFS/DEL/88421",
        amount: "428500",
        date: "2026-07-12",
        gst: "07AABCT3518Q1Z4",
        desc: "QuantStudio 5 Real-Time PCR System — consumable kit lot",
        head: "Equipment",
      }));
      setExtracted(true);
      setLoading(false);
    }, 1400);
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
                  onClick={simulateOCR}
                  className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-sm text-muted hover:bg-surface"
                >
                  {loading ? (
                    <span>Extracting with Gemini Flash…</span>
                  ) : extracted ? (
                    <>
                      <ScanLine className="w-6 h-6 text-success mb-2" />
                      <span className="text-ink">bill-equipment.pdf</span>
                      <span className="text-xs mt-1 text-success">Fields extracted</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2" />
                      Drop a bill or click to simulate OCR
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 space-y-3">
                <label className="text-xs text-muted block">Grant
                  <select className="mt-1" value={form.grant} onChange={(e) => setForm({ ...form, grant: e.target.value })}>
                    {grants.map((g) => <option key={g.id}>{g.id}</option>)}
                  </select>
                </label>
                <label className="text-xs text-muted block">Budget head {extracted && <span className="text-pi">(AI suggested)</span>}
                  <select className="mt-1" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })}>
                    {["Equipment", "Consumables", "Travel", "Contingency"].map((h) => <option key={h}>{h}</option>)}
                  </select>
                </label>
                {(["vendor", "invoice", "amount", "date", "gst"] as const).map((k) => (
                  <label key={k} className="text-xs text-muted block capitalize">{k}
                    <input className="mt-1" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </label>
                ))}
                <div className="flex items-center gap-2">
                  <span className="badge bg-teal-50 text-teal-800">COMPLIANT</span>
                  <span className="text-[11px] text-muted">GFR Rule 149 · GeM preferred · GSTIN valid</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button
                className="btn-lime"
                onClick={async () => {
                  await fetch("/api/expenses", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });
                  setOpen(false);
                  setToast("Expense submitted for approval. Compliance: Pass");
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
