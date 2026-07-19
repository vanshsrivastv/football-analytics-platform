import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { TeamCrest } from "@/shared/components/TeamCrest";
import { ScoreDisplay } from "@/shared/components/ScoreDisplay";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

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

  return (
    <main className="min-h-screen p-8 max-w-md mx-auto">
      <div className="text-[11px] text-[var(--color-text-muted)] mb-4">
        {match.season.competition.name}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col items-center gap-2 w-24">
          <TeamCrest crestUrl={match.homeTeam.crestUrl} size="lg" />
          <span className="text-sm text-[var(--color-text-primary)]">{match.homeTeam.name}</span>
        </div>
        <ScoreDisplay homeScore={match.homeScore} awayScore={match.awayScore} />
        <div className="flex flex-col items-center gap-2 w-24">
          <TeamCrest crestUrl={match.awayTeam.crestUrl} size="lg" />
          <span className="text-sm text-[var(--color-text-primary)]">{match.awayTeam.name}</span>
        </div>
      </div>

      <div className="text-[11px] text-[var(--color-text-muted)] mb-3">MATCH STATS</div>
      {match.statistics.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          No stats available for this match yet.
        </p>
      ) : (
        <div className="mb-8">{/* built once we're actually syncing statistics */}</div>
      )}

      <div className="text-[11px] text-[var(--color-text-muted)] mb-3">HEAD-TO-HEAD</div>
      {headToHead.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">No previous meetings on record.</p>
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