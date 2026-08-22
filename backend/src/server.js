require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'shodhfund-secret-2026';
const PORT = process.env.PORT || 4000;

// ─── Helpers ───────────────────────────────────────────
function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try { req.user = jwt.verify(auth.slice(7), JWT_SECRET); } catch {}
  }
  next();
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

async function logAction(userId, action, entityType, entityId, metadata) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, metadata: metadata || null } });
  } catch {}
}

// ─── Auth ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, department, designation } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already exists' });
    const user = await prisma.user.create({ data: { email, password, name, role: role || 'PI', department, designation } });
    const token = signToken(user);
    await logAction(user.id, 'REGISTER', 'User', user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    await logAction(user.id, 'LOGIN', 'User', user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, department: user.department, designation: user.designation } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true, role: true, department: true, designation: true, avatarUrl: true } });
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Users ─────────────────────────────────────────────
app.get('/api/users', requireAuth, requireRole('ADMIN', 'FINANCE', 'AUDITOR'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, department: true, designation: true, createdAt: true } });
    res.json(users);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Grants ────────────────────────────────────────────
app.get('/api/grants', optionalAuth, async (req, res) => {
  try {
    const where = {};
    if (req.user?.role === 'PI') where.piId = req.user.id;
    if (req.query.status) where.status = req.query.status;
    const grants = await prisma.grant.findMany({
      where,
      include: { pi: { select: { id: true, name: true, email: true, department: true } }, budgetHeads: true, _count: { select: { expenses: true, milestones: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const mapped = grants.map(g => ({...g, pi: g.pi?.name || '', department: g.pi?.department || ''}));
    res.json(mapped);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/grants/:id', optionalAuth, async (req, res) => {
  try {
    const grant = await prisma.grant.findUnique({
      where: { id: req.params.id },
      include: { pi: { select: { id: true, name: true, email: true, department: true } }, budgetHeads: { include: { expenses: true } }, expenses: { include: { submittedBy: { select: { name: true } }, approvals: true, anomalies: true }, orderBy: { createdAt: 'desc' } }, milestones: true, ucs: true, objections: true }
    });
    if (!grant) return res.status(404).json({ error: 'Grant not found' });
    res.json(flatGrant);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/grants', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const data = req.body;
    data.piId = data.piId || req.user.id;
    data.sanctionedAmount = parseFloat(data.sanctionedAmount) || 0;
    data.startDate = new Date(data.startDate);
    data.endDate = new Date(data.endDate);
    if (data.ucDueDate) data.ucDueDate = new Date(data.ucDueDate);
    const grant = await prisma.grant.create({ data });
    await logAction(req.user.id, 'CREATE_GRANT', 'Grant', grant.id);
    res.status(201).json(grant);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/grants/:id', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const data = req.body;
    if (data.sanctionedAmount) data.sanctionedAmount = parseFloat(data.sanctionedAmount);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (data.ucDueDate) data.ucDueDate = new Date(data.ucDueDate);
    const grant = await prisma.grant.update({ where: { id: req.params.id }, data });
    await logAction(req.user.id, 'UPDATE_GRANT', 'Grant', grant.id);
    res.json(grant);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Budget Heads ──────────────────────────────────────
app.get('/api/grants/:grantId/budget-heads', optionalAuth, async (req, res) => {
  try {
    const heads = await prisma.budgetHead.findMany({ where: { grantId: req.params.grantId }, include: { expenses: true } });
    res.json(heads);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/grants/:grantId/budget-heads', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const data = { ...req.body, grantId: req.params.grantId, allocatedAmount: parseFloat(req.body.allocatedAmount) || 0 };
    const head = await prisma.budgetHead.create({ data });
    await logAction(req.user.id, 'CREATE_BUDGET_HEAD', 'BudgetHead', head.id);
    res.status(201).json(head);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Expenses ──────────────────────────────────────────
app.get('/api/expenses', optionalAuth, async (req, res) => {
  try {
    const where = {};
    if (req.query.grantId) where.grantId = req.query.grantId;
    if (req.query.status) where.status = req.query.status;
    if (req.user?.role === 'PI') where.submittedById = req.user.id;
    const expenses = await prisma.expense.findMany({
      where,
      include: { grant: { select: { id: true, title: true, grantCode: true } }, budgetHead: { select: { id: true, name: true, category: true } }, submittedBy: { select: { id: true, name: true } }, approvals: { include: { approver: { select: { name: true } } } }, anomalies: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(expenses);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/expenses/:id', optionalAuth, async (req, res) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.id },
      include: { grant: true, budgetHead: true, submittedBy: { select: { id: true, name: true, email: true } }, approvals: { include: { approver: { select: { name: true, role: true } } } }, anomalies: true }
    });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/expenses', requireAuth, async (req, res) => {
  try {
    const data = { ...req.body, amount: parseFloat(req.body.amount) || 0, date: new Date(req.body.date), submittedById: req.user.id };
    const expense = await prisma.expense.create({ data });
    // Update grant spentAmount
    await prisma.grant.update({ where: { id: data.grantId }, data: { spentAmount: { increment: data.amount } } });
    // Update budgetHead spentAmount
    await prisma.budgetHead.update({ where: { id: data.budgetHeadId }, data: { spentAmount: { increment: data.amount } } });
    await logAction(req.user.id, 'CREATE_EXPENSE', 'Expense', expense.id);
    res.status(201).json(expense);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/expenses/:id', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    if (data.amount) data.amount = parseFloat(data.amount);
    if (data.date) data.date = new Date(data.date);
    const expense = await prisma.expense.update({ where: { id: req.params.id }, data });
    await logAction(req.user.id, 'UPDATE_EXPENSE', 'Expense', expense.id);
    res.json(expense);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Approvals ─────────────────────────────────────────
app.post('/api/expenses/:expenseId/approve', requireAuth, requireRole('FINANCE', 'ADMIN'), async (req, res) => {
  try {
    const { action, reason } = req.body;
    const approval = await prisma.approval.create({ data: { expenseId: req.params.expenseId, approverId: req.user.id, action, reason } });
    const statusMap = { APPROVED: 'APPROVED', REJECTED: 'REJECTED', CORRECTION_REQUESTED: 'CORRECTION_REQUESTED' };
    await prisma.expense.update({ where: { id: req.params.expenseId }, data: { status: statusMap[action] || 'SUBMITTED' } });
    await logAction(req.user.id, `EXPENSE_${action}`, 'Expense', req.params.expenseId);
    res.status(201).json(approval);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Anomalies ─────────────────────────────────────────
app.get('/api/anomalies', optionalAuth, async (req, res) => {
  try {
    const where = {};
    if (req.query.resolved === 'false') where.resolved = false;
    if (req.query.severity) where.severity = req.query.severity;
    const anomalies = await prisma.anomaly.findMany({ where, include: { expense: { include: { grant: { select: { title: true, grantCode: true } } } } }, orderBy: { detectedAt: 'desc' } });
    res.json(anomalies);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/expenses/:expenseId/anomalies', requireAuth, requireRole('FINANCE', 'AUDITOR', 'ADMIN'), async (req, res) => {
  try {
    const anomaly = await prisma.anomaly.create({ data: { expenseId: req.params.expenseId, severity: req.body.severity, reason: req.body.reason } });
    await prisma.expense.update({ where: { id: req.params.expenseId }, data: { complianceStatus: req.body.severity === 'HIGH' ? 'NON_COMPLIANT' : 'WARNING' } });
    await logAction(req.user.id, 'FLAG_ANOMALY', 'Anomaly', anomaly.id);
    res.status(201).json(anomaly);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/anomalies/:id/resolve', requireAuth, requireRole('FINANCE', 'ADMIN'), async (req, res) => {
  try {
    const anomaly = await prisma.anomaly.update({ where: { id: req.params.id }, data: { resolved: true } });
    await logAction(req.user.id, 'RESOLVE_ANOMALY', 'Anomaly', anomaly.id);
    res.json(anomaly);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Utilization Certificates ──────────────────────────
app.get('/api/grants/:grantId/ucs', optionalAuth, async (req, res) => {
  try {
    const ucs = await prisma.utilizationCertificate.findMany({ where: { grantId: req.params.grantId }, orderBy: { createdAt: 'desc' } });
    res.json(ucs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/grants/:grantId/ucs', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const data = { ...req.body, grantId: req.params.grantId, totalUtilized: parseFloat(req.body.totalUtilized) || 0, balanceAmount: parseFloat(req.body.balanceAmount) || 0 };
    const uc = await prisma.utilizationCertificate.create({ data });
    await logAction(req.user.id, 'CREATE_UC', 'UtilizationCertificate', uc.id);
    res.status(201).json(uc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/ucs/:id', requireAuth, async (req, res) => {
  try {
    const uc = await prisma.utilizationCertificate.update({ where: { id: req.params.id }, data: req.body });
    await logAction(req.user.id, 'UPDATE_UC', 'UtilizationCertificate', uc.id);
    res.json(uc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Milestones ────────────────────────────────────────
app.get('/api/grants/:grantId/milestones', optionalAuth, async (req, res) => {
  try {
    const milestones = await prisma.milestone.findMany({ where: { grantId: req.params.grantId }, orderBy: { dueDate: 'asc' } });
    res.json(milestones);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/grants/:grantId/milestones', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const data = { ...req.body, grantId: req.params.grantId, dueDate: new Date(req.body.dueDate) };
    const ms = await prisma.milestone.create({ data });
    await logAction(req.user.id, 'CREATE_MILESTONE', 'Milestone', ms.id);
    res.status(201).json(ms);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/milestones/:id', requireAuth, async (req, res) => {
  try {
    const ms = await prisma.milestone.update({ where: { id: req.params.id }, data: req.body });
    res.json(ms);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Objections ────────────────────────────────────────
app.get('/api/grants/:grantId/objections', optionalAuth, async (req, res) => {
  try {
    const objections = await prisma.objection.findMany({ where: { grantId: req.params.grantId }, orderBy: { createdAt: 'desc' } });
    res.json(objections);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/grants/:grantId/objections', requireAuth, requireRole('AUDITOR', 'FINANCE', 'ADMIN'), async (req, res) => {
  try {
    const obj = await prisma.objection.create({ data: { ...req.body, grantId: req.params.grantId } });
    await logAction(req.user.id, 'CREATE_OBJECTION', 'Objection', obj.id);
    res.status(201).json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/objections/:id', requireAuth, async (req, res) => {
  try {
    const obj = await prisma.objection.update({ where: { id: req.params.id }, data: req.body });
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Audit Logs ────────────────────────────────────────
app.get('/api/audit-logs', requireAuth, requireRole('ADMIN', 'AUDITOR', 'FINANCE'), async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.entityType) where.entityType = req.query.entityType;
    const logs = await prisma.auditLog.findMany({ where, include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: 'desc' }, take: 200 });
    res.json(logs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Notifications ─────────────────────────────────────
app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 50 });
    res.json(notifs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const n = await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    res.json(n);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/notifications', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const n = await prisma.notification.create({ data: req.body });
    res.status(201).json(n);
  } catch (e) { res.status(500).json({ error: e.messege }); }
});

// ─── Dashboard Stats ───────────────────────────────────
app.get('/api/dashboard', requireAuth, async (req, res) => {
  try {
    const [grantCount, activeGrants, totalSanctioned, totalSpent, expenseCount, pendingExpenses, anomalyCount, unresolvedAnomalies] = await Promise.all([
      prisma.grant.count(),
      prisma.grant.count({ where: { status: 'ACTIVE' } }),
      prisma.grant.aggregate({ _sum: { sanctionedAmount: true } }),
      prisma.grant.aggregate({ _sum: { spentAmount: true } }),
      prisma.expense.count(),
      prisma.expense.count({ where: { status: 'SUBMITTED' } }),
      prisma.anomaly.count(),
      prisma.anomaly.count({ where: { resolved: false } })
    ]);
    res.json({
      grantCount, activeGrants,
      totalSanctioned: totalSanctioned._sum.sanctionedAmount || 0,
      totalSpent: totalSpent._sum.spentAmount || 0,
      expenseCount, pendingExpenses,
      anomalyCount, unresolvedAnomalies
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Compliance Review ─────────────────────────────────
app.get('/api/compliance-review', requireAuth, requireRole('FINANCE', 'AUDITOR', 'ADMIN'), async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { complianceStatus: { in: ['PENDING', 'WARNING', 'NON_COMPLIANT'] } },
      include: { grant: { select: { title: true, grantCode: true } }, submittedBy: { select: { name: true } }, anomalies: true, approvals: { include: { approver: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(expenses);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Ask ShodhFund (AI Chatbot) ────────────────────────
app.post('/api/ask', optionalAuth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_KEY) {
      try {
        const fetch = (await import('node-fetch')).default;
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: `You are ShodhFund AI assistant. Help with research fund management, grants, UC, compliance. Be concise.\n\nUser: ${question}` }] }] })
        });
        const data = await resp.json();
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (answer) return res.json({ answer, source: 'gemini' });
      } catch {}
    }

    // Keyword fallback
    const q = question.toLowerCase();
    const kb = {
      uc: 'Utilization Certificates (UC) are mandatory annual statements showing fund utilization. They must be submitted to the funding agency by the UC due date. Track UC status on the Grants page.',
      anomaly: 'Anomalies are compliance flags detected on expenses — duplicate invoices, budget overruns, vendor mismatches. Finance/Auditors can flag them, and they must be resolved before UC submission.',
      budget: 'Budget Heads categorize grant expenditure: Equipment, Consumables, Travel, Contingency, Manpower, Overhead. Each head tracks allocated vs spent amounts.',
      approval: 'Expense approval follows: PI submits → Finance reviews → Approved/Rejected/Correction Requested. Multiple approval levels can be configured.',
      grant: 'Grants are research funding from agencies like DST, DBT, CSIR, SERB. Each grant has a sanction order, budget heads, milestones, and UC obligations.',
      compliance: 'Compliance review flags expenses with issues. Status: COMPLIANT, WARNING, NON_COMPLIANT, PENDING. Anomalies are auto-detected and can also be manually flagged.',
      milestone: 'Milestones track research deliverables and deadlines. Status: PENDING → IN_PROGRESS → COMPLETED/DELAYED. They help ensure timely fund utilization and UC readiness.'
    };
    let answer = 'I can help with grants, budgets, expenses, approvals, anomalies, UC, milestones, and compliance. What would you like to know?';
    for (const [key, val] of Object.entries(kb)) {
      if (q.includes(key)) { answer = val; break; }
    }
    res.json({ answer, source: 'keyword' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Health ────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'prisma', time: new Date().toISOString() }));

// ─── Start ─────────────────────────────────────────────

const addAliases = require('./server-alias.js');
addAliases(app, prisma, optionalAuth, requireAuth, requireRole, logAction);

app.listen(PORT, () => console.log(`🚀 ShodhFund API on port ${PORT} (Prisma+Neon)`));
