"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { AddExpense } from "@/components/AddExpense";
import { useList } from "@/lib/useList";
import { inr, type Expense } from "@/lib/types";
import {
  Search,
  Receipt,
  WalletCards,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  X,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function Page() {
  const { data, reload, error } = useList<Expense>("/api/expenses");

  const [query, setQuery] = useState("");

  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return data;

    return data.filter((e) =>
      `${e.id} ${e.vendor} ${e.invoice} ${e.head} ${e.status} ${e.compliance}`
        .toLowerCase()
        .includes(q)
    );
  }, [data, query]);

  const totalExpenses = data.length;

  const totalAmount = data.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const compliantExpenses = data.filter(
    (expense) =>
      String(expense.compliance).toLowerCase().includes("compliant") ||
      String(expense.compliance).toLowerCase() === "approved"
  ).length;

  const pendingExpenses = data.filter((expense) => {
    const status = String(expense.status).toLowerCase();

    return (
      status.includes("pending") ||
      status.includes("review") ||
      status.includes("submitted")
    );
  }).length;

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-violet-200/10 blur-3xl" />

        <div className="relative">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-xs font-medium text-lime-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Expense Management
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B2545] sm:text-4xl">
                Expenses
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Track research expenditure, review compliance, and maintain a
                complete financial trail for your grants.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                href="/dashboard/pi/reports"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Reports / CSV
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <AddExpense onCreated={reload} />
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY CARDS */}
          {/* ================================================= */}

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<Receipt className="h-5 w-5" />}
              label="Total Expenses"
              value={String(totalExpenses)}
              description="Recorded transactions"
              accent="blue"
            />

            <SummaryCard
              icon={<WalletCards className="h-5 w-5" />}
              label="Total Amount"
              value={inr(totalAmount)}
              description="Across all expenses"
              accent="lime"
            />

            <SummaryCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Compliance"
              value={String(compliantExpenses)}
              description="Compliant records"
              accent="teal"
            />

            <SummaryCard
              icon={<Receipt className="h-5 w-5" />}
              label="Pending Review"
              value={String(pendingExpenses)}
              description="Requires attention"
              accent="orange"
            />
          </div>

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* ================================================= */}
          {/* SEARCH BAR */}
          {/* ================================================= */}

          <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-4 focus:ring-lime-100"
                  placeholder="Search expenses, vendors, invoices..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="px-1 text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {filteredExpenses.length}
                </span>{" "}
                of {data.length} expenses
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* EXPENSE TABLE */}
          {/* ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            {/* Table heading */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#0B2545]">
                  Expense Register
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Financial transactions and GFR compliance status
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-500 sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
                Live data
              </div>
            </div>

            {filteredExpenses.length === 0 ? (
              <EmptyState query={query} />
            ) : (
              <>
                {/* ================================================= */}
                {/* DESKTOP TABLE */}
                {/* ================================================= */}

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Expense
                        </th>

                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Head
                        </th>

                        <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Amount
                        </th>

                        <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </th>

                        <th className="px-5 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          GFR
                        </th>

                        <th className="w-10 px-4" />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredExpenses.map((e) => (
                        <tr
                          key={e.id}
                          className="group border-b border-slate-100 last:border-0 transition-colors duration-200 hover:bg-slate-50/70"
                        >
                          {/* Expense */}
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100">
                                <Receipt className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <div className="font-semibold text-slate-700 transition-colors group-hover:text-[#0B2545]">
                                  {e.vendor}
                                </div>

                                <div className="mt-1 flex items-center gap-2">
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {e.id}
                                  </span>

                                  {e.invoice && (
                                    <>
                                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                                      <span className="text-[10px] text-slate-400">
                                        {e.invoice}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Head */}
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {e.head}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 text-right">
                            <span className="font-semibold tabular-nums text-slate-700">
                              {inr(e.amount)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            <StatusChip s={e.status} />
                          </td>

                          {/* GFR */}
                          <td className="px-5 py-4 text-center">
                            <StatusChip s={e.compliance} />
                          </td>

                          {/* Decorative arrow */}
                          <td className="px-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                              <ArrowUpRight className="h-4 w-4" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ================================================= */}
                {/* MOBILE CARDS */}
                {/* ================================================= */}

                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredExpenses.map((e) => (
                    <div
                      key={e.id}
                      className="p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Receipt className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-700">
                              {e.vendor}
                            </div>

                            <div className="mt-1 font-mono text-[10px] text-slate-400">
                              {e.id}
                            </div>

                            {e.invoice && (
                              <div className="mt-1 text-[10px] text-slate-400">
                                Invoice: {e.invoice}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold tabular-nums text-slate-700">
                            {inr(e.amount)}
                          </div>

                          <div className="mt-1 text-[10px] text-slate-400">
                            Amount
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                          {e.head}
                        </span>

                        <StatusChip s={e.status} />

                        <StatusChip s={e.compliance} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom helper */}
          {data.length > 0 && (
            <div className="mt-4 flex items-center gap-2 px-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Expense records are tracked for GFR compliance and audit
              readiness.
            </div>
          )}
        </div>
      </div>
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
  accent: "blue" | "lime" | "teal" | "orange";
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

    teal: {
      icon: "bg-teal-50 text-teal-600",
      glow: "bg-teal-200/30",
      line: "bg-teal-500",
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

          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* EMPTY STATE */
/* ========================================================= */

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Receipt className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        {query ? "No matching expenses" : "No expenses yet"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {query
          ? "Try adjusting your search to find another expense."
          : "Add your first expense to start tracking research expenditure."}
      </p>
    </div>
  );
}