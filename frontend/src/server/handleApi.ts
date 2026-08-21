import { NextRequest, NextResponse } from "next/server";
import { db, mutate, nextId } from "./store.js";
import { signToken, verifyToken } from "./auth.js";
import { extractBill } from "./ocr.js";
import { ucPdfBuffer } from "./pdf.js";
import { answerQuestion } from "./ask.js";

function publicUser(u: Record<string, unknown> | null) {
  if (!u) return null;
  const { password: _p, ...rest } = u;
  return rest;
}

function bearer(req: NextRequest) {
  const h = req.headers.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  return t ? verifyToken(t) : null;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function log(data: any, userId: string, action: string, entityType: string, entityId: string, metadata: object = {}) {
  data.auditLogs.unshift({
    id: nextId("AL", data.auditLogs),
    action,
    entityType,
    entityId,
    userId: userId || "system",
    createdAt: new Date().toISOString(),
    metadata,
  });
}

function checkCompliance(exp: any, data: any) {
  const notes: string[] = [];
  let status = "COMPLIANT";
  const dup = data.expenses.find((e: any) => e.id !== exp.id && e.invoice && exp.invoice && e.invoice === exp.invoice);
  if (dup) {
    status = "NON_COMPLIANT";
    notes.push(`Duplicate invoice ${exp.invoice} already used on ${dup.id}`);
  }
  if (exp.head === "Travel" && Number(exp.amount) > 45000) {
    if (status === "COMPLIANT") status = "WARNING";
    notes.push("Travel exceeds GFR metro band");
  }
  return { status, notes };
}

function recomputeSpent(data: any, grantId: string) {
  const approved = data.expenses.filter((e: any) => e.grantId === grantId && e.status === "APPROVED");
  const g = data.grants.find((x: any) => x.id === grantId);
  if (g) g.spent = approved.reduce((s: number, e: any) => s + Number(e.amount), 0);
}

export async function handleApi(req: NextRequest, parts: string[]) {
  const method = req.method;
  const path = parts.join("/");
  const url = new URL(req.url);
  const q = url.searchParams;
  let body: any = {};
  const ct = req.headers.get("content-type") || "";
  if (method !== "GET" && method !== "HEAD") {
    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries());
      body.__file = fd.get("file");
    } else {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }
  }
  const user = bearer(req) as { id?: string; email?: string; role?: string } | null;

  try {
    if (path === "health" && method === "GET") {
      return json({
        ok: true,
        service: "shodhfund-next-api",
        jwt: Boolean(process.env.JWT_SECRET),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        r2: Boolean(process.env.R2_ACCESS_KEY_ID),
        neon: Boolean(process.env.DATABASE_URL),
        store: "json",
      });
    }
    if (path === "auth/login" && method === "POST") {
      const data = db();
      const u = data.users.find((x: any) => x.email.toLowerCase() === String(body.email || "").toLowerCase().trim());
      if (!u || u.password !== String(body.password || "")) {
        return json({ error: "Invalid email or password. Demo password is demo1234." }, 401);
      }
      const token = signToken({ id: u.id, email: u.email, role: u.role });
      return json({ token, user: publicUser(u) });
    }
    if (path === "users" && method === "GET") return json(db().users.map(publicUser));
    if (path === "stats" && method === "GET") {
      const data = db();
      let grants = data.grants;
      if (q.get("role") === "PI" && q.get("userId")) grants = grants.filter((g: any) => g.piId === q.get("userId"));
      const sanctioned = grants.reduce((s: number, g: any) => s + g.amount, 0);
      const spent = grants.reduce((s: number, g: any) => s + g.spent, 0);
      return json({
        grants: grants.length,
        sanctioned,
        spent,
        utilization: sanctioned ? Math.round((spent / sanctioned) * 1000) / 10 : 0,
        pendingExpenses: data.expenses.filter((e: any) => e.status === "SUBMITTED").length,
        anomalies: data.anomalies.filter((a: any) => !a.resolved).length,
        departments: new Set(data.grants.map((g: any) => g.department)).size,
      });
    }
    if (path === "grants" && method === "GET") {
      let list = db().grants;
      if (q.get("piId")) list = list.filter((g: any) => g.piId === q.get("piId"));
      return json(list);
    }
    if (path === "grants" && method === "POST") {
      if (!user) return json({ error: "Authentication required" }, 401);
      if (!body.title || !body.agency) return json({ error: "title and agency required" }, 400);
      const row = mutate((data: any) => {
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
          piId: user.id || "u-pi",
          pi: body.pi || user.email || "PI",
          department: body.department || "Biotechnology",
          ucDue: body.ucDue || "2026-12-31",
        };
        data.grants.unshift(g);
        log(data, g.piId, "CREATE_GRANT", "Grant", g.id);
        return g;
      });
      return json(row, 201);
    }
    if (path.startsWith("grants/") && method === "GET") {
      const id = parts[1];
      const data = db();
      const g = data.grants.find((x: any) => x.id === id);
      if (!g) return json({ error: "Grant not found" }, 404);
      return json({
        ...g,
        budgetHeads: data.budgetHeads.filter((b: any) => b.grantId === g.id),
        expenses: data.expenses.filter((e: any) => e.grantId === g.id),
        milestones: data.milestones.filter((m: any) => m.grantId === g.id),
      });
    }
    if (path === "expenses" && method === "GET") {
      let list = db().expenses;
      if (q.get("grantId")) list = list.filter((e: any) => e.grantId === q.get("grantId"));
      if (q.get("status")) list = list.filter((e: any) => e.status === q.get("status"));
      return json(list);
    }
    if (path === "expenses" && method === "POST") {
      if (!user) return json({ error: "Authentication required" }, 401);
      const row = mutate((data: any) => {
        const exp: any = {
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
          submittedById: user.id || "u-pi",
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
        log(data, exp.submittedById, "SUBMIT_EXPENSE", "Expense", exp.id);
        return exp;
      });
      return json(row, 201);
    }
    if (path.match(/^expenses\/.+\/decide$/) && method === "POST") {
      if (!user) return json({ error: "Authentication required" }, 401);
      const id = parts[1];
      const action = String(body.action || "").toUpperCase();
      const row = mutate((data: any) => {
        const exp = data.expenses.find((e: any) => e.id === id);
        if (!exp) return null;
        exp.status = action;
        recomputeSpent(data, exp.grantId);
        log(data, user.id || "u-fin", action, "Expense", exp.id);
        return exp;
      });
      if (!row) return json({ error: "Expense not found" }, 404);
      return json(row);
    }
    if (path === "anomalies" && method === "GET") return json(db().anomalies);
    if (path.match(/^anomalies\/.+\/resolve$/) && method === "POST") {
      const id = parts[1];
      const row = mutate((data: any) => {
        const a = data.anomalies.find((x: any) => x.id === id);
        if (a) a.resolved = true;
        return a;
      });
      return row ? json(row) : json({ error: "Not found" }, 404);
    }
    if (path === "budget-heads" && method === "GET") {
      let list = db().budgetHeads;
      if (q.get("grantId")) list = list.filter((b: any) => b.grantId === q.get("grantId"));
      return json(list);
    }
    if (path.startsWith("budget-heads/") && method === "PATCH") {
      const id = parts[1];
      const allocated = Number(body.allocated);
      const row = mutate((data: any) => {
        const b = data.budgetHeads.find((x: any) => x.id === id);
        if (!b) return null;
        if (!Number.isNaN(allocated)) b.allocated = allocated;
        return b;
      });
      return row ? json(row) : json({ error: "Not found" }, 404);
    }
    if (path === "notifications" && method === "GET") {
      let list = db().notifications;
      if (q.get("userId")) list = list.filter((n: any) => n.userId === q.get("userId"));
      return json(list);
    }
    if (path.match(/^notifications\/.+\/read$/) && method === "POST") {
      const id = parts[1];
      const row = mutate((data: any) => {
        const n = data.notifications.find((x: any) => x.id === id);
        if (n) n.read = true;
        return n;
      });
      return row ? json(row) : json({ error: "Not found" }, 404);
    }
    if (path === "search" && method === "GET") {
      const s = String(q.get("q") || "").toLowerCase();
      const data = db();
      if (!s) return json({ grants: [], expenses: [] });
      return json({
        grants: data.grants.filter((g: any) => `${g.id} ${g.title} ${g.agency}`.toLowerCase().includes(s)),
        expenses: data.expenses.filter((e: any) => `${e.id} ${e.vendor} ${e.invoice}`.toLowerCase().includes(s)),
      });
    }
    if (path === "export/expenses.csv" && method === "GET") {
      const list = db().expenses;
      const header = "id,grantId,vendor,invoice,amount,date,head,status,compliance,gst";
      const lines = list.map((e: any) =>
        [e.id, e.grantId, e.vendor, e.invoice, e.amount, e.date, e.head, e.status, e.compliance, e.gst]
          .map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`)
          .join(",")
      );
      return new NextResponse([header, ...lines].join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=shodhfund-expenses.csv",
        },
      });
    }
    if (path === "milestones" && method === "GET") return json(db().milestones);
    if (path === "audit-logs" && method === "GET") return json(db().auditLogs.slice(0, 80));
    if (path === "objections" && method === "GET") return json(db().objections);
    if (path === "approvals" && method === "GET") return json(db().approvals);
    if (path === "ocr/extract" && method === "POST") {
      const file = body.__file as File | undefined;
      const filename = (file && "name" in file ? file.name : "") || String(body.filename || body.hint || "");
      let buffer: Buffer | undefined;
      if (file && typeof (file as File).arrayBuffer === "function") {
        buffer = Buffer.from(await (file as File).arrayBuffer());
      }
      const extracted = await extractBill({ filename, hint: filename, buffer });
      return json({ ...extracted, compliance: "PENDING" });
    }
    if (path === "uc/generate" && method === "POST") {
      if (!user) return json({ error: "Authentication required" }, 401);
      const data0 = db();
      const grantId = body.grantId || data0.grants[0].id;
      const g = data0.grants.find((x: any) => x.id === grantId) || data0.grants[0];
      const uc = mutate((d: any) => {
        const approved = d.expenses.filter((e: any) => e.grantId === g.id && e.status === "APPROVED");
        const utilized = approved.reduce((s: number, e: any) => s + e.amount, 0) || g.spent;
        const doc = {
          id: nextId("UC", d.ucs),
          grantId: g.id,
          financialYear: body.financialYear || "2025-26",
          period: body.period || "01 Apr 2025 – 31 Mar 2026",
          totalUtilized: utilized,
          balanceAmount: g.amount - utilized,
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          heads: d.budgetHeads.filter((b: any) => b.grantId === g.id),
          expenses: approved,
        };
        d.ucs.unshift(doc);
        log(d, user.id || "u-pi", "GENERATE_UC", "UC", doc.id);
        return doc;
      });
      return json({
        ...uc,
        grant: g,
        utilizationPct: g.amount ? Math.round((uc.totalUtilized / g.amount) * 1000) / 10 : 0,
        summary: `GFR 12-A draft for ${g.id}.`,
      });
    }
    if (path === "ucs" && method === "GET") return json(db().ucs);
    if (path.match(/^ucs\/.+\/status$/) && method === "POST") {
      const id = parts[1];
      const row = mutate((data: any) => {
        const u = data.ucs.find((x: any) => x.id === id);
        if (!u) return null;
        u.status = String(body.status || "").toUpperCase();
        return u;
      });
      return row ? json(row) : json({ error: "Not found" }, 404);
    }
    if (path.match(/^uc\/.+\/pdf$/) && method === "GET") {
      const id = parts[1];
      const data = db();
      const uc = data.ucs.find((x: any) => x.id === id);
      if (!uc) return json({ error: "Generate a UC first, then download PDF." }, 404);
      const grant = data.grants.find((g: any) => g.id === uc.grantId);
      const buf = await ucPdfBuffer({ grant, uc, heads: uc.heads || data.budgetHeads.filter((b: any) => b.grantId === uc.grantId) });
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${uc.id}.pdf"`,
        },
      });
    }
    if (path === "calendar" && method === "GET") {
      const data = db();
      const events = [
        ...data.grants.map((g: any) => ({
          id: `uc-${g.id}`,
          type: "UC_DUE",
          date: g.ucDue,
          title: `UC due · ${g.agency}`,
          subtitle: g.title,
          href: `/grants/${g.id}`,
        })),
        ...data.milestones.map((m: any) => ({
          id: m.id,
          type: "MILESTONE",
          date: m.dueDate,
          title: m.title,
          subtitle: m.grantId,
          href: `/grants/${m.grantId}`,
        })),
      ].sort((a, b) => String(a.date).localeCompare(String(b.date)));
      return json(events);
    }
    if (path === "ask" && method === "POST") return json(answerQuestion(body.q, db()));
    return json({ error: `Cannot ${method} /api/${path}` }, 404);
  } catch (e: any) {
    console.error(e);
    return json({ error: e.message || "Server error" }, 500);
  }
}
