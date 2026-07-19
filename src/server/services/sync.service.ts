import { PrismaClient, CompetitionTier } from "@prisma/client";
import { apiFootballGet } from "../external/api-football/client";
import { mapStandings } from "../external/api-football/mappers";

const prisma = new PrismaClient();

export async function syncPremierLeagueStandings() {
  const competition = await prisma.competition.upsert({
    where: { externalId: 39 },
    update: {},
    create: {
      externalId: 39,
      name: "Premier League",
      country: "England",
      tier: CompetitionTier.LEAGUE,
    },
  });

  const season = await prisma.season.upsert({
    where: { competitionId_year: { competitionId: competition.id, year: 2023 } },
    update: {},
    create: {
      externalId: 2023,
      competitionId: competition.id,
      year: 2023,
      startDate: new Date("2023-08-11"),
      endDate: new Date("2024-05-19"),
    },
  });

  const raw = await apiFootballGet("standings", { league: "39", season: "2023" });
  const standings = mapStandings(raw);

  for (const row of standings) {
    const team = await prisma.team.upsert({
      where: { externalId: row.teamExternalId },
      update: { name: row.teamName, crestUrl: row.crestUrl },
      create: {
        externalId: row.teamExternalId,
        name: row.teamName,
        crestUrl: row.crestUrl,
      },
    });

    await prisma.standing.upsert({
      where: { seasonId_teamId: { seasonId: season.id, teamId: team.id } },
      update: {
        position: row.position,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
      },
      create: {
        seasonId: season.id,
        teamId: team.id,
        position: row.position,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
      },
    });
  }

  console.log(`Synced ${standings.length} teams and standings.`);
}