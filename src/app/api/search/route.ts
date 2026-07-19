import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (query.trim().length < 2) {
    return NextResponse.json({ data: { teams: [] } });
  }

  const teams = await prisma.team.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    take: 10,
    select: { id: true, name: true, crestUrl: true },
  });

  return NextResponse.json({ data: { teams } });
}