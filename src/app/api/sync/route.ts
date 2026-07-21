import { NextRequest, NextResponse } from "next/server";
import { syncTodaysFixtures } from "@/server/services/sync.service";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  await syncTodaysFixtures();
  return NextResponse.json({ data: { synced: true } });
}