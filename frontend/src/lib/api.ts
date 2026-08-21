import { getToken } from "./session";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init?.headers as Record<string, string> || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(path, { ...init, headers });
  const text = await res.text();
  let json: unknown = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { error: text }; }
  if (!res.ok) { const err = json as { error?: string }; throw new Error(err?.error || `${path} ${res.status}`); }
  return json as T;
}