"use client";

import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr, type BudgetHead } from "@/lib/types";
import { useState } from "react";

export default function P() {
  const { data, reload } = useList<BudgetHead>("/api/budget-heads");
  const [edit, setEdit] = useState<Record<string, string>>({});

  const totalAllocated = data.reduce(
    (sum, b) => sum + Number(b.allocated || 0),
    0
  );

  const totalSpent = data.reduce(
    (sum, b) => sum + Number(b.spent || 0),
    0
  );

  const remaining = totalAllocated - totalSpent;

  const utilization =
    totalAllocated > 0
      ? Math.round((totalSpent / totalAllocated) * 100)
      : 0;

  const heads = ["Equipment", "Consumables", "Travel", "Contingency"];

  return (
    <AppShell role="FINANCE">
      <div className="min-h-full bg-[#F4F7FB]">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-[#F0F9E8]" />

          <div className="relative pt-1 pb-7">
            {/* Workspace */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-[12px] font-medium text-[#475569] mb-5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D9FF38] text-[#17324D]">
                ✦
              </span>
              ShodhFund Workspace
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h1 className="text-[34px] md:text-[40px] leading-[1.08] font-semibold tracking-[-0.035em] text-[#102A43]">
                  Budget allocation
                </h1>

                <p className="mt-3 text-[15px] text-[#64748B]">
                  Manage approved funding across research budget heads.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[12px] text-[#718096]">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  Changes are saved directly to the backend
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                  Budget heads
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
          {/* Allocated */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total allocated
                </p>

                <p className="mt-4 text-[29px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(totalAllocated)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#F0FFD0] flex items-center justify-center text-[#7EA900] text-xl font-semibold">
                ₹
              </div>
            </div>

            <div className="mt-7 text-[12px] text-[#6C9900]">
              Approved budget
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

            <div className="mt-7 text-[12px] text-[#0D9488]">
              Recorded expenses
            </div>
          </div>

          {/* Remaining */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Remaining
                </p>

                <p className="mt-4 text-[29px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(remaining)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-xl">
                ↗
              </div>
            </div>

            <div className="mt-7 text-[12px] text-[#315DCE]">
              Available balance
            </div>
          </div>

          {/* Utilization */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white shadow-[0_8px_24px_rgba(7,32,42,0.12)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8B9CA4]">
                  Utilization
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
                <span>Budget utilization</span>
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

        {/* Main allocation card */}
        <div className="mt-5 rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          {/* Card header */}
          <div className="px-5 py-4 border-b border-[#E7ECF2] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-lg">
                ₹
              </div>

              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Budget heads
                </h2>

                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  Change allocated amounts for each grant and expense category
                </p>
              </div>
            </div>

            <div className="text-[11px] text-[#8291A5]">
              {data.length} allocation records
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
                    Budget head
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Allocated
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Spent
                  </th>

                  <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Utilization
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((b) => {
                  const allocated = Number(
                    edit[b.id!] ?? b.allocated ?? 0
                  );

                  const spent = Number(b.spent || 0);

                  const pct =
                    allocated > 0
                      ? Math.min(
                          100,
                          Math.round((spent / allocated) * 100)
                        )
                      : 0;

                  return (
                    <tr
                      key={b.id}
                      className="border-b border-[#EDF1F4] last:border-0 hover:bg-[#FBFCFD] transition"
                    >
                      {/* Grant */}
                      <td className="px-5 py-4">
                        <span className="inline-flex px-2.5 py-1.5 rounded-lg bg-[#F3F6F8] text-[10px] font-mono text-[#64748B]">
                          {b.grantId}
                        </span>
                      </td>

                      {/* Head */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#18324D]">
                          {b.name}
                        </div>

                        <div className="text-[10px] text-[#9AA7B5] mt-1">
                          Research budget category
                        </div>
                      </td>

                      {/* Allocated */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[#8291A5] text-[11px]">
                            ₹
                          </span>

                          <input
                            className="w-36 h-10 px-3 rounded-xl border border-[#DCE4EB] bg-[#FAFCFD] text-[13px] font-medium text-[#102A43] outline-none focus:border-[#8EB900] focus:ring-2 focus:ring-[#D9F58A] transition"
                            value={
                              edit[b.id!] ?? String(b.allocated)
                            }
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                [b.id!]: e.target.value,
                              })
                            }
                          />
                        </div>
                      </td>

                      {/* Spent */}
                      <td className="px-5 py-4">
                        <span className="font-semibold tabular text-[#334E68]">
                          {inr(b.spent)}
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

                      {/* Save */}
                      <td className="px-5 py-4 text-right">
                        <button
                          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-[#102A43] text-white text-[11px] font-semibold hover:bg-[#173B5A] transition shadow-sm"
                          onClick={async () => {
                            await api(`/api/budget-heads/${b.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({
                                allocated: Number(
                                  edit[b.id!] ?? b.allocated
                                ),
                                userId: getUser()?.id,
                              }),
                            });

                            reload();
                          }}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-3 space-y-3">
            {data.map((b) => {
              const allocated = Number(
                edit[b.id!] ?? b.allocated ?? 0
              );

              const spent = Number(b.spent || 0);

              const pct =
                allocated > 0
                  ? Math.min(
                      100,
                      Math.round((spent / allocated) * 100)
                    )
                  : 0;

              return (
                <div
                  key={b.id}
                  className="rounded-2xl border border-[#E5EBF0] bg-[#FAFCFD] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex px-2 py-1 rounded-lg bg-white border border-[#E5EBF0] text-[9px] font-mono text-[#718096]">
                        {b.grantId}
                      </span>

                      <h3 className="text-[14px] font-semibold text-[#18324D] mt-2">
                        {b.name}
                      </h3>
                    </div>

                    <span className="text-[10px] text-[#8291A5]">
                      {pct}% used
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] text-[#8291A5] mb-1.5">
                      <span>Budget utilization</span>
                      <span>{pct}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-[#E6ECF1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0F766E]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                        Allocated
                      </p>

                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[11px] text-[#8291A5]">
                          ₹
                        </span>

                        <input
                          className="w-full h-9 px-2.5 rounded-lg border border-[#DCE4EB] bg-white text-[12px] font-medium text-[#102A43] outline-none focus:border-[#8EB900] focus:ring-2 focus:ring-[#D9F58A]"
                          value={
                            edit[b.id!] ?? String(b.allocated)
                          }
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              [b.id!]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                        Spent
                      </p>

                      <p className="text-[13px] font-semibold tabular text-[#334E68] mt-2">
                        {inr(b.spent)}
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 h-10 rounded-xl bg-[#102A43] text-white text-[11px] font-semibold hover:bg-[#173B5A] transition"
                    onClick={async () => {
                      await api(`/api/budget-heads/${b.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          allocated: Number(
                            edit[b.id!] ?? b.allocated
                          ),
                          userId: getUser()?.id,
                        }),
                      });

                      reload();
                    }}
                  >
                    Save allocation
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom information */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 pb-5">
          {/* Allocation guidance */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100]">
                ₹
              </div>

              <div>
                <p className="text-[13px] font-semibold">
                  Allocation overview
                </p>

                <p className="text-[11px] leading-5 text-[#AAB9BF] mt-1.5">
                  {data.length > 0
                    ? `${data.length} budget heads are currently configured across your active grants.`
                    : "No budget heads are currently available."}
                </p>
              </div>
            </div>
          </div>

          {/* Utilization breakdown */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488]">
                ↗
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#102A43]">
                  Current budget position
                </p>

                <p className="text-[11px] text-[#8291A5] mt-1">
                  Allocated versus recorded spending
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-[19px] font-semibold text-[#102A43]">
                  {inr(totalAllocated)}
                </p>
                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Allocated
                </p>
              </div>

              <div>
                <p className="text-[19px] font-semibold text-[#102A43]">
                  {inr(totalSpent)}
                </p>
                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Spent
                </p>
              </div>

              <div>
                <p className="text-[19px] font-semibold text-[#0F766E]">
                  {utilization}%
                </p>
                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Used
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}