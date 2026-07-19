import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: "UNAUTHENTICATED" } }, { status: 401 });
  }

  const { teamId } = await request.json();

  const existing = await prisma.favorite.findFirst({
    where: { userId: session.user.id, teamId },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ data: { favorited: false } });
  }

  await prisma.favorite.create({
    data: { userId: session.user.id, teamId },
  });
  return NextResponse.json({ data: { favorited: true } });
}