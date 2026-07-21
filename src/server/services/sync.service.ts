import { PrismaClient, CompetitionTier } from "@prisma/client";
import { apiFootballGet } from "../external/api-football/client";
import { mapStandings, mapFixtures } from "../external/api-football/mappers";

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
export async function syncTodaysFixtures() {
  const today = new Date().toISOString().split("T")[0];
  const raw = await apiFootballGet("fixtures", { date: today });
  const fixtures = mapFixtures(raw);

  for (const f of fixtures) {
    const competition = await prisma.competition.upsert({
      where: { externalId: f.leagueExternalId },
      update: { name: f.leagueName },
      create: { externalId: f.leagueExternalId, name: f.leagueName },
    });

    const season = await prisma.season.upsert({
      where: { competitionId_year: { competitionId: competition.id, year: f.seasonYear } },
      update: {},
      create: {
        externalId: f.leagueExternalId * 10000 + f.seasonYear,
        competitionId: competition.id,
        year: f.seasonYear,
        startDate: new Date(`${f.seasonYear}-07-01`),
        endDate: new Date(`${f.seasonYear + 1}-06-30`),
      },
    });

    const homeTeam = await prisma.team.upsert({
      where: { externalId: f.homeTeamExternalId },
      update: { name: f.homeTeamName, crestUrl: f.homeCrestUrl },
      create: { externalId: f.homeTeamExternalId, name: f.homeTeamName, crestUrl: f.homeCrestUrl },
    });

    const awayTeam = await prisma.team.upsert({
      where: { externalId: f.awayTeamExternalId },
      update: { name: f.awayTeamName, crestUrl: f.awayCrestUrl },
      create: { externalId: f.awayTeamExternalId, name: f.awayTeamName, crestUrl: f.awayCrestUrl },
    });

    await prisma.match.upsert({
      where: {
        homeTeamId_awayTeamId_kickoff: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          kickoff: new Date(f.kickoff),
        },
      },
      update: { status: f.status, homeScore: f.homeScore, awayScore: f.awayScore },
      create: {
        externalId: f.externalId,
        seasonId: season.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        kickoff: new Date(f.kickoff),
        status: f.status,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      },
    });
  }

  console.log(`Synced ${fixtures.length} real fixtures for ${today}.`);
}