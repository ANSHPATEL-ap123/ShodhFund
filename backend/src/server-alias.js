// Alias routes for frontend compatibility
module.exports = function(app, prisma, optionalAuth, requireAuth, requireRole, logAction) {

app.get('/api/stats', optionalAuth, async (req, res) => {
  try {
    const where = {};
    if (req.user && req.user.role === 'PI') where.piId = req.user.id;
    const [gc, ts, tse, pe, ua] = await Promise.all([
      prisma.grant.count({ where }),
      prisma.grant.aggregate({ where, _sum: { sanctionedAmount: true } }),
      prisma.grant.aggregate({ where, _sum: { spentAmount: true } }),
      prisma.expense.count({ where: { status: 'SUBMITTED' } }),
      prisma.anomaly.count({ where: { resolved: false } })
    ]);
    const san = ts._sum.sanctionedAmount || 0;
    const spe = tse._sum.spentAmount || 0;
    res.json({ grants: gc, sanctioned: san, spent: spe, utilization: san ? Math.round((spe / san) * 1000) / 10 : 0, pendingExpenses: pe, anomalies: ua, departments: 1 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/budget-heads', optionalAuth, async (req, res) => {
  try {
    const w = {};
    if (req.query.grantId) w.grantId = req.query.grantId;
    res.json(await prisma.budgetHead.findMany({ where: w, include: { grant: { select: { id: true, title: true } } } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/ucs', optionalAuth, async (req, res) => {
  try {
    res.json(await prisma.utilizationCertificate.findMany({ orderBy: { createdAt: 'desc' }, include: { grant: { select: { id: true, title: true, grantCode: true } } } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/milestones', optionalAuth, async (req, res) => {
  try {
    res.json(await prisma.milestone.findMany({ orderBy: { dueDate: 'asc' }, include: { grant: { select: { id: true, title: true } } } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/objections', optionalAuth, async (req, res) => {
  try {
    res.json(await prisma.objection.findMany({ orderBy: { createdAt: 'desc' }, include: { grant: { select: { id: true, title: true } } } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/approvals', optionalAuth, async (req, res) => {
  try {
    res.json(await prisma.approval.findMany({ include: { expense: { select: { id: true, vendorName: true } }, approver: { select: { name: true, role: true } } }, orderBy: { createdAt: 'desc' } }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/search', optionalAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase();
    if (!q) return res.json({ grants: [], expenses: [] });
    const [grants, expenses] = await Promise.all([
      prisma.grant.findMany({ where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { grantCode: { contains: q, mode: 'insensitive' } }, { agency: { contains: q, mode: 'insensitive' } }] }, take: 20 }),
      prisma.expense.findMany({ where: { OR: [{ vendorName: { contains: q, mode: 'insensitive' } }, { invoiceNumber: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }, take: 20 })
    ]);
    res.json({ grants, expenses });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/calendar', optionalAuth, async (req, res) => {
  try {
    const [grants, ms] = await Promise.all([
      prisma.grant.findMany({ select: { id: true, agency: true, title: true, ucDueDate: true } }),
      prisma.milestone.findMany({ select: { id: true, title: true, dueDate: true, grantId: true } })
    ]);
    const events = [
      ...grants.filter(g => g.ucDueDate).map(g => ({ id: 'uc-' + g.id, type: 'UC_DUE', date: g.ucDueDate, title: 'UC due: ' + g.agency, subtitle: g.title, href: '/grants/' + g.id })),
      ...ms.map(m => ({ id: m.id, type: 'MILESTONE', date: m.dueDate, title: m.title, subtitle: m.grantId, href: '/grants/' + m.grantId }))
    ].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    res.json(events);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/uc/generate', requireAuth, requireRole('PI', 'ADMIN'), async (req, res) => {
  try {
    const grantId = req.body.grantId;
    if (!grantId) return res.status(400).json({ error: 'grantId required' });
    const g = await prisma.grant.findUnique({ where: { id: grantId } });
    if (!g) return res.status(404).json({ error: 'Grant not found' });
    const utilized = Number(g.spentAmount);
    const uc = await prisma.utilizationCertificate.create({
      data: { grantId, financialYear: req.body.financialYear || '2025-26', period: req.body.period || '01 Apr 2025 - 31 Mar 2026', totalUtilized: utilized, balanceAmount: Number(g.sanctionedAmount) - utilized, status: 'DRAFT' }
    });
    await logAction(req.user.id, 'GENERATE_UC', 'UtilizationCertificate', uc.id);
    res.status(201).json({ ...uc, grant: g, utilizationPct: Number(g.sanctionedAmount) ? Math.round((utilized / Number(g.sanctionedAmount)) * 1000) / 10 : 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/export/expenses.csv', optionalAuth, async (req, res) => {
  try {
    const exp = await prisma.expense.findMany({ include: { grant: { select: { grantCode: true } }, budgetHead: { select: { name: true } } } });
    const h = 'id,grantCode,vendor,invoice,amount,date,head,status,compliance';
    const NL = String.fromCharCode(10);
    const rows = exp.map(e => [e.id, e.grant.grantCode, e.vendorName, e.invoiceNumber || '', e.amount, e.date.toISOString().slice(0,10), e.budgetHead.name, e.status, e.complianceStatus].map(v => '"' + String(v).replace(/"/g,'""') + '"').join(','));
    res.type('text/csv').set('Content-Disposition', 'attachment; filename=shodhfund-expenses.csv').send([h, ...rows].join(NL));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

};
