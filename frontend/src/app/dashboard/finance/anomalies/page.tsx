"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import type { Anomaly } from "@/lib/types";

export default function P() {
  const { data, reload } = useList<Anomaly>("/api/anomalies");

  const openAlerts = data.filter((a) => !a.resolved);
  const highAlerts = data.filter(
    (a) => a.severity === "HIGH" && !a.resolved
  );
  const mediumAlerts = data.filter(
    (a) => a.severity === "MEDIUM" && !a.resolved
  );
  const resolvedAlerts = data.filter((a) => a.resolved);

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
                  AI alerts & anomalies
                </h1>

                <p className="mt-3 text-[15px] text-[#64748B]">
                  Review unusual expense activity detected by ShodhFund AI.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[12px] text-[#718096]">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  AI monitoring active · Live anomaly data
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  <span className="text-[12px] font-semibold text-[#334E68]">
                    Monitoring active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total alerts
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {data.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-xl">
                !
              </div>
            </div>

            <div className="mt-7 text-[12px] text-[#64748B]">
              All AI-detected alerts
            </div>
          </div>

          {/* Open */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Open alerts
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {openAlerts.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#FFF3E8] flex items-center justify-center text-[#C76A00] text-xl">
                !
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#B45D00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Requires review
            </div>
          </div>

          {/* High severity */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  High severity
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {highAlerts.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#FFF0F3] flex items-center justify-center text-[#D11B42] text-xl">
                !
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#C61C40]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
              Priority attention
            </div>
          </div>

          {/* Monitoring */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white shadow-[0_8px_24px_rgba(7,32,42,0.12)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8B9CA4]">
                  AI monitoring
                </p>

                <p className="mt-4 text-[25px] leading-none font-semibold tracking-[-0.02em]">
                  Active
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100] text-xl">
                ✦
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-[#B5C2C7]">
              <span className="w-2 h-2 rounded-full bg-[#BDF21A]" />
              Continuous anomaly detection
            </div>
          </div>
        </div>

        {/* Main alerts section */}
        <div className="mt-5 rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          {/* Section header */}
          <div className="px-5 py-4 border-b border-[#E7ECF2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0FFD0] flex items-center justify-center text-[#6E9700]">
                ✦
              </div>

              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Detected anomalies
                </h2>

                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  Review and resolve flagged expenses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF1F3] text-[#C61C40] text-[10px] font-semibold">
                {openAlerts.length} open
              </span>

              <span className="px-2.5 py-1 rounded-full bg-[#F2F7F5] text-[#0F766E] text-[10px] font-semibold">
                {resolvedAlerts.length} resolved
              </span>
            </div>
          </div>

          {/* Alerts */}
          <div className="p-4 space-y-3">
            {data.length === 0 ? (
              <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F0FFD0] flex items-center justify-center text-[#6E9700] text-2xl mb-4">
                  ✓
                </div>

                <h3 className="text-[15px] font-semibold text-[#102A43]">
                  No alerts detected
                </h3>

                <p className="text-[12px] text-[#8291A5] mt-1">
                  ShodhFund AI has not flagged any unusual activity.
                </p>
              </div>
            ) : (
              data.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 transition ${
                    a.resolved
                      ? "border-[#E6EBF0] bg-[#FAFCFD]"
                      : "border-[#E3E9EF] bg-white hover:border-[#CFD9E3] hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusChip s={a.severity} />

                        <span className="text-[10px] font-mono text-[#8291A5] bg-[#F3F6F8] px-2 py-1 rounded-md">
                          {a.expenseId}
                        </span>

                        {a.resolved && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#ECFDF5] text-[#15803D] text-[9px] font-semibold uppercase">
                            ✓ Resolved
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[13px] leading-5 mt-3 max-w-3xl ${
                          a.resolved
                            ? "text-[#8291A5]"
                            : "text-[#40566D]"
                        }`}
                      >
                        {a.reason}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center lg:justify-end gap-3 shrink-0">
                      {!a.resolved ? (
                        <button
                          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#102A43] text-white text-[12px] font-semibold hover:bg-[#173B5A] transition shadow-sm"
                          onClick={async () => {
                            await api(`/api/anomalies/${a.id}/resolve`, {
                              method: "POST",
                            });

                            reload();
                          }}
                        >
                          <span>✓</span>
                          Resolve alert
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-[#15803D]">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom insight */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 pb-5">
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100]">
                ✦
              </div>

              <div>
                <p className="text-[13px] font-semibold">
                  AI review summary
                </p>

                <p className="text-[11px] leading-5 text-[#AAB9BF] mt-1.5">
                  {openAlerts.length > 0
                    ? `${openAlerts.length} expense ${
                        openAlerts.length === 1 ? "record requires" : "records require"
                      } finance review. Prioritize high-severity anomalies first.`
                    : "All detected anomalies have been resolved. Your finance queue is clear."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7E8] flex items-center justify-center text-[#C76A00]">
                !
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#102A43]">
                  Severity breakdown
                </p>

                <p className="text-[11px] text-[#8291A5] mt-1">
                  Current unresolved alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-4">
              <div>
                <p className="text-[20px] font-semibold text-[#102A43]">
                  {highAlerts.length}
                </p>
                <p className="text-[10px] text-[#8291A5]">High</p>
              </div>

              <div>
                <p className="text-[20px] font-semibold text-[#102A43]">
                  {mediumAlerts.length}
                </p>
                <p className="text-[10px] text-[#8291A5]">Medium</p>
              </div>

              <div>
                <p className="text-[20px] font-semibold text-[#102A43]">
                  {resolvedAlerts.length}
                </p>
                <p className="text-[10px] text-[#8291A5]">Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}