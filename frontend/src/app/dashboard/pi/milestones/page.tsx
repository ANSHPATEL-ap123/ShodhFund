"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  Sparkles,
  ArrowUpRight,
  CircleDot,
} from "lucide-react";

export default function P() {
  const { data } = useList<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
    grantId: string;
  }>("/api/milestones");

  const completed = data.filter(
    (m) =>
      m.status.toLowerCase().includes("complete") ||
      m.status.toLowerCase().includes("done")
  ).length;

  const pending = data.length - completed;

  return (
    <AppShell role="PI">
      <div className="relative min-h-full overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-lime-200/20 blur-3xl" />

        <div className="relative">
          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#123B63] to-[#1E40AF] px-6 py-7 shadow-xl sm:px-8">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/10" />

            <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-lime/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-lime backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  Research Timeline
                </div>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Milestones
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Track important research deliverables, deadlines, and grant
                  commitments in one place.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-[120px] rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Flag className="h-4 w-4" />
                    <span className="text-[11px]">Total</span>
                  </div>

                  <div className="mt-2 text-2xl font-semibold text-white">
                    {data.length}
                  </div>
                </div>

                <div className="min-w-[120px] rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-blue-100">
                    <Clock3 className="h-4 w-4" />
                    <span className="text-[11px]">Pending</span>
                  </div>

                  <div className="mt-2 text-2xl font-semibold text-lime">
                    {pending}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* SUMMARY STRIP */}
          {/* ================================================= */}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<Flag className="h-4 w-4" />}
              label="All Milestones"
              value={data.length}
              description="Across your grants"
              type="blue"
            />

            <SummaryCard
              icon={<Clock3 className="h-4 w-4" />}
              label="In Progress"
              value={pending}
              description="Need your attention"
              type="violet"
            />

            <SummaryCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Completed"
              value={completed}
              description="Successfully delivered"
              type="lime"
            />
          </div>

          {/* ================================================= */}
          {/* MILESTONE LIST */}
          {/* ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-[#0A2540]">
                    Research Milestone Timeline
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Important dates and deliverables
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600">
                {data.length} milestone{data.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5 sm:p-7">
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="relative">
                  {/* Timeline vertical line */}
                  <div className="absolute bottom-5 left-[19px] top-5 w-px bg-gradient-to-b from-blue-200 via-violet-200 to-lime-200" />

                  <div className="space-y-3">
                    {data.map((m, index) => {
                      const isComplete =
                        m.status.toLowerCase().includes("complete") ||
                        m.status.toLowerCase().includes("done");

                      return (
                        <div
                          key={m.id}
                          className="group relative flex gap-4 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50/70 hover:shadow-sm"
                          style={{
                            animation: "fade-in 0.4s ease both",
                            animationDelay: `${index * 60}ms`,
                          }}
                        >
                          {/* Timeline node */}
                          <div className="relative z-10 shrink-0">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                                isComplete
                                  ? "bg-emerald-500 text-white"
                                  : "bg-gradient-to-br from-blue-600 to-violet-600 text-white"
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <CircleDot className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1 rounded-xl">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-[#0A2540]">
                                    {m.title}
                                  </h3>

                                  {index === 0 && (
                                    <span className="rounded-full bg-lime-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lime-800">
                                      Latest
                                    </span>
                                  )}
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                                    <span className="tabular-nums">
                                      {m.dueDate}
                                    </span>
                                  </span>

                                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                                  <span className="font-mono text-[10px] text-slate-400">
                                    {m.grantId}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <StatusChip s={m.status} />

                                <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  icon,
  label,
  value,
  description,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  type: "blue" | "violet" | "lime";
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
      value: "text-blue-700",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
      value: "text-violet-700",
    },
    lime: {
      icon: "bg-lime-100 text-lime-700",
      border: "border-lime-200",
      value: "text-lime-700",
    },
  }[type];

  return (
    <div
      className={`group rounded-2xl border ${styles.border} bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

        <div className={`text-2xl font-bold ${styles.value}`}>{value}</div>
      </div>

      <div className="mt-3">
        <div className="text-xs font-semibold text-[#0A2540]">{label}</div>

        <div className="mt-0.5 text-[10px] text-slate-400">
          {description}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* EMPTY STATE */
/* ================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 scale-150 rounded-full bg-blue-100/50 blur-2xl" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-200">
          <CalendarDays className="h-7 w-7" />
        </div>
      </div>

      <h3 className="mt-6 text-base font-semibold text-[#0A2540]">
        No milestones yet
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
        Your research milestones and important grant deadlines will appear
        here once they are added.
      </p>
    </div>
  );
}