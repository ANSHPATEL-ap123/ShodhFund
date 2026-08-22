import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function handleApi(req: NextRequest, parts: string[]) {
  const path = parts.join("/");
  const u = new URL(req.url);
  const target = `${API}/api/${path}${u.search}`;
  const h: Record<string, string> = {};
  const auth = req.headers.get("authorization");
  if (auth) h["authorization"] = auth;
  const ct = req.headers.get("content-type");
  if (ct) h["content-type"] = ct;
  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") body = await req.text();
  try {
    const res = await fetch(target, { method: req.method, headers: h, body });
    const data = await res.arrayBuffer();
    const rh = new Headers();
    res.headers.forEach((v, k) => { if (!["transfer-encoding", "content-encoding", "content-length"].includes(k)) rh.set(k, v); });
    return new NextResponse(data, { status: res.status, headers: rh });
  } catch (e: any) {
    return NextResponse.json({ error: `Backend unreachable: ${e.message}` }, { status: 502 });
  }
}
