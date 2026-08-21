import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_PROXY || "http://127.0.0.1:4000";

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const url = new URL(req.url);
  const dest = `${BACKEND}/api/${path.join("/")}${url.search}`;
  try {
    const headers = new Headers();
    const ct = req.headers.get("content-type");
    if (ct) headers.set("content-type", ct);
    const auth = req.headers.get("authorization");
    if (auth) headers.set("authorization", auth);
    const init: RequestInit = { method: req.method, headers, redirect: "manual" };
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = Buffer.from(await req.arrayBuffer());
    }
    const r = await fetch(dest, init);
    const buf = await r.arrayBuffer();
    const out = new Headers();
    const rct = r.headers.get("content-type");
    const disp = r.headers.get("content-disposition");
    if (rct) out.set("content-type", rct);
    if (disp) out.set("content-disposition", disp);
    return new NextResponse(buf, { status: r.status, headers: out });
  } catch {
    return NextResponse.json(
      { error: "Backend not running on port 4000. cd backend && npm install && npm run dev" },
      { status: 503 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
