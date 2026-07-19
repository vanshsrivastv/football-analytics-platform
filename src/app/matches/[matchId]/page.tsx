import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { TeamCrest } from "@/shared/components/TeamCrest";
import { ScoreDisplay } from "@/shared/components/ScoreDisplay";
import { ProbabilityBar } from "@/shared/components/ProbabilityBar";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { activePredictor } from "@/features/predictions/engine";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const session = await auth();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      season: { include: { competition: true } },
      statistics: true,
    },
  });

  if (!match) {
    notFound();
  }

  const favoritedTeamIds = session?.user?.id
    ? (
        await prisma.favorite.findMany({
          where: {
            userId: session.user.id,
            teamId: { in: [match.homeTeamId, match.awayTeamId] },
          },
        })
      ).map((f) => f.teamId)
    : [];

  const headToHead = await prisma.match.findMany({
    where: {
      id: { not: match.id },
      OR: [
        { homeTeamId: match.homeTeamId, awayTeamId: match.awayTeamId },
        { homeTeamId: match.awayTeamId, awayTeamId: match.homeTeamId },
      ],
    },
    orderBy: { kickoff: "desc" },
    take: 5,
    include: { homeTeam: true, awayTeam: true },
  });

  const [homeStanding, awayStanding] = await Promise.all([
    prisma.standing.findFirst({
      where: { teamId: match.homeTeamId, seasonId: match.seasonId },
    }),
    prisma.standing.findFirst({
      where: { teamId: match.awayTeamId, seasonId: match.seasonId },
    }),
  ]);

  const headToHeadSummary = headToHead.reduce(
    (acc, m) => {
      if (m.homeScore === null || m.awayScore === null) {
        return acc;
      }
      const homeWasOurHomeTeam = m.homeTeamId === match.homeTeamId;
      if (m.homeScore === m.awayScore) {
        acc.draws =