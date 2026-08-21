"use client";
import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Health = { ok: boolean; jwt: boolean; gemini: boolean; r2: boolean; store: string };

export default function SettingsPage() {
  const [h, setH] = useState<Health | null>(null);
  useEffect(() => {
    api<Health>("/api/health").then(setH).catch(() => setH({ ok: false, jwt: false, gemini: false, r2: false, store: "down" }));
  }, []);
  const row = (label: string, on: boolean, hint: string) => (
    <div className="flex justify-between gap-4 py-3 border-b border-border text-sm">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted">{hint}</div>
      </div>
      <StatusChip s={on ? "COMPLIANT" : "PENDING"} />
    </div>
  );
  return (
    <AppShell role="ADMIN">
      <h1 className="text-2xl font-semibold mb-2">Platform status</h1>
      <p className="text-sm text-ink-2 mb-6">Keys optional. Local demo = JSON store, no cloud.</p>
      <div className="card p-5 max-w-xl">
        {row("API", !!h?.ok, "Backend :4000")}
        {row("JWT_SECRET", !!h?.jwt, "Deploy pe set karo; local default secret chalega")}
        {row("Gemini OCR", !!h?.gemini, "Sirf asli bill extract ke liye GEMINI_API_KEY")}
        {row("R2 / S3", !!h?.r2, "Cloud bills — abhi local uploads/")}
        <div className="flex justify-between py-3 text-sm">
          <span>Data store</span>
          <span className="font-mono text-xs">{h?.store || "…"}</span>
        </div>
      </div>
      <p className="text-xs text-muted mt-4 max-w-xl">Full guide: repo <b>DEPLOY.md</b> — kab local, kab keys, kab Vercel+Render.</p>
    </AppShell>
  );
}
