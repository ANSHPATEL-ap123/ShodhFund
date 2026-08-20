# ShodhFund — phase-wise build & GitHub guide

Prototype ab **kaam karta hai** (login, expenses persist, finance approve/reject, UC from approved vouchers). Neeche: kya complete hai, next phases, aur GitHub pe kaise daalna.

## Ab kya kaam karta hai (Phase 1)

| Flow | Kaise test karein |
|------|-------------------|
| Login | `demo1234` + listed emails |
| Role switch | `/select-role` |
| Add expense | PI → + Add Expense → OCR → Submit (backend `db.json` mein save) |
| GFR check | Duplicate invoice `TFS/DEL/88421` = NON_COMPLIANT |
| Finance approve | Finance → Expense Verification → Approve / Reject |
| Grant spent | Approve ke baad grant spent update |
| UC | PI → Utilization Cert. → Generate (approved expenses se) |
| Anomalies | Finance → Alerts → Resolve |
| Audit trail | Auditor → Audit Trail |

Data file: `backend/data/db.json` (pehli run pe seed se banti hai). Reset: file delete karke backend restart.

---

## Phase-wise aage kya banana (code daalne ka order)

Har phase **alag commit**. Pehle local pe kaam, phir `git add` / `git commit` / `git push`.

### Phase 1 — Foundation (HO GAYA)

- [x] `frontend/` Next.js + `backend/` Express
- [x] JSON store, seed users/grants/expenses
- [x] Login + 4 dashboards + OCR demo + UC draft

**Commit idea:** `feat: working Phase 1 prototype with API and role dashboards`

### Phase 2 — Real files & AI

- Bill PDF upload (multer / disk)
- Gemini OCR (`GEMINI_API_KEY`) — `backend/src/ocr.js`
- UC PDF download (`@react-pdf/renderer` ya `pdfkit`)
- Email-less notifications already in DB — add mark-as-read

**Commit:** `feat: Gemini OCR and UC PDF export`

### Phase 3 — Auth & Postgres

- Prisma + Neon `DATABASE_URL`
- Auth.js / JWT instead of demo token
- Replace `store.js` with Prisma

**Commit:** `feat: persist grants on Neon Postgres`

### Phase 4 — Hardening

- Zod validation on every POST
- Tests (`node --test` for API)
- Vercel (frontend) + Render/Railway (backend)

**Commit:** `chore: deploy and API validation`

---

## GitHub pe code kaise daalein (Windows)

GitHub pe **empty repo** banao: `shodhfund` (README mat tick karna).

PowerShell / CMD:

```bat
cd F:\Desktop\shodhfund

git init
git add .
git status
git commit -m "feat: working Phase 1 prototype with API and role dashboards"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shodhfund.git
git push -u origin main
```

Agar `git` nahi hai: https://git-scm.com/download/win

### Agle phase ke baad (har baar)

```bat
cd F:\Desktop\shodhfund
git add .
git commit -m "feat: <short description>"
git push
```

### Mat add karna

`node_modules`, `.next`, `backend/data/db.json` — `.gitignore` mein hain.

---

## Local run (yaad rahe)

Do terminals:

```bat
cd F:\Desktop\shodhfund\backend
npm install
npm run dev
```

```bat
cd F:\Desktop\shodhfund\frontend
npm install
npm run dev
```

Browser: http://localhost:3000  
Pehle backend, phir frontend. Password: **demo1234**
