import { NextRequest } from "next/server";
import { handleApi } from "@/server/handleApi";

export const runtime = "nodejs";

async function run(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return handleApi(req, path || []);
}

export const GET = run;
export const POST = run;
export const PATCH = run;
export const PUT = run;
export const DELETE = run;
