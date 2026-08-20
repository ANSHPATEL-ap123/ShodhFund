# Install ShodhFund on your laptop

Need **Node.js 20+** (`node -v`).

## 1. Open the project

```bash
cd shodhfund
```

## 2. Install (both apps)

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 3. Run — two terminals

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

API: http://localhost:4000/api/health

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

App: **http://localhost:3000**

## Demo

1. Login — `arjun.sharma@university.edu` / any password  
2. Pick role  
3. PI → **+ Add Expense** (OCR hits backend `/api/ocr/extract`)  
4. **Utilization Cert.** → Generate UC (`/api/uc/generate`)

## Troubleshooting

| Issue | Fix |
|--------|-----|
| Frontend loads but OCR fails | Backend not running on 4000 |
| Port in use | `npm run dev -- -p 3001` (frontend) or `PORT=4001 npm run dev` (backend) |
| `next: not found` | `cd frontend && npm install` |
