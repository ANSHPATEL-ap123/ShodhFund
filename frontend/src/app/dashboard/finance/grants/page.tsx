"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { useList } from "@/lib/useList";
import { inr, type Grant } from "@/lib/types";
import Link from "next/link";

export default function P() {
  const { data } = useList<Grant>("/api/grants");

  const totalAmount = data.reduce(
    (sum, g) => sum + Number(g.amount || 0),
    0
  );

  const totalSpent = data.reduce(
    (sum, g) => sum + Number(g.spent || 0),
    0
  );

  const remaining = totalAmount - totalSpent;

  const utilization =
    totalAmount > 0
      ? Math.round((totalSpent / totalAmount) * 100)
      : 0;

  const activeGrants = data.filter(
    (g) =>
      String(g.status).toUpperCase() === "ACTIVE"
  ).length;

  return (
    <AppShell role="FINANCE">
      <div className="min-h-full bg-[#F4F7FB]">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-[#F0F9E8]" />

          <div className="relative pt-1 pb-7">
            {/* Workspace pill */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-[12px] font-medium text-[#475569] mb-5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D9FF38] text-[#17324D]">
                ✦
              </span>
              ShodhFund Workspace
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h1 className="text-[34px] md:text-[40px] leading-[1.08] font-semibold tracking-[-0.035em] text-[#102A43]">
                  Grant management
                </h1>

                <p className="mt-3 text-[15px] text-[#64748B]">
                  Monitor research grants, funding allocation and expenditure.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[12px] text-[#718096]">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  Live grant portfolio · Backend data
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                  Total grants
                </p>

                <p className="text-[20px] font-semibold text-[#102A43] mt-0.5">
                  {data.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total grants */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total grants
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {data.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-xl">
                ▥
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#315DCE]">
              <span>↗</span>
              <span>Research funding portfolio</span>
            </div>
          </div>

          {/* Total sanctioned */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total sanctioned
                </p>

                <p className="mt-4 text-[29px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(totalAmount)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#F0FFD0] flex items-center justify-center text-[#7EA900] text-xl font-semibold">
                ₹
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#6C9900]">
              <span>✓</span>
              <span>Approved grant funding</span>
            </div>
          </div>

          {/* Spent */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total spent
                </p>

                <p className="mt-4 text-[29px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(totalSpent)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488] text-xl">
                ▣
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#0D9488]">
              <span>▣</span>
              <span>Recorded expenditure</span>
            </div>
          </div>

          {/* Utilization */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white shadow-[0_8px_24px_rgba(7,32,42,0.12)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8B9CA4]">
                  Portfolio utilization
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em]">
                  {utilization}%
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100] text-xl">
                ↗
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[10px] text-[#A8B8BE] mb-2">
                <span>Funding utilized</span>
                <span>{utilization}%</span>
              </div>

              <div className="h-2 rounded-full bg-[#29424B] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#BDF21A] transition-all"
                  style={{
                    width: `${Math.min(100, utilization)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grant portfolio */}
        <div className="mt-5 rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          {/* Section header */}
          <div className="px-5 py-4 border-b border-[#E7ECF2] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-lg">
                ▥
              </div>

              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Grant portfolio
                </h2>

                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  All research grants under finance management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#15803D] text-[10px] font-semibold">
                {activeGrants} active
              </span>

              <span className="text-[11px] text-[#8291A5]">
                {data.length} total
              </span>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E7ECF2]">
                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Grant
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Principal Investigator
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Sanctioned
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Spent
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Utilization
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((g) => {
                  const amount = Number(g.amount || 0);
                  const spent = Number(g.spent || 0);

                  const pct =
                    amount > 0
                      ? Math.min(
                          100,
                          Math.round((spent / amount) * 100)
                        )
                      : 0;

                  return (
                    <tr
                      key={g.id}
                      className="border-b border-[#EDF1F4] last:border-0 hover:bg-[#FBFCFD] transition"
                    >
                      {/* Grant */}
                      <td className="px-5 py-4 min-w-[300px]">
                        <Link
                          href={`/grants/${g.id}`}
                          className="group block"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#F2F6FA] flex items-center justify-center text-[#52708D] text-sm shrink-0">
                              ▥
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium text-[#18324D] group-hover:text-[#2454D6] transition truncate">
                                {g.title}
                              </p>

                              <p className="text-[10px] font-mono text-[#8291A5] mt-1">
                                {g.id}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* PI */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#EEF4FF] flex items-center justify-center text-[10px] font-semibold text-[#2454D6]">
                            {String(g.pi)
                              .split(" ")
                              .map((x) => x[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <span className="text-[#40566D]">
                            {g.pi}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="font-semibold tabular text-[#102A43]">
                          {inr(g.amount)}
                        </span>
                      </td>

                      {/* Spent */}
                      <td className="px-5 py-4">
                        <span className="font-semibold tabular text-[#334E68]">
                          {inr(g.spent)}
                        </span>
                      </td>

                      {/* Utilization */}
                      <td className="px-5 py-4 min-w-[150px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-[#8291A5]">
                            Used
                          </span>

                          <span className="text-[10px] font-semibold text-[#64748B]">
                            {pct}%
                          </span>
                        </div>

                        <div className="h-1.5 rounded-full bg-[#E9EEF3] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0F766E] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusChip s={g.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-3 space-y-3">
            {data.map((g) => {
              const amount = Number(g.amount || 0);
              const spent = Number(g.spent || 0);

              const pct =
                amount > 0
                  ? Math.min(
                      100,
                      Math.round((spent / amount) * 100)
                    )
                  : 0;

              return (
                <Link
                  key={g.id}
                  href={`/grants/${g.id}`}
                  className="block rounded-2xl border border-[#E5EBF0] bg-[#FAFCFD] p-4 hover:bg-white transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] shrink-0">
                        ▥
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#18324D] leading-5">
                          {g.title}
                        </h3>

                        <p className="text-[9px] font-mono text-[#8291A5] mt-1">
                          {g.id}
                        </p>
                      </div>
                    </div>

                    <StatusChip s={g.status} />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                        Principal Investigator
                      </p>

                      <p className="text-[12px] font-medium text-[#40566D] mt-1">
                        {g.pi}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                        Sanctioned
                      </p>

                      <p className="text-[13px] font-semibold text-[#102A43] mt-1">
                        {inr(g.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-[#8291A5] mb-1.5">
                      <span>Funding utilization</span>
                      <span>{pct}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-[#E6ECF1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0F766E]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-[#8291A5]">
                      Spent {inr(g.spent)}
                    </span>

                    <span className="text-[11px] font-semibold text-[#2454D6]">
                      View grant →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom summary */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 pb-5">
          {/* Remaining */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100] text-lg">
                ₹
              </div>

              <div className="flex-1">
                <p className="text-[13px] font-semibold">
                  Remaining portfolio balance
                </p>

                <p className="text-[25px] font-semibold mt-1 tracking-[-0.02em]">
                  {inr(remaining)}
                </p>

                <p className="text-[11px] leading-5 text-[#AAB9BF] mt-1">
                  Funding currently available across all managed grants.
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio status */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488]">
                ✓
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#102A43]">
                  Portfolio status
                </p>

                <p className="text-[11px] text-[#8291A5] mt-1">
                  Current grant activity overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-4">
              <div>
                <p className="text-[21px] font-semibold text-[#102A43]">
                  {activeGrants}
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Active grants
                </p>
              </div>

              <div>
                <p className="text-[21px] font-semibold text-[#102A43]">
                  {data.length - activeGrants}
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Other status
                </p>
              </div>

              <div>
                <p className="text-[21px] font-semibold text-[#0F766E]">
                  {utilization}%
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Utilized
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}