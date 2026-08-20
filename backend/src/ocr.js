/** Demo OCR: filename/hint based. If GEMINI_API_KEY is set, tries Gemini (optional). */

const PACKS = {
  travel: {
    vendor: "MakeMyTrip Business",
    invoice: "MMT-B2B-9921",
    amount: "48200",
    date: "2026-07-08",
    gst: "07AADCM5146R1ZV",
    desc: "Air + hotel — conference travel",
    head: "Travel",
  },
  consumable: {
    vendor: "Sigma-Aldrich",
    invoice: "SA-IN-12011",
    amount: "91200",
    date: "2026-07-02",
    gst: "27AABCS1234A1Z9",
    desc: "Laboratory consumables",
    head: "Consumables",
  },
  duplicate: {
    vendor: "Thermo Fisher Scientific",
    invoice: "TFS/DEL/88421",
    amount: "428500",
    date: "2026-07-14",
    gst: "07AABCT3518Q1Z4",
    desc: "Duplicate equipment invoice (demo)",
    head: "Equipment",
  },
  equipment: {
    vendor: "Thermo Fisher Scientific",
    invoice: `TFS/DEL/${Math.floor(90000 + Math.random() * 9000)}`,
    amount: "187500",
    date: "2026-08-01",
    gst: "07AABCT3518Q1Z4",
    desc: "Lab instrument accessory",
    head: "Equipment",
  },
};

export function extractFromHint(filename = "", hint = "") {
  const t = `${filename} ${hint}`.toLowerCase();
  if (t.includes("dup") || t.includes("88421")) return { ...PACKS.duplicate, source: "demo-ocr" };
  if (t.includes("travel") || t.includes("air") || t.includes("hotel")) return { ...PACKS.travel, source: "demo-ocr" };
  if (t.includes("consum") || t.includes("sigma")) return { ...PACKS.consumable, source: "demo-ocr" };
  if (t.includes("thermo") || t.includes("equip") || t.includes("pcr")) return { ...PACKS.equipment, source: "demo-ocr" };
  return { ...PACKS.equipment, source: "demo-ocr" };
}

export async function extractBill({ filename, hint, buffer }) {
  const local = extractFromHint(filename, hint);
  const key = process.env.GEMINI_API_KEY;
  if (!key || !buffer) {
    return { ...local, notes: key ? "Gemini key set but no file buffer; used demo OCR." : "Demo OCR (set GEMINI_API_KEY for live vision)." };
  }
  try {
    const b64 = buffer.toString("base64");
    const mime = filename?.endsWith(".png") ? "image/png" : filename?.endsWith(".jpg") || filename?.endsWith(".jpeg") ? "image/jpeg" : "application/pdf";
    const body = {
      contents: [{
        parts: [
          { text: "Extract vendor, invoice number, amount (INR number only), date YYYY-MM-DD, GSTIN, description, budget head (Equipment|Consumables|Travel|Contingency). Return JSON only." },
          { inline_data: { mime_type: mime, data: b64 } },
        ],
      }],
    };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return { ...local, notes: "Gemini returned no JSON; demo OCR used.", source: "demo-ocr" };
    const parsed = JSON.parse(m[0]);
    return {
      vendor: parsed.vendor || local.vendor,
      invoice: parsed.invoice || parsed.invoiceNumber || local.invoice,
      amount: String(parsed.amount || local.amount),
      date: parsed.date || local.date,
      gst: parsed.gst || parsed.gstin || local.gst,
      desc: parsed.description || parsed.desc || local.desc,
      head: parsed.head || parsed.budgetHead || local.head,
      source: "gemini",
      notes: "Extracted with Gemini Flash.",
    };
  } catch {
    return { ...local, notes: "Gemini failed; demo OCR used.", source: "demo-ocr" };
  }
}
