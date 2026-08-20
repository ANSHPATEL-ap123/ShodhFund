import express from "express";
import cors from "cors";
import { db, mutate, nextId } from "./store.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));

function publicUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

function log(data, userId, action, entityType, entityId, metadata) {
  data.auditLogs.unshift({
    id: nextId("AL", data.auditLogs),
    action,
    entityType,
    entityId,
    userId: userId || "system",
    createdAt: new Date().toISOString(),
    metadata: metadata || {},
  });
}

function recomputeSpent(data, grantId) {
  const approved = data.expenses.filter((e) => e.grantId === grantId && e.status === "APPROVED");
  const g = data.grants.find((x) => x.id === grantId);
  if (g) g.spent = approved.reduce((s, e) => s + Number(e.amount), 0);
  for (const bh of data.budgetHeads.filter((b) => b.grantId === grantId)) {
    bh.spent = approved.filter((e) => e.head === bh.name).reduce((s, e) => s + Number(e.amount), 0);
  }
}

function checkCompliance(exp, data) {
  const notes = [];
  let status = "COMPLIANT";
  const dup = data.expenses.find(
    (e) => e.id !== exp.id && e.invoice && exp.invoice && e.invoice === exp.invoice
  );
  if (dup) {
    status = "NON_COMPLIANT";
    notes.push(`Duplicate invoice ${exp.invoice} already used on ${dup.id}`);
  }
  if (exp.head === "Travel" && Number(exp.amount) > 45000) {
    if (status === "COMPLIANT") status = "WARNING";
    notes.push("Travel exceeds typical GFR metro DA / fare band — review Rule 40");
  }
  const gst = String(exp.gst || "");
  if (gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i.test(gst)) {
    if (status === "COMPLIANT") status = "WARNING";
    notes.push("GSTIN format looks invalid");
  }
  return { status, notes };
}

app.get("/", (_req, res) => {
  res.json({
    service: "shodhfund-backend",
    ok: true,
    message: "API only. Open frontend http://localhost:3000",
    health: "/api/health",
  });
});

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "shodhfund-backend" }));

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").toLowerCase().trim();
  const password = String(req.body?.password || "");
  const data = db();
  const user = data.users.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password. Demo password is demo1234." });
  }
  res.json({ token: `demo.${user.id}`, user: publicUser(user) });
});

app.get("/api/users", (_req, res) => res.json(db().users.map(publicUser)));

app.get("/api/stats", (req, res) => {
  const data = db();
  const role = req.query.role;
  const userId = req.query.userId;
  let grants = data.grants;
  let expenses = data.expenses;
  if (role === "PI" && userId) {
    grants = grants.filter((g) => g.piId === userId);
    const ids = new Set(grants.map((g) => g.id));
    expenses = expenses.filter((e) => ids.has(e.grantId));
  }
  const sanctioned = grants.reduce((s, g) => s + g.amount, 0);
  const spent = grants.reduce((s, g) => s + g.spent, 0);
  res.json({
    grants: grants.length,
    sanctioned,
    spent,
    utilization: sanctioned ? Math.round((spent / sanctioned) * 1000) / 10 : 0,
    pendingExpenses: expenses.filter((e) => e.status === "SUBMITTED").length,
    anomalies: data.anomalies.filter((a) => !a.resolved).length,
    departments: new Set(data.grants.map((g) => g.department)).size,
  });
});

app.get("/api/grants", (req, res) => {
  const data = db();
  let list = data.grants;
  if (req.query.piId) list = list.filter((g) => g.piId === req.query.piId);
  res.json(list);
});

app.get("/api/grants/:id", (req, res) => {
  const data = db();
  const g = data.grants.find((x) => x.id === req.params.id);
  if (!g) return res.status(404).json({ error: "Grant not found" });
  res.json({
    ...g,
    budgetHeads: data.budgetHeads.filter((b) => b.grantId === g.id),
    expenses: data.expenses.filter((e) => e.grantId === g.id),
    milestones: data.milestones.filter((m) => m.grantId === g.id),
  });
});

app.get("/api/expenses", (req, res) => {
  const data = db();
  let list = data.expenses;
  if (req.query.grantId) list = list.filter((e) => e.grantId === req.query.grantId);
  if (req.query.status) list = list.filter((e) => e.status === req.query.status);
  if (req.query.submittedById) list = list.filter((e) => e.submittedById === req.query.submittedById);
  res.json(list);
});

app.post("/api/expenses", (req, res) => {
  const body = req.body || {};
  const row = mutate((data) => {
    const exp = {
      id: nextId("EXP", data.expenses),
      grantId: body.grantId || body.grant || data.grants[0].id,
      vendor: body.vendor || "Unknown",
      invoice: body.invoice || "",
      amount: Number(body.amount) || 0,
      date: body.date || new Date().toISOString().slice(0, 10),
      head: body.head || "Contingency",
      gst: body.gst || "",
      description: body.description || body.desc || "",
      status: "SUBMITTED",
      submittedById: body.submittedById || "u-pi",
    };
    const c = checkCompliance(exp, data);
    exp.compliance = c.status;
    exp.complianceNotes = c.notes;
    data.expenses.unshift(exp);
    if (c.status === "NON_COMPLIANT") {
      data.anomalies.unshift({
        id: nextId("AN", data.anomalies),
        severity: "HIGH",
        reason: c.notes.join("; "),
        expenseId: exp.id,
        resolved: false,
      });
    }
    log(data, exp.submittedById, "SUBMIT_EXPENSE", "Expense", exp.id, { amount: exp.amount });
    data.notifications.unshift({
      id: nextId("N", data.notifications),
      userId: "u-fin",
      title: "New expense to verify",
      message: `${exp.vendor} · ₹${exp.amount.toLocaleString("en-IN")} on ${exp.grantId}`,
      type: "APPROVAL_PENDING",
      read: false,
    });
    return exp;
  });
  res.status(201).json(row);
});

app.post("/api/expenses/:id/decide", (req, res) => {
  const action = String(req.body?.action || "").toUpperCase();
  const reason = req.body?.reason || "";
  const approverId = req.body?.approverId || "u-fin";
  if (!["APPROVED", "REJECTED", "CORRECTION_REQUESTED"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }
  const row = mutate((data) => {
    const exp = data.expenses.find((e) => e.id === req.params.id);
    if (!exp) return null;
    exp.status = action;
    data.approvals.unshift({
      id: nextId("AP", data.approvals),
      expenseId: exp.id,
      action,
      reason,
      approverId,
      createdAt: new Date().toISOString(),
    });
    recomputeSpent(data, exp.grantId);
    log(data, approverId, action, "Expense", exp.id, { reason });
    return exp;
  });
  if (!row) return res.status(404).json({ error: "Expense not found" });
  res.json(row);
});

app.get("/api/anomalies", (_req, res) => res.json(db().anomalies));
app.post("/api/anomalies/:id/resolve", (req, res) => {
  const row = mutate((data) => {
    const a = data.anomalies.find((x) => x.id === req.params.id);
    if (a) a.resolved = true;
    return a;
  });
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.get("/api/budget-heads", (req, res) => {
  const data = db();
  let list = data.budgetHeads;
  if (req.query.grantId) list = list.filter((b) => b.grantId === req.query.grantId);
  res.json(list);
});

app.get("/api/notifications", (req, res) => {
  const data = db();
  let list = data.notifications;
  if (req.query.userId) list = list.filter((n) => n.userId === req.query.userId);
  res.json(list);
});

app.get("/api/milestones", (req, res) => {
  const data = db();
  let list = data.milestones;
  if (req.query.grantId) list = list.filter((m) => m.grantId === req.query.grantId);
  res.json(list);
});

app.get("/api/audit-logs", (_req, res) => res.json(db().auditLogs.slice(0, 80)));
app.get("/api/objections", (_req, res) => res.json(db().objections));
app.get("/api/approvals", (_req, res) => res.json(db().approvals));

app.post("/api/ocr/extract", (req, res) => {
  const hint = String(req.body?.filename || req.body?.hint || "equipment").toLowerCase();
  const packs = {
    travel: {
      vendor: "MakeMyTrip Business",
      invoice: `MMT-B2B-${Math.floor(9000 + Math.random() * 900)}`,
      amount: "48200",
      date: "2026-07-08",
      gst: "07AADCM5146R1ZV",
      desc: "Air + hotel — conference travel",
      head: "Travel",
    },
    consumable: {
      vendor: "Sigma-Aldrich",
      invoice: `SA-IN-${Math.floor(10000 + Math.random() * 900)}`,
      amount: "91200",
      date: "2026-07-02",
      gst: "27AABCS1234A1Z9",
      desc: "Laboratory consumables",
      head: "Consumables",
    },
  };
  const data =
    hint.includes("travel") ? packs.travel : hint.includes("consum") ? packs.consumable : {
      vendor: "Thermo Fisher Scientific",
      invoice: "TFS/DEL/88421",
      amount: "428500",
      date: "2026-07-12",
      gst: "07AABCT3518Q1Z4",
      desc: "QuantStudio 5 Real-Time PCR System — kit lot",
      head: "Equipment",
    };
  res.json({ ...data, compliance: "PENDING", notes: "Extracted locally (demo OCR). Submit to run GFR checks." });
});

app.post("/api/uc/generate", (req, res) => {
  const data = db();
  const grantId = req.body?.grantId || data.grants[0].id;
  const g = data.grants.find((x) => x.id === grantId) || data.grants[0];
  const heads = data.budgetHeads.filter((b) => b.grantId === g.id);
  const approved = data.expenses.filter((e) => e.grantId === g.id && e.status === "APPROVED");
  const utilized = approved.reduce((s, e) => s + e.amount, 0) || g.spent;
  const uc = mutate((d) => {
    const doc = {
      id: nextId("UC", d.ucs),
      grantId: g.id,
      financialYear: req.body?.financialYear || "2025-26",
      period: req.body?.period || "01 Apr 2025 – 31 Mar 2026",
      totalUtilized: utilized,
      balanceAmount: g.amount - utilized,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      heads,
      expenses: approved,
    };
    d.ucs.unshift(doc);
    log(d, req.body?.userId || "u-pi", "GENERATE_UC", "UC", doc.id, { grantId: g.id });
    return doc;
  });
  res.json({
    ...uc,
    grant: g,
    utilizationPct: g.amount ? Math.round((utilized / g.amount) * 1000) / 10 : 0,
    summary: `GFR 12-A draft for ${g.id}. ${approved.length} approved vouchers, ₹${utilized.toLocaleString("en-IN")} utilized. Duplicate EXP-1035 excluded until finance decision.`,
  });
});

app.get("/api/ucs", (_req, res) => res.json(db().ucs));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShodhFund API http://localhost:${PORT}`);
});
