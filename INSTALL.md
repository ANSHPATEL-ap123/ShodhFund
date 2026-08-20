# Install ShodhFund (Windows / laptop)

Need Node.js 20+: https://nodejs.org (`node -v`)

## Install

```bat
cd F:\Desktop\shodhfund\backend
npm install

cd F:\Desktop\shodhfund\frontend
npm install
```

## Run (2 terminals)

**1 — API**
```bat
cd F:\Desktop\shodhfund\backend
npm run dev
```
Expect: `ShodhFund API http://localhost:4000`

**2 — UI**
```bat
cd F:\Desktop\shodhfund\frontend
npm run dev
```
Open **http://localhost:3000**

## Demo accounts (password `demo1234`)

| Role | Email |
|------|--------|
| PI | arjun.sharma@university.edu |
| Finance | rohit.mehta@university.edu |
| Admin | meera.iyer@university.edu |
| Auditor | sk.verma@university.edu |

## Working demo path

1. Login as PI → Add Expense (OCR) → Submit  
2. Switch role → Finance → Expense Verification → Approve  
3. Switch role → PI → Utilization Cert. → Generate UC  
4. Auditor → Audit Trail (actions logged)

If login fails: backend band hai. `ERR_MODULE_NOT_FOUND express` = `npm install` backend folder mein nahi chala.

GitHub steps: see **GUIDE.md**
