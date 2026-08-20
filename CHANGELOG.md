# What was added

## Phase 2 (this update)

### Backend
- `backend/src/ocr.js` — bill OCR from filename/upload; optional `GEMINI_API_KEY`
- `backend/src/pdf.js` — GFR 12-A PDF via pdfkit
- `POST /api/ocr/extract` — multipart file upload (`multer`)
- `GET /api/uc/:id/pdf` — download UC PDF
- `POST /api/ucs/:id/status` — finance approves UC
- `POST /api/notifications/:id/read`
- `PATCH /api/budget-heads/:id` — change allocation
- `GET /api/search?q=`
- `GET /api/export/expenses.csv`

### Frontend
- Add Expense: real file picker (PDF/image); OCR uses file name (`travel`, `consumable`, `duplicate`)
- UC page: **Download PDF**
- Finance → Budget Allocation: edit + Save
- Finance → UC Verification: list, PDF, Approve
- PI → Reports: CSV download
- PI → Notifications: Mark read
- PI → My Grants: search box

### Packages (backend)
`multer`, `pdfkit` — **backend pe dubara `npm install` chalao**

## Phase 1 (already on your machine)
Login, JSON db, expense submit, finance approve/reject, UC draft, anomalies, audit trail.

## How to copy over old folder
Same `robocopy` as before, then:

```bat
cd F:\Desktop\shodhfund\backend
npm install
```
