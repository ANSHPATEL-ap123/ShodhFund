export const users = {
  PI: { name: "Dr. Arjun Sharma", email: "arjun.sharma@university.edu", dept: "Biotechnology", role: "PI" },
  FINANCE: { name: "Rohit Mehta", email: "rohit.mehta@university.edu", dept: "Accounts", role: "FINANCE" },
  ADMIN: { name: "Dr. Meera Iyer", email: "meera.iyer@university.edu", dept: "Research Office", role: "ADMIN" },
  AUDITOR: { name: "S.K. Verma", email: "sk.verma@university.edu", dept: "Internal Audit", role: "AUDITOR" },
};

export const grants = [
  { id: "GR-DST-2401", title: "CRISPR-based diagnostics for AMR pathogens", agency: "DST", amount: 8450000, spent: 5620000, start: "2024-04-01", end: "2027-03-31", status: "ACTIVE", pi: "Dr. Arjun Sharma", ucDue: "2026-09-30" },
  { id: "GR-SERB-2318", title: "Metabolic engineering of microbial hosts", agency: "SERB", amount: 6200000, spent: 4180000, start: "2023-10-01", end: "2026-09-30", status: "ACTIVE", pi: "Dr. Arjun Sharma", ucDue: "2026-08-31" },
  { id: "GR-ICMR-2512", title: "Point-of-care TB assay validation", agency: "ICMR", amount: 9850000, spent: 6900000, start: "2025-01-15", end: "2028-01-14", status: "ACTIVE", pi: "Dr. Arjun Sharma", ucDue: "2026-10-15" },
  { id: "GR-UGC-2209", title: "Computational genomics core facility", agency: "UGC", amount: 4120000, spent: 4010000, start: "2022-07-01", end: "2026-06-30", status: "ACTIVE", pi: "Dr. Priya Verma", ucDue: "2026-08-20" },
  { id: "GR-CSIR-2411", title: "Green catalysis for pharma intermediates", agency: "CSIR", amount: 5300000, spent: 2100000, start: "2024-08-01", end: "2027-07-31", status: "ACTIVE", pi: "Dr. Kumar Iyer", ucDue: "2026-11-01" },
];

export const expenses = [
  { id: "EXP-1042", grant: "GR-DST-2401", vendor: "Thermo Fisher Scientific", invoice: "TFS/DEL/88421", amount: 428500, date: "2026-07-12", head: "Equipment", status: "SUBMITTED", compliance: "COMPLIANT", gst: "07AABCT3518Q1Z4" },
  { id: "EXP-1041", grant: "GR-DST-2401", vendor: "MakeMyTrip Business", invoice: "MMT-B2B-9921", amount: 48200, date: "2026-07-08", head: "Travel", status: "APPROVED", compliance: "COMPLIANT", gst: "07AADCM5146R1ZV" },
  { id: "EXP-1039", grant: "GR-SERB-2318", vendor: "Sigma-Aldrich", invoice: "SA-IN-12011", amount: 91200, date: "2026-07-02", head: "Consumables", status: "APPROVED", compliance: "COMPLIANT", gst: "27AABCS1234A1Z9" },
  { id: "EXP-1038", grant: "GR-ICMR-2512", vendor: "Office Depot India", invoice: "ODI-44190", amount: 18500, date: "2026-06-28", head: "Contingency", status: "CORRECTION_REQUESTED", compliance: "WARNING", gst: "07AAACO0000A1Z1" },
  { id: "EXP-1035", grant: "GR-DST-2401", vendor: "Thermo Fisher Scientific", invoice: "TFS/DEL/88421", amount: 428500, date: "2026-07-14", head: "Equipment", status: "SUBMITTED", compliance: "NON_COMPLIANT", gst: "07AABCT3518Q1Z4" },
  { id: "EXP-1028", grant: "GR-UGC-2209", vendor: "Dell Technologies", invoice: "DELL-IN-7721", amount: 186000, date: "2026-06-11", head: "Equipment", status: "APPROVED", compliance: "COMPLIANT", gst: "29AABCD1234E1Z5" },
  { id: "EXP-1021", grant: "GR-CSIR-2411", vendor: "IRCTC Tourism", invoice: "IR-88921", amount: 12400, date: "2026-05-22", head: "Travel", status: "REJECTED", compliance: "WARNING", gst: "07AAACI0000A1Z8" },
];

export const anomalies = [
  { id: "AN-01", severity: "HIGH", reason: "Duplicate invoice TFS/DEL/88421 submitted twice (EXP-1042 & EXP-1035)", expense: "EXP-1035" },
  { id: "AN-02", severity: "MEDIUM", reason: "Travel claim exceeds GFR per-diem cap for metro city (₹4,820 vs ₹4,500)", expense: "EXP-1041" },
  { id: "AN-03", severity: "HIGH", reason: "Vendor GSTIN checksum failed — possible transcription error", expense: "EXP-1038" },
];

export const budgetHeads = [
  { name: "Equipment", allocated: 12000000, spent: 8100000 },
  { name: "Consumables", allocated: 6800000, spent: 4200000 },
  { name: "Travel", allocated: 2100000, spent: 980000 },
  { name: "Contingency", allocated: 1400000, spent: 620000 },
  { name: "Manpower", allocated: 5400000, spent: 3100000 },
  { name: "Overhead", allocated: 1800000, spent: 900000 },
];

export const notifications = [
  { title: "UC due in 41 days", message: "DST CRISPR grant UC for FY 2025-26 is due 30 Sep 2026.", type: "UC_DUE" },
  { title: "Expense pending approval", message: "Thermo Fisher invoice ₹4,28,500 awaits finance verification.", type: "APPROVAL_PENDING" },
  { title: "Anomaly flagged", message: "Duplicate bill detected on GR-DST-2401.", type: "ANOMALY_DETECTED" },
];
