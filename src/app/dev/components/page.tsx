import { prisma } from "@/shared/lib/prisma";
import { MatchCard } from "@/shared/components/MatchCard";

export default async function ComponentsPreviewPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    take: 5,
  });

  return (
    <main className="min-h-screen p-8 flex flex-col gap-4 items-center">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          competitionLabel="Premier League"
          homeTeamName={match.homeTeam.name}
          awayTeamName={match.awayTeam.name}
          homeCrestUrl={match.homeTeam.crestUrl}
          awayCrestUrl={match.awayTeam.crestUrl}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          probability={{ home: 58, draw: 22, away: 20 }}
        />
      ))}
    </main>
  );
}