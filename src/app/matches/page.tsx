import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";
import { MatchCard } from "@/shared/components/MatchCard";
import { MatchStatus } from "@prisma/client";

const statusMap: Record<string, MatchStatus> = {
  live: MatchStatus.LIVE,
  upcoming: MatchStatus.SCHEDULED,
  finished: MatchStatus.FINISHED,
};

const tabs = [
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "finished", label: "Finished" },
];

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeTab = params.status ?? "upcoming";
  const status = statusMap[activeTab] ?? MatchStatus.SCHEDULED;

  const matches = await prisma.match.findMany({
    where: { status },
    include: {
      homeTeam: true,
      awayTeam: true,
      season: { include: { competition: true } },
    },
    orderBy: { kickoff: "asc" },
  });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-lg text-[var(--color-text-primary)] mb-4">Matches</h1>

      <div className="flex gap-5 mb-6 text-sm">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/matches?status=${tab.key}`}
            className={
              tab.key === activeTab
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text-secondary)]"
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {matches.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-sm">
          No {activeTab} matches right now.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              competitionLabel={match.season.competition.name}
              homeTeamName={match.homeTeam.name}
              awayTeamName={match.awayTeam.name}
              homeCrestUrl={match.homeTeam.crestUrl}
              awayCrestUrl={match.awayTeam.crestUrl}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
            />
          ))}
        </div>
      )}
    </main>
  );
}