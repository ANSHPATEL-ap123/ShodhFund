/**
 * ShodhFund — OCR Module (enhanced Gemini + demo fallback)
 *
 * Flow:
 * 1. If GEMINI_API_KEY + file buffer → send to Gemini Vision API
 * 2. Parse JSON response into structured fields
 * 3. Fallback to demo filename-based OCR if Gemini fails or key missing
 */

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

/** Demo OCR: filename/hint based */
export function extractFromHint(filename = "", hint = "") {
  const t = `${filename} ${hint}`.toLowerCase();
  if (t.includes("dup") || t.includes("88421")) return { ...PACKS.duplicate, source: "demo-ocr" };
  if (t.includes("travel") || t.includes("air") || t.includes("hotel")) return { ...PACKS.travel, source: "demo-ocr" };
  if (t.includes("consum") || t.includes("sigma")) return { ...PACKS.consumable, source: "demo-ocr" };
  if (t.includes("thermo") || t.includes("equip") || t.includes("pcr")) return { ...PACKS.equipment, source: "demo-ocr" };
  return { ...PACKS.equipment, source: "demo-ocr" };
}

/** Determine MIME type from filename */
function mimeType(filename) {
  const ext = (filename || "").toLowerCase().split(".").pop();
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/tiff",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return map[ext] || "application/pdf";
}

/** Gemini prompt for bill/invoice extraction */
const GEMINI_PROMPT = `You are an expert at extracting structured data from Indian invoices and bills for a university research grant management system.

Extract the following fields from this bill/invoice:
- vendor: Name of the vendor/supplier
- invoiceNumber: Invoice or bill number
- amount: Total amount in INR (number only, no currency symbol or commas)
- date: Invoice date in YYYY-MM-DD format
- gst: GSTIN (GST Number) of the supplier - 15-character format like 07AABCT3518Q1Z4
- description: Brief description of goods/services (1 line)
- head: Most appropriate budget head category - one of: Equipment, Consumables, Travel, Contingency, Manpower, Overhead

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanation. Just the JSON object.

Example output:
{"vendor":"Thermo Fisher Scientific","invoiceNumber":"TFS/DEL/88421","amount":"428500","date":"2026-07-12","gst":"07AABCT3518Q1Z4","description":"QuantStudio reagents and lab supplies","head":"Equipment"}`;

/**
 * Main extraction function.
 * @param {Object} opts
 * @param {string} opts.filename - Original filename
 * @param {string} opts.hint - Text hint (usually same as filename)
 * @param {Buffer} opts.buffer - File buffer (required for Gemini)
 * @returns {Promise<Object>} Extracted fields
 */
export async function extractBill({ filename, hint, buffer }) {
  const local = extractFromHint(filename, hint);
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return { ...local, notes: "Demo OCR (set GEMINI_API_KEY for live vision)." };
  }

  if (!buffer) {
    return { ...local, notes: "Gemini key set but no file buffer; used demo OCR." };
  }

  try {
    const b64 = buffer.toString("base64");
    const mime = mimeType(filename);

    const body = {
      contents: [{
        parts: [
          { text: GEMINI_PROMPT },
          { inline_data: { mime_type: mime, data: b64 } },
        ],
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error(`Gemini API error ${r.status}: ${errText.slice(0, 200)}`);
      return { ...local, notes: `Gemini API error ${r.status}; demo OCR used.`, source: "demo-ocr" };
    }

    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse JSON from the response
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) {
      return { ...local, notes: "Gemini returned no JSON; demo OCR used.", source: "demo-ocr" };
    }

    const parsed = JSON.parse(m[0]);

    // Validate and return with confidence
    const result = {
      vendor: parsed.vendor || parsed.vendorName || local.vendor,
      invoice: parsed.invoiceNumber || parsed.invoice || local.invoice,
      amount: String(parsed.amount || local.amount),
      date: parsed.date || local.date,
      gst: parsed.gst || parsed.gstin || parsed.gstNumber || local.gst,
      desc: parsed.description || parsed.desc || local.desc,
      head: parsed.head || parsed.budgetHead || parsed.category || local.head,
      source: "gemini",
      notes: "Extracted with Gemini Flash.",
      confidence: parsed.amount ? "high" : "low",
    };

    // Validate GSTIN format
    if (result.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i.test(result.gst)) {
      result.notes += " (GSTIN format may be invalid)";
      result.confidence = "medium";
    }

    return result;
  } catch (err) {
    console.error("Gemini OCR error:", err.message);
    return { ...local, notes: "Gemini failed; demo OCR used.", source: "demo-ocr" };
  }
}
