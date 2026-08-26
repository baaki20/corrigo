import { NextResponse } from "next/server";
import { publishDueDossiers } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expected || authorization !== `Bearer ${expected}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const published = await publishDueDossiers();
  return NextResponse.json({ ok: true, published, at: new Date().toISOString() });
}
