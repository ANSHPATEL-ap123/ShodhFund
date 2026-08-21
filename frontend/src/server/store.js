import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seed } from "./seed.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
const file = path.join(dir, "db.json");

const KEYS = [
  "users", "grants", "budgetHeads", "expenses", "anomalies",
  "notifications", "approvals", "auditLogs", "ucs", "milestones", "objections",
];

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const row of list) {
    const id = row?.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(row);
  }
  return out;
}

function merge(raw) {
  const base = seed();
  if (!raw || typeof raw !== "object") return base;
  for (const k of KEYS) {
    if (!Array.isArray(raw[k])) raw[k] = base[k];
    else raw[k] = dedupe(raw[k]);
  }
  return raw;
}

function load() {
  try {
    if (!fs.existsSync(file)) {
      fs.mkdirSync(dir, { recursive: true });
      const fresh = seed();
      fs.writeFileSync(file, JSON.stringify(fresh, null, 2));
      return fresh;
    }
    const parsed = JSON.parse(fs.readFileSync(file, "utf8") || "{}");
    return merge(parsed);
  } catch {
    const fresh = seed();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function save(data) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function db() {
  return load();
}

export function mutate(fn) {
  const data = load();
  const result = fn(data);
  save(data);
  return result;
}

export function nextId(prefix, list) {
  const arr = Array.isArray(list) ? list : [];
  const nums = arr
    .map((x) => Number(String(x?.id ?? "").replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  const max = nums.length ? Math.max(...nums) : 1000;
  let n = max + 1;
  const ids = new Set(arr.map((x) => x?.id));
  while (ids.has(`${prefix}-${n}`)) n += 1;
  return `${prefix}-${n}`;
}
