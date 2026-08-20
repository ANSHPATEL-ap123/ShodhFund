import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seed } from "./seed.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data");
const file = path.join(dir, "db.json");

function load() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(db) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
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
  const nums = list
    .map((x) => Number(String(x.id).replace(/\D/g, "")))
    .filter((n) => !Number.isNaN(n));
  return `${prefix}-${Math.max(1000, ...nums, 1000) + 1}`;
}
