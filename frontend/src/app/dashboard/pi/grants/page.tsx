"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type Grant } from "@/lib/types";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpRight,
  X,
  Building2,
  WalletCards,
  TrendingUp,
  FolderKanban,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";

const agencyStyles: Record<string, string> = {
  DST: "bg-blue-50 text-blue-700 border-blue-100",
  SERB: "bg-violet-50 text-violet-700 border-violet-100",
  ICMR: "bg-rose-50 text-rose-700 border-rose-100",
  UGC: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CSIR: "bg-orange-50 text-orange-700 border-orange-100",
};

export default function Page() {
  const { data, error, reload } = useList<Grant>("/api/grants");

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    agency: "DST",
    amount: "2500000",
    department: "Biotechnology",
  });

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();

    if (!s) return data;

    return data.filter((g) =>
      `${g.id} ${g.title} ${g.agency} ${g.pi}`
        .toLowerCase()
        .includes(s)
    );
  }, [data, q]);

  const totalSanctioned = data.reduce((sum, g) => sum + Number(g.amount || 0), 0);

  const totalSpent = data.reduce((sum, g) => sum + Number(g.spent || 0), 0);

  const utilization =
    totalSanctioned > 0
      ? Math.round((totalSpent / totalSanctioned) * 100)
      : 0;

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />
        <div className="pointer-events-none absolute top-64 -left-40 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative">
          {/* ------------------------------------------------ */}
          {/* HEADER */}
          {/* ------------------------------------------------ */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-xs font-medium text-lime-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Research Funding Workspace
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B2545] sm:text-4xl">
                My Grants
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage sanctioned research funding, monitor utilization, and
                keep every grant moving toward compliance.
              </p>
            </div>

            <button
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2545] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12375F] hover:shadow-xl disabled:opacity-50"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Register Grant
            </button>
          </div>

          {/* ------------------------------------------------ */}
          {/* SUMMARY CARDS */}
          {/* ------------------------------------------------ */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-7">
            <SummaryCard
              icon={<FolderKanban className="h-5 w-5" />}
              label="Total Grants"
              value={String(data.length)}
              description="Active funding records"
              accent="blue"
            />

            <SummaryCard
              icon={<WalletCards className="h-5 w-5" />}
              label="Sanctioned"
              value={inr(totalSanctioned)}
              description="Total approved funding"
              accent="lime"
            />

            <SummaryCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Utilized"
              value={inr(totalSpent)}
              description="Recorded expenditure"
              accent="violet"
            />

            <SummaryCard
              icon={<Building2 className="h-5 w-5" />}
              label="Utilization"
              value={`${utilization}%`}
              description="Across all grants"
              accent="orange"
            />
          </div>

          {/* API ERROR */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ------------------------------------------------ */}
          {/* SEARCH / FILTER BAR */}
          {/* ------------------------------------------------ */}

          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-4 focus:ring-lime-100"
                  placeholder="Search grants, agencies or PIs..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />

                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 px-1">
                <span className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-600">
                    {filtered.length}
                  </span>{" "}
                  of {data.length} grants
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* GRANTS TABLE */}
          {/* ------------------------------------------------ */}

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Table header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#0B2545]">
                  Grant Portfolio
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Your current research funding records
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-500 sm:flex">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                Live data
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState query={q} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Grant
                        </th>

                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Agency
                        </th>

                        <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Sanctioned
                        </th>

                        <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Spent
                        </th>

                        <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </th>

                        <th className="w-10 px-4" />
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((g) => (
                        <tr
                          key={g.id}
                          className="group border-b border-slate-100 last:border-0 transition-colors duration-200 hover:bg-slate-50/70"
                        >
                          {/* Grant */}
                          <td className="px-5 py-4">
                            <Link
                              href={`/grants/${g.id}`}
                              className="block"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-105">
                                  <FolderKanban className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-700 transition-colors group-hover:text-[#0B2545]">
                                    {g.title}
                                  </div>

                                  <div className="mt-1 font-mono text-[10px] text-slate-400">
                                    {g.id}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </td>

                          {/* Agency */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                agencyStyles[g.agency] ||
                                "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {g.agency}
                            </span>
                          </td>

                          {/* Sanctioned */}
                          <td className="px-5 py-4 text-right">
                            <span className="font-semibold tabular-nums text-slate-700">
                              {inr(g.amount)}
                            </span>
                          </td>

                          {/* Spent */}
                          <td className="px-5 py-4 text-right">
                            <div className="font-semibold tabular-nums text-slate-700">
                              {inr(g.spent)}
                            </div>

                            <div className="mt-1 text-[10px] text-slate-400">
                              {g.amount
                                ? Math.round((g.spent / g.amount) * 100)
                                : 0}
                              % utilized
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            <StatusChip s={g.status} />
                          </td>

                          {/* Arrow */}
                          <td className="px-4">
                            <Link
                              href={`/grants/${g.id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 hover:border-slate-300 hover:bg-white hover:text-[#0B2545]"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filtered.map((g) => (
                    <Link
                      key={g.id}
                      href={`/grants/${g.id}`}
                      className="block p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FolderKanban className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-700">
                              {g.title}
                            </div>

                            <div className="mt-1 font-mono text-[10px] text-slate-400">
                              {g.id}
                            </div>

                            <div className="mt-2">
                              <span
                                className={`inline-flex rounded-lg border px-2 py-1 text-[10px] font-semibold ${
                                  agencyStyles[g.agency] ||
                                  "border-slate-200 bg-slate-50 text-slate-600"
                                }`}
                              >
                                {g.agency}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <div className="text-[10px] text-slate-400">
                            Sanctioned
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-700">
                            {inr(g.amount)}
                          </div>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <div className="text-[10px] text-slate-400">
                            Spent
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-700">
                            {inr(g.spent)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <StatusChip s={g.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* REGISTER GRANT MODAL */}
      {/* ------------------------------------------------ */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A2D]/50 p-4 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => !busy && setOpen(false)}
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl animate-fade-in-scale">
            {/* Modal top accent */}
            <div className="h-1.5 bg-gradient-to-r from-lime-300 via-lime-400 to-[#0B2545]" />

            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                  <Plus className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-[#0B2545]">
                  Register a grant
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new sanctioned research grant to your workspace.
                </p>
              </div>

              <button
                disabled={busy}
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 px-6 py-6">
              <Field label="Grant title">
                <input
                  className="modern-input"
                  placeholder="e.g. CRISPR-based diagnostics..."
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Funding agency">
                  <select
                    className="modern-input"
                    value={form.agency}
                    onChange={(e) =>
                      setForm({ ...form, agency: e.target.value })
                    }
                  >
                    {["DST", "SERB", "ICMR", "UGC", "CSIR"].map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Sanctioned amount">
                  <input
                    className="modern-input"
                    inputMode="numeric"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="Department">
                <input
                  className="modern-input"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </Field>

              <div className="rounded-xl border border-lime-100 bg-lime-50/70 p-3.5">
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    Grant details will be added to your research funding
                    workspace and become available across the dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                disabled={busy}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 disabled:opacity-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-xl bg-[#B9F227] px-5 py-2.5 text-sm font-semibold text-[#142500] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C5F83B] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                disabled={busy || !form.title}
                onClick={async () => {
                  setBusy(true);

                  try {
                    const u = getUser();

                    await api("/api/grants", {
                      method: "POST",
                      body: JSON.stringify({
                        ...form,
                        amount: Number(form.amount),
                        pi: u?.name,
                        piId: u?.id,
                      }),
                    });

                    setOpen(false);

                    setForm({
                      title: "",
                      agency: "DST",
                      amount: "2500000",
                      department: "Biotechnology",
                    });

                    reload();
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#142500]/30 border-t-[#142500]" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Grant
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  description,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  accent: "blue" | "lime" | "violet" | "orange";
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      glow: "bg-blue-200/30",
      line: "bg-blue-500",
    },
    lime: {
      icon: "bg-lime-50 text-lime-700",
      glow: "bg-lime-200/30",
      line: "bg-lime-400",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      glow: "bg-violet-200/30",
      line: "bg-violet-500",
    },
    orange: {
      icon: "bg-orange-50 text-orange-600",
      glow: "bg-orange-200/30",
      line: "bg-orange-500",
    },
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${styles.glow} blur-2xl transition-transform duration-500 group-hover:scale-150`}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}
          >
            {icon}
          </div>

          <div className={`h-1.5 w-8 rounded-full ${styles.line}`} />
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-slate-400">{label}</p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0B2545]">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FIELD */
/* ========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FolderKanban className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        {query ? "No matching grants" : "No grants yet"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {query
          ? "Try adjusting your search to find another grant."
          : "Register your first sanctioned grant to start managing your research funding."}
      </p>
    </div>
  );
}