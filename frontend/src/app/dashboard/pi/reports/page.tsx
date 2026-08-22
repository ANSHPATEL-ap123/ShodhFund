"use client";

import { AppShell } from "@/components/AppShell";
import { downloadFile } from "@/lib/download";
import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  Database,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Table2,
} from "lucide-react";

export default function P() {
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-violet-200/10 blur-3xl" />

        <div className="relative">
          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#123B63] to-[#1E40AF] px-6 py-7 shadow-xl sm:px-8 sm:py-9">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-3 -top-8 h-44 w-44 rounded-full border border-white/10" />

            <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-lime/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-lime backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  Research Data & Analytics
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Reports & Exports
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Export your live research expense data directly from the
                  ShodhFund backend for analysis, reporting, and audit.
                </p>
              </div>

              {/* Header visual */}
              <div className="hidden lg:block">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/10 backdrop-blur">
                  <div className="absolute inset-3 rounded-2xl bg-lime/10" />

                  <FileSpreadsheet className="relative h-10 w-10 text-lime" />

                  <div className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                    <Download className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* Main export card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Card header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-lime-50/50 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200">
                    <Table2 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#0A2540]">
                      Expense Register
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Complete expense data in CSV format
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* File preview */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#0A2540]">
                          shodhfund-expenses.csv
                        </h3>

                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                          CSV
                        </span>
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Live expense register exported from the backend JSON
                        store.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columns */}
                <div className="mt-5">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Included columns
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "ID",
                      "Grant",
                      "Vendor",
                      "Invoice",
                      "Amount",
                      "Date",
                      "Head",
                      "Status",
                      "GFR",
                    ].map((column) => (
                      <span
                        key={column}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download button */}
                <button
                  disabled={busy}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C8F135] to-[#B6E012] px-5 py-3.5 text-sm font-semibold text-black shadow-lg shadow-lime/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={async () => {
                    setErr("");
                    setOk("");
                    setBusy(true);

                    try {
                      await downloadFile(
                        "/api/export/expenses.csv",
                        "shodhfund-expenses.csv"
                      );

                      setOk("Downloaded shodhfund-expenses.csv");
                    } catch (e) {
                      setErr(
                        e instanceof Error
                          ? e.message
                          : "CSV failed — is backend running?"
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                      Preparing export...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                      Download Expenses CSV
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Success */}
                {ok && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-emerald-800">
                        Export successful
                      </div>

                      <p className="mt-0.5 text-[11px] text-emerald-700">
                        {ok}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {err && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                      <span className="text-sm font-bold">!</span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-red-800">
                        Export failed
                      </div>

                      <p className="mt-0.5 text-[11px] leading-5 text-red-700">
                        {err}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================================================= */}
            {/* SIDE INFORMATION */}
            {/* ================================================= */}

            <div className="space-y-5">
              {/* Live data card */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50/40 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                    <Database className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#0A2540]">
                      Live Backend Data
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      The export is generated directly from your current
                      backend data, ensuring the downloaded register reflects
                      the latest records.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-semibold text-emerald-700">
                    Backend connected
                  </span>
                </div>
              </div>

              {/* Audit card */}
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#0A2540]">
                      Audit Friendly
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      The exported file preserves the key fields required for
                      expense review and compliance workflows.
                    </p>
                  </div>
                </div>
              </div>

              {/* File format */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#0A2540]">
                      Export Format
                    </div>

                    <div className="mt-0.5 text-[10px] text-slate-400">
                      Comma-separated values
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-[10px] text-slate-500">
                    File type
                  </span>

                  <span className="rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-bold text-emerald-700">
                    .CSV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            ShodhFund · Research funding data export
          </div>
        </div>
      </div>
    </AppShell>
  );
}