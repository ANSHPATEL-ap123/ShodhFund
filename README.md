# ShodhFund

AI-assisted, GFR-aware research grant lifecycle for Indian universities.  
SIH 2026 · USICT013 · **Phase 3 product slice** (JSON demo store + JWT).

```
frontend/   Next.js 15  → http://localhost:3000
backend/    Express     → http://localhost:4000
demo-bills/ OCR sample PDFs
HANDOFF.md  what to build next
```

```bat
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Demo password: `demo1234`  
PI `arjun.sharma@university.edu`

### Working product
Login (JWT) · 4 roles · expenses + OCR · finance approve · UC PDF · CSV · Ask NL query · register grant · calendar · anomalies · audit trail

Optional `backend/.env`: `JWT_SECRET`, `GEMINI_API_KEY`, R2, later `DATABASE_URL` (Prisma schema in `backend/prisma/`).
