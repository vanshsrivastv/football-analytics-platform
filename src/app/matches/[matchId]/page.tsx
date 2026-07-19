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
        acc.draws = acc.draws + 1;
      } else if ((m.homeScore > m.awayScore) === homeWasOurHomeTeam) {
        acc.homeWins = acc.homeWins + 1;
      } else {
        acc.awayWins = acc.awayWins + 1;
      }
      return acc;
    },
    { homeWins: 0, awayWins: 0, draws: 0 }
  );

  const prediction = activePredictor.predict({
    homeTeamName: match.homeTeam.name,
    awayTeamName: match.awayTeam.name,
    homeTeamPoints: homeStanding?.points ?? null,
    awayTeamPoints: awayStanding?.points ?? null,
    headToHead: headToHeadSummary,
  });

  return (
    <main className="min-h-screen p-8 max-w-md mx-auto">
      <div className="text-[11px] text-[var(--color-text-muted)] mb-4">
        {match.season.competition.name}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-center gap-2 w-24">
          <TeamCrest crestUrl={match.homeTeam.crestUrl} size="lg" />
          <span className="text-sm text-[var(--color-text-primary)]">
            {match.homeTeam.name}
          </span>
          {session && (
            <FavoriteButton
              teamId={match.homeTeamId}
              initiallyFavorited={favoritedTeamIds.includes(match.homeTeamId)}
            />
          )}
        </div>
        <ScoreDisplay homeScore={match.homeScore} awayScore={match.awayScore} />
        <div className="flex flex-col items-center gap-2 w-24">
          <TeamCrest crestUrl={match.awayTeam.crestUrl} size="lg" />
          <span className="text-sm text-[var(--color-text-primary)]">
            {match.awayTeam.name}
          </span>
          {session && (
            <FavoriteButton
              teamId={match.awayTeamId}
              initiallyFavorited={favoritedTeamIds.includes(match.awayTeamId)}
            />
          )}
        </div>
      </div>

      <div className="text-[11px] text-[var(--color-text-muted)] mb-3">
        PREDICTION
      </div>
      <div className="glass p-4 mb-8">
        <ProbabilityBar
          home={prediction.homeWinProbability}
          draw={prediction.drawProbability}
          away={prediction.awayWinProbability}
        />
        <ul className="mt-3 flex flex-col gap-1">
          {prediction.reasoning.map((line, i) => (
            <li key={i} className="text-[11px] text-[var(--color-text-secondary)]">
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-[11px] text-[var(--color-text-muted)] mb-3">
        MATCH STATS
      </div>
      {match.statistics.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          No stats available for this match yet.
        </p>
      ) : (
        <div className="mb-8" />
      )}

      <div className="text-[11px] text-[var(--color-text-muted)] mb-3">
        HEAD-TO-HEAD
      </div>
      {headToHead.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          No previous meetings on record.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {headToHead.map((m) => (
            <div key={m.id} className="glass p-3 text-sm text-[var(--color-text-secondary)]">
              {m.homeTeam.name} {m.homeScore ?? "-"} – {m.awayScore ?? "-"} {m.awayTeam.name}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}