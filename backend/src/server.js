import express from "express";
import cors from "cors";
import { users, grants, expenses as seedExpenses, anomalies, budgetHeads, notifications } from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

let expenses = [...seedExpenses];
let expenseSeq = 1100;

app.get("/", (_req, res) => {
  res.json({
    service: "shodhfund-backend",
    message: "Open the frontend at http://localhost:3000 — this is the API only.",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "shodhfund-backend" });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").toLowerCase();
  const found = Object.values(users).find((u) => u.email.toLowerCase() === email);
  const user = found || users.PI;
  res.json({ token: "demo-token", user });
});

app.get("/api/users", (_req, res) => res.json(users));
app.get("/api/grants", (_req, res) => res.json(grants));
app.get("/api/grants/:id", (req, res) => {
  const g = grants.find((x) => x.id === req.params.id);
  if (!g) return res.status(404).json({ error: "Grant not found" });
  res.json(g);
});
app.get("/api/expenses", (_req, res) => res.json(expenses));
app.post("/api/expenses", (req, res) => {
  const body = req.body || {};
  const row = {
    id: `EXP-${expenseSeq++}`,
    grant: body.grant || grants[0].id,
    vendor: body.vendor || "Unknown",
    invoice: body.invoice || "",
    amount: Number(body.amount) || 0,
    date: body.date || new Date().toISOString().slice(0, 10),
    head: body.head || "Contingency",
    status: "SUBMITTED",
    compliance: "COMPLIANT",
    gst: body.gst || "",
  };
  expenses = [row, ...expenses];
  res.status(201).json(row);
});
app.get("/api/anomalies", (_req, res) => res.json(anomalies));
app.get("/api/budget-heads", (_req, res) => res.json(budgetHeads));
app.get("/api/notifications", (_req, res) => res.json(notifications));

app.post("/api/ocr/extract", (_req, res) => {
  res.json({
    vendor: "Thermo Fisher Scientific",
    invoice: "TFS/DEL/88421",
    amount: "428500",
    date: "2026-07-12",
    gst: "07AABCT3518Q1Z4",
    desc: "QuantStudio 5 Real-Time PCR System — consumable kit lot",
    head: "Equipment",
    compliance: "COMPLIANT",
    notes: "GFR Rule 149 · GeM preferred · GSTIN valid",
  });
});

app.post("/api/uc/generate", (req, res) => {
  const grantId = req.body?.grantId || grants[0].id;
  const g = grants.find((x) => x.id === grantId) || grants[0];
  res.json({
    grant: g,
    financialYear: req.body?.financialYear || "2025-26",
    period: "01 Apr 2025 – 31 Mar 2026",
    utilizationPct: Math.round((g.spent / g.amount) * 1000) / 10,
    summary:
      "Utilization computed from live expenditure. Duplicate invoice EXP-1035 excluded pending finance resolution.",
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`ShodhFund API http://127.0.0.1:${PORT}`);
});
