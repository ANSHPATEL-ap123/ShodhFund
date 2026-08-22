"use client";

import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type Grant } from "@/lib/types";
import { useState } from "react";
import { downloadFile } from "@/lib/download";
import {
  Sparkles,
  FileText,
  Download,
  Landmark,
  WalletCards,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  BrainCircuit,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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

  const selectedGrant =
    grants.data.find((grant) => grant.id === gId) || grants.data[0];

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Background decorative blobs */}
        <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="pointer-events-none absolute top-80 -left-32 h-72 w-72 rounded-full bg-lime-200/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-200/10 blur-3xl" />

        <div className="relative">
          {/* ================================================= */}
          {/* HERO HEADER */}
          {/* ================================================= */}

          <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#123B63] to-[#1E40AF] px-6 py-7 shadow-xl sm:px-8 sm:py-9">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute -right-4 -top-10 h-44 w-44 rounded-full border border-white/10" />

            <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-lime/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-lime backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Powered Documentation
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Utilization Certificate
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Generate GFR 12-A compliant utilization certificates directly
                  from approved research expenses.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-black">
                  <FileCheck2 className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-xs text-blue-100">
                    Certificate Status
                  </div>

                  <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
                    Ready to Generate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* MAIN GRID */}
          {/* ================================================= */}

          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* ================================================= */}
            {/* LEFT CONFIGURATION PANEL */}
            {/* ================================================= */}

            <aside className="space-y-5">
              {/* Grant selection */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-lime-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                      <Landmark className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#0A2540]">
                        Select Grant
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Choose a grant for the UC
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <label className="text-xs font-medium text-slate-500">
                    Research Grant
                  </label>

                  <div className="relative mt-2">
                    <select
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={gId}
                      onChange={(e) => setGrantId(e.target.value)}
                    >
                      {grants.data.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.id} — {x.title}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Selected grant information */}
                  {selectedGrant && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Selected Grant
                      </div>

                      <div className="mt-2 text-sm font-semibold leading-5 text-[#0A2540]">
                        {selectedGrant.title}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Sanctioned
                        </span>

                        <span className="text-xs font-semibold tabular-nums text-slate-700">
                          {inr(selectedGrant.amount)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Agency</span>

                        <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-blue-600">
                          {selectedGrant.agency}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lime to-[#B6E012] px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-lime/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!gId || busy}
                    onClick={async () => {
                      setBusy(true);
                      setErr("");

                      try {
                        const doc = await api<UC>("/api/uc/generate", {
                          method: "POST",
                          body: JSON.stringify({
                            grantId: gId,
                            userId: getUser()?.id,
                          }),
                        });

                        setUc(doc);
                      } catch (e) {
                        setErr(
                          e instanceof Error
                            ? e.message
                            : "Failed to generate certificate"
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI is drafting...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Generate UC with AI
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI information card */}
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
                    <BrainCircuit className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#0A2540]">
                      AI-Assisted Generation
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      ShodhFund analyzes approved expenses and prepares the
                      certificate using grant data and utilization records.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance card */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-emerald-900">
                      GFR Ready
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                      Generated certificate follows the GFR 12-A utilization
                      certificate format.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ================================================= */}
            {/* RIGHT PREVIEW */}
            {/* ================================================= */}

            <section className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Preview top bar */}
                <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#0A2540]">
                        Certificate Preview
                      </h2>

                      <p className="text-[11px] text-slate-400">
                        Generated GFR 12-A document
                      </p>
                    </div>
                  </div>

                  {uc && (
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:self-auto">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Generated Successfully
                    </div>
                  )}
                </div>

                {/* ================================================= */}
                {/* EMPTY STATE */}
                {/* ================================================= */}

                {!uc && !busy && (
                  <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 scale-150 rounded-full bg-blue-100/50 blur-2xl" />

                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-200">
                        <FileText className="h-9 w-9" />
                      </div>
                    </div>

                    <h3 className="mt-7 text-lg font-semibold text-[#0A2540]">
                      Your UC preview will appear here
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Select a grant and let ShodhFund AI generate a
                      utilization certificate using approved expenditure data.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600">
                        GFR 12-A
                      </span>

                      <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-medium text-violet-600">
                        AI Assisted
                      </span>

                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-600">
                        Audit Ready
                      </span>
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* LOADING STATE */}
                {/* ================================================= */}

                {busy && (
                  <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-lime/30" />

                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-lime to-yellow-300 text-black shadow-xl shadow-lime/30">
                        <BrainCircuit className="h-9 w-9 animate-pulse" />
                      </div>
                    </div>

                    <h3 className="mt-7 text-lg font-semibold text-[#0A2540]">
                      Drafting your certificate
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Analyzing grant and approved expense records...
                    </p>

                    <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-lime" />
                    </div>
                  </div>
                )}

                {/* ================================================= */}
                {/* GENERATED UC */}
                {/* ================================================= */}

                {uc && !busy && (
                  <div className="bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">
                    {/* Stats */}
                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                      <MiniStat
                        icon={<WalletCards className="h-4 w-4" />}
                        label="Sanctioned"
                        value={inr(uc.grant.amount)}
                        color="blue"
                      />

                      <MiniStat
                        icon={<TrendingUp className="h-4 w-4" />}
                        label="Utilized"
                        value={inr(uc.totalUtilized)}
                        color="lime"
                      />

                      <MiniStat
                        icon={<Landmark className="h-4 w-4" />}
                        label="Balance"
                        value={inr(uc.balanceAmount)}
                        color="violet"
                      />
                    </div>

                    {/* UC paper */}
                    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-8 shadow-md sm:px-10 sm:py-10 lg:px-14">
                      {/* Top document line */}
                      <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-violet-500 to-lime" />

                      {/* Document header */}
                      <div className="text-center">
                        <div className="text-[11px] font-semibold tracking-[0.2em] text-slate-400">
                          GOVERNMENT OF INDIA
                        </div>

                        <h2 className="mt-3 text-xl font-bold tracking-wide text-[#0A2540]">
                          GFR 12 – A
                        </h2>

                        <p className="mt-1 text-[10px] font-medium tracking-wider text-slate-400">
                          FORM OF UTILIZATION CERTIFICATE
                        </p>

                        <div className="mx-auto mt-5 h-px w-32 bg-slate-200" />

                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-mono text-slate-500">
                          <FileCheck2 className="h-3 w-3 text-blue-500" />
                          {uc.id}
                        </div>
                      </div>

                      {/* Certificate text */}
                      <p className="mt-8 text-sm leading-7 text-slate-700">
                        Certified that out of{" "}
                        <b className="font-semibold text-[#0A2540]">
                          {inr(uc.grant.amount)}
                        </b>{" "}
                        sanctioned in favour of{" "}
                        <b className="font-semibold text-[#0A2540]">
                          {uc.grant.pi}
                        </b>{" "}
                        under{" "}
                        <span className="font-mono text-xs text-blue-600">
                          {uc.grant.id}
                        </span>
                        , a sum of{" "}
                        <b className="font-semibold text-[#0A2540]">
                          {inr(uc.totalUtilized)}
                        </b>{" "}
                        has been utilized for{" "}
                        <i className="font-medium text-slate-800">
                          {uc.grant.title}
                        </i>
                        , leaving a balance of{" "}
                        <b className="font-semibold text-[#0A2540]">
                          {inr(uc.balanceAmount)}
                        </b>
                        .
                      </p>

                      {/* Utilization progress */}
                      <div className="mt-7 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-lime-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-semibold text-[#0A2540]">
                              Grant Utilization
                            </div>

                            <div className="mt-1 text-[11px] text-slate-500">
                              Based on approved expenditure records
                            </div>
                          </div>

                          <div className="text-lg font-bold text-blue-700">
                            {uc.utilizationPct}%
                          </div>
                        </div>

                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-violet-500 to-lime transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                Math.max(uc.utilizationPct, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Budget table */}
                      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-[#F4F7FB]">
                              <th className="px-4 py-3 text-left font-semibold text-slate-500">
                                Head of Expenditure
                              </th>

                              <th className="px-4 py-3 text-right font-semibold text-slate-500">
                                Sanctioned
                              </th>

                              <th className="px-4 py-3 text-right font-semibold text-slate-500">
                                Utilized
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(uc.heads || []).map((h) => (
                              <tr
                                key={h.name}
                                className="border-t border-slate-100"
                              >
                                <td className="px-4 py-3 font-medium text-slate-700">
                                  {h.name}
                                </td>

                                <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                                  {inr(h.allocated)}
                                </td>

                                <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-700">
                                  {inr(h.spent)}
                                </td>
                              </tr>
                            ))}

                            {(uc.heads || []).length === 0 && (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="px-4 py-6 text-center text-slate-400"
                                >
                                  No expenditure head details available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* AI Summary */}
                      <div className="mt-8 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-blue-50 p-5">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                            <BrainCircuit className="h-4 w-4" />
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-violet-900">
                              AI Utilization Summary
                            </div>

                            <p className="mt-2 text-xs leading-6 text-slate-600">
                              {uc.summary}{" "}
                              <span className="font-semibold text-violet-700">
                                Current utilization: {uc.utilizationPct}%.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          Generated through ShodhFund
                        </div>

                        <div className="text-[10px] font-mono text-slate-400">
                          UC ID: {uc.id}
                        </div>
                      </div>
                    </article>

                    {/* Error */}
                    {err && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                        <span>{err}</span>
                      </div>
                    )}

                    {/* Download */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-xs text-slate-400">
                        Review the generated certificate before downloading.
                      </div>

                      <button
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#123B63] hover:shadow-xl"
                        onClick={async () => {
                          setErr("");

                          try {
                            await downloadFile(
                              `/api/uc/${uc.id}/pdf`,
                              `${uc.id}.pdf`
                            );
                          } catch (e) {
                            setErr(
                              e instanceof Error
                                ? e.message
                                : "PDF failed"
                            );
                          }
                        }}
                      >
                        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ================================================= */
/* MINI STAT COMPONENT */
/* ================================================= */

function MiniStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "lime" | "violet";
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },

    lime: {
      icon: "bg-lime-50 text-lime-700",
      border: "border-lime-100",
    },

    violet: {
      icon: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
  }[color];

  return (
    <div
      className={`rounded-xl border ${styles.border} bg-white p-4 shadow-sm`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.icon}`}
        >
          {icon}
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>

      <div className="mt-3 text-sm font-bold tabular-nums text-[#0A2540]">
        {value}
      </div>
    </div>
  );
}