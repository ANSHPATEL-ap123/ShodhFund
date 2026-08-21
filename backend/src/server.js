import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { db, mutate, nextId } from "./store.js";
import { extractBill } from "./ocr.js";
import { ucPdfBuffer } from "./pdf.js";
import { signToken, optionalAuth, authMiddleware } from "./auth.js";
import { saveBill } from "./storage.js";
import { answerQuestion } from "./ask.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadDir = path.join(root, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 8 * 1024 * 1024 } });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));
app.use(optionalAuth);

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

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    service: "shodhfund-backend",
    jwt: Boolean(process.env.JWT_SECRET),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    r2: Boolean(process.env.R2_ACCESS_KEY_ID),
    store: "json",
  })
);

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").toLowerCase().trim();
  const password = String(req.body?.password || "");
  const data = db();
  const user = data.users.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password. Demo password is demo1234." });
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user: publicUser(user) });
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

app.post("/api/grants", authMiddleware, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.agency) return res.status(400).json({ error: "title and agency required" });
  const row = mutate((data) => {
    const code = `GR-${String(body.agency).slice(0, 4).toUpperCase()}-${String(Date.now()).slice(-4)}`;
    const amount = Number(body.amount) || 0;
    const g = {
      id: code,
      title: body.title,
      agency: String(body.agency).toUpperCase(),
      amount,
      spent: 0,
      start: body.start || new Date().toISOString().slice(0, 10),
      end: body.end || "2028-03-31",
      status: "ACTIVE",
      piId: req.user?.id || body.piId || "u-pi",
      pi: body.pi || req.user?.email || "PI",
      department: body.department || "Biotechnology",
      ucDue: body.ucDue || "2026-12-31",
    };
    data.grants.unshift(g);
    const heads = ["Equipment", "Consumables", "Travel", "Contingency"];
    heads.forEach((name, i) => {
      data.budgetHeads.push({
        id: nextId("bh", data.budgetHeads),
        grantId: g.id,
        name,
        allocated: Math.round(amount * [0.4, 0.3, 0.2, 0.1][i]),
        spent: 0,
      });
    });
    log(data, g.piId, "CREATE_GRANT", "Grant", g.id, { agency: g.agency });
    return g;
  });
  res.status(201).json(row);
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

app.post("/api/expenses", authMiddleware, (req, res) => {
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
      submittedById: req.user?.id || body.submittedById || "u-pi",
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

app.post("/api/expenses/:id/decide", authMiddleware, (req, res) => {
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

app.post("/api/notifications/:id/read", (req, res) => {
  const row = mutate((data) => {
    const n = data.notifications.find((x) => x.id === req.params.id);
    if (n) n.read = true;
    return n;
  });
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.patch("/api/budget-heads/:id", (req, res) => {
  const allocated = Number(req.body?.allocated);
  const row = mutate((data) => {
    const b = data.budgetHeads.find((x) => x.id === req.params.id);
    if (!b) return null;
    if (!Number.isNaN(allocated) && allocated >= 0) b.allocated = allocated;
    log(data, req.body?.userId || "u-fin", "UPDATE_BUDGET", "BudgetHead", b.id, { allocated: b.allocated });
    return b;
  });
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.get("/api/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  const data = db();
  if (!q) return res.json({ grants: [], expenses: [] });
  const grants = data.grants.filter((g) =>
    `${g.id} ${g.title} ${g.agency} ${g.pi}`.toLowerCase().includes(q)
  );
  const expenses = data.expenses.filter((e) =>
    `${e.id} ${e.vendor} ${e.invoice} ${e.grantId}`.toLowerCase().includes(q)
  );
  res.json({ grants, expenses });
});

app.get("/api/export/expenses.csv", (req, res) => {
  const data = db();
  let list = data.expenses;
  if (req.query.grantId) list = list.filter((e) => e.grantId === req.query.grantId);
  const header = "id,grantId,vendor,invoice,amount,date,head,status,compliance,gst";
  const lines = list.map((e) =>
    [e.id, e.grantId, e.vendor, e.invoice, e.amount, e.date, e.head, e.status, e.compliance, e.gst]
      .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
      .join(",")
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=shodhfund-expenses.csv");
  res.send([header, ...lines].join("\n"));
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

app.post("/api/ocr/extract", upload.single("file"), async (req, res) => {
  try {
    const filename = req.file?.originalname || req.body?.filename || "";
    const hint = req.body?.hint || filename;
    let buffer;
    if (req.file?.path) buffer = fs.readFileSync(req.file.path);
    let stored = null;
    if (buffer) stored = await saveBill({ buffer, filename, mime: req.file?.mimetype });
    const extracted = await extractBill({ filename, hint, buffer });
    res.json({ ...extracted, compliance: "PENDING", billUrl: stored?.url || null, storage: stored?.storage || null });
  } catch (e) {
    res.status(500).json({ error: e.message || "OCR failed" });
  }
});

app.post("/api/uc/generate", authMiddleware, (req, res) => {
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

app.post("/api/ucs/:id/status", (req, res) => {
  const status = String(req.body?.status || "").toUpperCase();
  const allowed = ["DRAFT", "UNDER_REVIEW", "APPROVED", "SUBMITTED_TO_AGENCY"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Bad status" });
  const row = mutate((data) => {
    const u = data.ucs.find((x) => x.id === req.params.id);
    if (!u) return null;
    u.status = status;
    log(data, req.body?.userId || "u-fin", "UC_STATUS", "UC", u.id, { status });
    return u;
  });
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.get("/api/uc/:id/pdf", async (req, res) => {
  try {
    const data = db();
    const uc = data.ucs.find((x) => x.id === req.params.id);
    if (!uc) return res.status(404).json({ error: "Generate a UC first, then download PDF." });
    const grant = data.grants.find((g) => g.id === uc.grantId);
    if (!grant) return res.status(404).json({ error: "Grant missing" });
    const buf = await ucPdfBuffer({
      grant,
      uc,
      heads: uc.heads || data.budgetHeads.filter((b) => b.grantId === uc.grantId),
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${uc.id}.pdf"`);
    res.end(buf);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "PDF failed. Run npm install in backend (pdfkit)." });
  }
});

app.get("/api/calendar", (_req, res) => {
  const data = db();
  const events = [
    ...data.grants.map((g) => ({
      id: `uc-${g.id}`,
      type: "UC_DUE",
      date: g.ucDue,
      title: `UC due · ${g.agency}`,
      subtitle: g.title,
      href: `/grants/${g.id}`,
    })),
    ...data.milestones.map((m) => ({
      id: m.id,
      type: "MILESTONE",
      date: m.dueDate,
      title: m.title,
      subtitle: m.grantId,
      href: `/grants/${m.grantId}`,
    })),
  ].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  res.json(events);
});

app.post("/api/ask", (req, res) => {
  res.json(answerQuestion(req.body?.q, db()));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err?.message || "Server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShodhFund API http://localhost:${PORT}`);
});
