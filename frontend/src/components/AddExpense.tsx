"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getUser } from "@/lib/session";
import type { Grant } from "@/lib/types";
import { ScanLine, Upload, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export function AddExpense({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState("");
  const [toast, setToast] = useState("");
  const [toastOut, setToastOut] = useState(false);
  const [fileName, setFileName] = useState("");
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

  async function runOcr(file?: File) {
    setLoading(true);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("hint", file?.name || fileName || "equipment");
      fd.append("filename", file?.name || fileName || "");
      const res = await fetch("/api/ocr/extract", { method: "POST", body: fd });
      const data = await res.json();
      setForm((f) => ({
        ...f,
        vendor: data.vendor || f.vendor,
        invoice: data.invoice || f.invoice,
        amount: data.amount || f.amount,
        date: data.date || f.date,
        gst: data.gst || f.gst,
        description: data.desc || f.description,
        head: data.head || f.head,
      }));
      setExtracted(data.notes || "Extracted");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setToastOut(false);
    setTimeout(() => { setToastOut(true); setTimeout(() => setToast(""), 200); }, 3000);
  }

  return (
    <>
      <button className="btn-lime group" onClick={() => setOpen(true)}>
        + Add Expense
      </button>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 bg-ink text-white text-sm px-5 py-3 rounded-xl z-50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center gap-2 ${toastOut ? "animate-toast-out" : "animate-toast-in"}`}>
          <CheckCircle2 className="w-4 h-4 text-[#C8F135]" />
          {toast}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl w-full max-w-[720px] shadow-[0_16px_48px_rgba(10,37,64,0.18)] animate-fade-in-scale">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Add Expense · Bill OCR
              </h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-surface transition-colors duration-150">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Upload */}
              <div className="p-5 border-r border-border">
                <label className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-sm text-muted hover:bg-surface hover:border-border-strong cursor-pointer transition-all duration-200">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setFileName(f.name);
                      runOcr(f);
                    }}
                  />
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-info mb-2" />
                      <span>Reading bill…</span>
                    </div>
                  ) : extracted ? (
                    <div className="flex flex-col items-center">
                      <ScanLine className="w-6 h-6 text-success mb-2" />
                      <span className="text-ink px-4 text-center font-medium">{fileName || "bill"}</span>
                      <span className="text-[11px] mt-1 px-4 text-center text-success">{extracted}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-6 h-6 mb-2" />
                      Drop / choose PDF or image
                      <span className="text-[11px] mt-1">Name file travel / consumable / duplicate to demo OCR</span>
                    </div>
                  )}
                </label>
                <button type="button" className="btn-outline w-full justify-center mt-3 text-sm group" onClick={() => runOcr()}>
                  <Sparkles className="w-3.5 h-3.5" /> Run OCR without file
                </button>
              </div>

              {/* Right: Form */}
              <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
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
                className="btn-lime group"
                onClick={async () => {
                  const user = getUser();
                  const created = await api<{ id: string; compliance: string }>("/api/expenses", {
                    method: "POST",
                    body: JSON.stringify({ ...form, submittedById: user?.id }),
                  });
                  setOpen(false);
                  showToast(`Saved ${created.id}. GFR: ${created.compliance}`);
                  onCreated?.();
                }}
              >
                Submit Expense <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Missing imports used in the component
import { Receipt, ArrowRight } from "lucide-react";
