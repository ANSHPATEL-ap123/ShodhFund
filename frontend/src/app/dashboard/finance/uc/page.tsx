"use client";

import { AppShell, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { getUser } from "@/lib/session";
import { inr } from "@/lib/types";
import { downloadFile } from "@/lib/download";

type UC = {
  id: string;
  grantId: string;
  financialYear: string;
  totalUtilized: number;
  balanceAmount: number;
  status: string;
};

export default function P() {
  const { data, reload } = useList<UC>("/api/ucs");

  const draftUCs = data.filter((u) => u.status === "DRAFT");
  const approvedUCs = data.filter((u) => u.status === "APPROVED");

  const totalUtilized = data.reduce(
    (sum, u) => sum + Number(u.totalUtilized || 0),
    0
  );

  const totalBalance = data.reduce(
    (sum, u) => sum + Number(u.balanceAmount || 0),
    0
  );

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
                  UC verification
                </h1>

                <p className="mt-3 text-[15px] text-[#64748B]">
                  Review utilization certificates and approve verified grant
                  expenditure.
                </p>

                <div className="flex items-center gap-2 mt-4 text-[12px] text-[#718096]">
                  <span className="w-2 h-2 rounded-full bg-[#9BE500]" />
                  Financial compliance · Live UC records
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                  Certificates
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
          {/* Total UCs */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total UCs
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {data.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-xl">
                ✓
              </div>
            </div>

            <div className="mt-7 text-[12px] text-[#315DCE]">
              Utilization certificates
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Pending approval
                </p>

                <p className="mt-4 text-[32px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {draftUCs.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#FFF3E8] flex items-center justify-center text-[#C76A00] text-xl">
                !
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-[12px] text-[#B45D00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Requires finance review
            </div>
          </div>

          {/* Utilized */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#718096]">
                  Total utilized
                </p>

                <p className="mt-4 text-[29px] leading-none font-semibold tracking-[-0.03em] text-[#102A43]">
                  {inr(totalUtilized)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488] text-xl">
                ₹
              </div>
            </div>

            <div className="mt-7 text-[12px] text-[#0D9488]">
              Reported grant utilization
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white shadow-[0_8px_24px_rgba(7,32,42,0.12)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#8B9CA4]">
                  Compliance status
                </p>

                <p className="mt-4 text-[25px] leading-none font-semibold tracking-[-0.02em]">
                  {draftUCs.length === 0 ? "Clear" : "Review"}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100] text-xl">
                {draftUCs.length === 0 ? "✓" : "!"}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-[#B5C2C7]">
              <span
                className={`w-2 h-2 rounded-full ${
                  draftUCs.length === 0
                    ? "bg-[#BDF21A]"
                    : "bg-[#D97706]"
                }`}
              />

              {draftUCs.length === 0
                ? "All certificates approved"
                : `${draftUCs.length} certificate${
                    draftUCs.length === 1 ? "" : "s"
                  } awaiting approval`}
            </div>
          </div>
        </div>

        {/* Main UC section */}
        <div className="mt-5 rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
          {/* Section header */}
          <div className="px-5 py-4 border-b border-[#E7ECF2] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488] text-lg">
                ✓
              </div>

              <div>
                <h2 className="font-semibold text-[16px] text-[#102A43]">
                  Utilization certificates
                </h2>

                <p className="text-[11px] text-[#7B8BA0] mt-0.5">
                  Verify, download and approve submitted certificates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FFF7E8] text-[#B45D00] text-[10px] font-semibold">
                {draftUCs.length} pending
              </span>

              <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#15803D] text-[10px] font-semibold">
                {approvedUCs.length} approved
              </span>
            </div>
          </div>

          {/* Empty state */}
          {data.length === 0 ? (
            <div className="min-h-[320px] flex flex-col items-center justify-center text-center px-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] flex items-center justify-center text-[#2454D6] text-2xl mb-4">
                ✓
              </div>

              <h3 className="text-[15px] font-semibold text-[#102A43]">
                No utilization certificates yet
              </h3>

              <p className="text-[12px] text-[#8291A5] mt-1 max-w-md">
                Generate a utilization certificate from the PI dashboard
                before it appears here for finance verification.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E7ECF2]">
                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Certificate
                      </th>

                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Grant
                      </th>

                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Financial year
                      </th>

                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Utilized
                      </th>

                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Balance
                      </th>

                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8291A5]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((u, i) => (
                      <tr
                        key={`${u.id}-${i}`}
                        className="border-b border-[#EDF1F4] last:border-0 hover:bg-[#FBFCFD] transition"
                      >
                        {/* UC */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#F2F6FA] flex items-center justify-center text-[#52708D] shrink-0">
                              ✓
                            </div>

                            <div>
                              <p className="text-[12px] font-medium text-[#18324D]">
                                Utilization Certificate
                              </p>

                              <p className="text-[10px] font-mono text-[#8291A5] mt-1">
                                {u.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Grant */}
                        <td className="px-5 py-4">
                          <span className="inline-flex px-2.5 py-1.5 rounded-lg bg-[#F3F6F8] text-[10px] font-mono text-[#64748B]">
                            {u.grantId}
                          </span>
                        </td>

                        {/* FY */}
                        <td className="px-5 py-4">
                          <span className="text-[#40566D] font-medium">
                            {u.financialYear}
                          </span>
                        </td>

                        {/* Utilized */}
                        <td className="px-5 py-4">
                          <span className="font-semibold tabular text-[#102A43]">
                            {inr(u.totalUtilized)}
                          </span>
                        </td>

                        {/* Balance */}
                        <td className="px-5 py-4">
                          <span className="font-semibold tabular text-[#0F766E]">
                            {inr(u.balanceAmount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusChip s={u.status} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              className="inline-flex items-center justify-center h-9 px-3 rounded-xl bg-white border border-[#DCE4EB] text-[#2454D6] text-[11px] font-semibold hover:bg-[#F7FAFC] transition"
                              onClick={() =>
                                downloadFile(
                                  `/api/uc/${u.id}/pdf`,
                                  `${u.id}.pdf`
                                )
                              }
                            >
                              ↓ PDF
                            </button>

                            {u.status === "DRAFT" && (
                              <button
                                className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#102A43] text-white text-[11px] font-semibold hover:bg-[#173B5A] transition shadow-sm"
                                onClick={async () => {
                                  await api(
                                    `/api/ucs/${u.id}/status`,
                                    {
                                      method: "POST",
                                      body: JSON.stringify({
                                        status: "APPROVED",
                                        userId: getUser()?.id,
                                      }),
                                    }
                                  );

                                  reload();
                                }}
                              >
                                ✓ Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden p-3 space-y-3">
                {data.map((u, i) => (
                  <div
                    key={`${u.id}-${i}`}
                    className="rounded-2xl border border-[#E5EBF0] bg-[#FAFCFD] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488] shrink-0">
                          ✓
                        </div>

                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#18324D]">
                            Utilization Certificate
                          </p>

                          <p className="text-[9px] font-mono text-[#8291A5] mt-1">
                            {u.id}
                          </p>
                        </div>
                      </div>

                      <StatusChip s={u.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                          Grant
                        </p>

                        <p className="text-[11px] font-mono text-[#40566D] mt-1">
                          {u.grantId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                          Financial year
                        </p>

                        <p className="text-[12px] font-medium text-[#40566D] mt-1">
                          {u.financialYear}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                          Utilized
                        </p>

                        <p className="text-[14px] font-semibold tabular text-[#102A43] mt-1">
                          {inr(u.totalUtilized)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9AA7B5]">
                          Balance
                        </p>

                        <p className="text-[14px] font-semibold tabular text-[#0F766E] mt-1">
                          {inr(u.balanceAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 h-10 rounded-xl bg-white border border-[#DCE4EB] text-[#2454D6] text-[11px] font-semibold hover:bg-[#F7FAFC] transition"
                        onClick={() =>
                          downloadFile(
                            `/api/uc/${u.id}/pdf`,
                            `${u.id}.pdf`
                          )
                        }
                      >
                        ↓ Download PDF
                      </button>

                      {u.status === "DRAFT" && (
                        <button
                          className="flex-1 h-10 rounded-xl bg-[#102A43] text-white text-[11px] font-semibold hover:bg-[#173B5A] transition"
                          onClick={async () => {
                            await api(`/api/ucs/${u.id}/status`, {
                              method: "POST",
                              body: JSON.stringify({
                                status: "APPROVED",
                                userId: getUser()?.id,
                              }),
                            });

                            reload();
                          }}
                        >
                          ✓ Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom summary */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 pb-5">
          {/* Compliance */}
          <div className="rounded-[20px] bg-[#09232D] p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#C8F51A] flex items-center justify-center text-[#193100]">
                ✓
              </div>

              <div>
                <p className="text-[13px] font-semibold">
                  UC compliance overview
                </p>

                <p className="text-[11px] leading-5 text-[#AAB9BF] mt-1.5">
                  {draftUCs.length > 0
                    ? `${draftUCs.length} certificate${
                        draftUCs.length === 1 ? "" : "s"
                      } ${
                        draftUCs.length === 1
                          ? "is"
                          : "are"
                      } awaiting finance approval.`
                    : "All generated utilization certificates have been approved."}
                </p>
              </div>
            </div>
          </div>

          {/* Financial position */}
          <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFAF8] flex items-center justify-center text-[#0D9488]">
                ₹
              </div>

              <div>
                <p className="text-[13px] font-semibold text-[#102A43]">
                  Certificate financial position
                </p>

                <p className="text-[11px] text-[#8291A5] mt-1">
                  Utilized and remaining amounts reported in UCs
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-[19px] font-semibold text-[#102A43]">
                  {inr(totalUtilized)}
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Utilized
                </p>
              </div>

              <div>
                <p className="text-[19px] font-semibold text-[#0F766E]">
                  {inr(totalBalance)}
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Balance
                </p>
              </div>

              <div>
                <p className="text-[19px] font-semibold text-[#102A43]">
                  {approvedUCs.length}
                </p>

                <p className="text-[9px] text-[#8291A5] mt-0.5">
                  Approved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}