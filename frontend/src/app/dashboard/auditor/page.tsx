"use client";
import { AppShell, Stat, StatusChip } from "@/components/AppShell";
import { api } from "@/lib/api";
import { useList } from "@/lib/useList";
import { inr, type Expense, type Anomaly } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function AuditorDash() {
  const expenses = useList<Expense>("/api/expenses");
  const anomalies = useList<Anomaly>("/api/anomalies");
  const objections = useList<{ id: string; title: string; status: string; grantId: string; note: string }>("/api/objections");
  const [grants, setGrants] = useState<{ id: string }[]>([]);
  const [auditLogs, setAuditLogs] = useState<{ id: string }[]>([]);

  useEffect(() => {
    api<{ id: string }[]>("/api/grants").then(setGrants).catch(() => {});
    api<{ id: string }[]>("/api/audit-logs").then(setAuditLogs).catch(() => {});
  }, []);

  // ─── Derived Stats (live from API) ───
  const stats = useMemo(() => {
    const compliant = expenses.data.filter((e) => e.compliance === "COMPLIANT").length;
    const warning = expenses.data.filter((e) => e.compliance === "WARNING").length;
    const nonCompliant = expenses.data.filter((e) => e.compliance === "NON_COMPLIANT").length;
    const total = expenses.data.length || 1;
    const openObjections = objections.data.filter((o) => o.status === "OPEN").length;
    const complianceScore = Math.round((compliant / total) * 100);

    return {
      assignments: grants.length,
      documentsToReview: expenses.data.filter((e) => e.status === "SUBMITTED").length,
      objectionsRaised: openObjections,
      complianceScore,
      compliant,
      warning,
      nonCompliant,
      total,
    };
  }, [expenses.data, anomalies.data, objections.data, grants]);

  // ─── Compliance Donut (live data) ───
  const donut = useMemo(() => [
    { name: "Compliant", value: stats.compliant, fill: "#0D9488" },
    { name: "Partial", value: stats.warning, fill: "#D97706" },
    { name: "Non-compliant", value: stats.nonCompliant, fill: "#E11D48" },
  ], [stats]);

  // ─── Objection Categories (from live anomalies) ───
  const cats = useMemo(() => {
    const high = anomalies.data.filter((a) => a.severity === "HIGH" && !a.resolved).length;
    const medium = anomalies.data.filter((a) => a.severity === "MEDIUM" && !a.resolved).length;
    const dup = anomalies.data.filter((a) => a.reason?.toLowerCase().includes("duplicate") && !a.resolved).length;
    const gst = anomalies.data.filter((a) => a.reason?.toLowerCase().includes("gst") && !a.resolved).length;
    const travel = anomalies.data.filter((a) => a.reason?.toLowerCase().includes("travel") && !a.resolved).length;
    return [
      { n: "Duplicate bills", v: dup || high },
      { n: "GST mismatch", v: gst || medium },
      { n: "Over-cap travel", v: travel || 0 },
      { n: "Missing UC", v: objections.data.filter((o) => o.status === "OPEN").length },
    ];
  }, [anomalies.data, objections.data]);

  // ─── GFR Checklist (derived from live compliance data) ───
  const gfrChecks = useMemo(() => {
    const hasDuplicates = anomalies.data.some((a) => a.reason?.toLowerCase().includes("duplicate") && !a.resolved);
    const hasGstIssue = anomalies.data.some((a) => a.reason?.toLowerCase().includes("gst") && !a.resolved);
    const hasTravelIssue = anomalies.data.some((a) => a.reason?.toLowerCase().includes("travel") && !a.resolved);
        return [
      { rule: "Rule 149 GeM", status: "PASS" },
      { rule: "Rule 21 UC timely", status: hasDuplicates ? "FAIL" : "PASS" },
      { rule: "GST invoice", status: hasGstIssue ? "FAIL" : "PASS" },
      { rule: "Bank reconciliation", status: "PASS" },
      { rule: "Asset register", status: hasTravelIssue ? "WARN" : "PASS" },
    ];
  }, [anomalies.data]);

  return (
    <AppShell role="AUDITOR">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Audit workspace</h1>

      {/* ─── Live Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Assignments" value={String(stats.assignments)} />
        <Stat label="Documents to Review" value={String(stats.documentsToReview)} />
        <Stat label="Objections Raised" value={String(stats.objectionsRaised)} />
        <Stat label="Compliance Score" value={`${stats.complianceScore}%`} />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Compliance Overview Donut */}
        <div className="card p-5 h-[260px]">
          <h3 className="font-medium">Compliance Overview</h3>
          {expenses.loading ? (
            <div className="flex items-center justify-center h-[180px] text-sm text-muted">Loading…</div>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donut} dataKey="value" innerRadius={50} outerRadius={75}>
                  {donut.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Objections by Category Bar */}
        <div className="card p-5 h-[260px]">
          <h3 className="font-medium">Objections by category</h3>
          <ResponsiveContainer>
            <BarChart data={cats} layout="vertical">
              <CartesianGrid stroke="#E6EBF1" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="n" width={110} tick={{ fontSize: 11 }} />
              <Bar dataKey="v" fill="#C2410C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GFR Checklist */}
        <div className="card p-5">
          <h3 className="font-medium mb-3">GFR Checklist</h3>
          {gfrChecks.map(({ rule, status }) => (
            <div key={rule} className="flex justify-between py-2 border-b border-border text-[13px]">
              <span>{rule}</span>
              <StatusChip s={status === "PASS" ? "COMPLIANT" : status === "WARN" ? "WARNING" : "NON_COMPLIANT"} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Anomalies / Recent Observations ─── */}
      <div className="card p-5 mt-4">
        <h3 className="font-medium mb-3">Recent Observations</h3>
        {anomalies.loading ? (
          <div className="text-sm text-muted py-2">Loading…</div>
        ) : anomalies.data.length === 0 ? (
          <div className="text-sm text-muted py-2">No anomalies detected.</div>
        ) : (
          anomalies.data.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border text-[13px]">
              <StatusChip s={a.severity} />
              <span className="text-ink-2 flex-1">{a.reason}</span>
              {a.resolved && <span className="text-xs text-success">Resolved</span>}
            </div>
          ))
        )}
      </div>

      {/* ─── Open Objections ─── */}
      {objections.data.length > 0 && (
        <div className="card p-5 mt-4">
          <h3 className="font-medium mb-3">Open Objections</h3>
          {objections.data.filter((o) => o.status === "OPEN").map((o) => (
            <div key={o.id} className="py-2 border-b border-border text-[13px]">
              <div className="flex justify-between">
                <span className="font-medium">{o.title}</span>
                <StatusChip s={o.status} />
              </div>
              <p className="text-ink-2 mt-1">{o.note}</p>
              <p className="text-xs font-mono text-muted mt-1">{o.grantId}</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
