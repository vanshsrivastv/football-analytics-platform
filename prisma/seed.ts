import { PrismaClient, CompetitionTier, MatchStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const premierLeague = await prisma.competition.upsert({
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
    where: { competitionId_year: { competitionId: premierLeague.id, year: 2025 } },
    update: {},
    create: {
      externalId: 1001,
      competitionId: premierLeague.id,
      year: 2025,
      startDate: new Date("2025-08-16"),
      endDate: new Date("2026-05-24"),
    },
  });

  const arsenal = await prisma.team.upsert({
    where: { externalId: 42 },
    update: {},
    create: { externalId: 42, name: "Arsenal", shortName: "ARS", country: "England" },
  });

  const chelsea = await prisma.team.upsert({
    where: { externalId: 49 },
    update: {},
    create: { externalId: 49, name: "Chelsea", shortName: "CHE", country: "England" },
  });

  const manCity = await prisma.team.upsert({
    where: { externalId: 50 },
    update: {},
    create: { externalId: 50, name: "Manchester City", shortName: "MCI", country: "England" },
  });

  const liverpool = await prisma.team.upsert({
    where: { externalId: 40 },
    update: {},
    create: { externalId: 40, name: "Liverpool", shortName: "LIV", country: "England" },
  });

  await prisma.match.upsert({
    where: {
      homeTeamId_awayTeamId_kickoff: {
        homeTeamId: arsenal.id,
        awayTeamId: chelsea.id,
        kickoff: new Date("2026-08-23T14:00:00Z"),
      },
    },
    update: {},
    create: {
      externalId: 500001,
      seasonId: season.id,
      homeTeamId: arsenal.id,
      awayTeamId: chelsea.id,
      kickoff: new Date("2026-08-23T14:00:00Z"),
      status: MatchStatus.SCHEDULED,
    },
  });

  await prisma.match.upsert({
    where: {
      homeTeamId_awayTeamId_kickoff: {
        homeTeamId: manCity.id,
        awayTeamId: liverpool.id,
        kickoff: new Date("2026-08-24T16:30:00Z"),
      },
    },
    update: {},
    create: {
      externalId: 500002,
      seasonId: season.id,
      homeTeamId: manCity.id,
      awayTeamId: liverpool.id,
      kickoff: new Date("2026-08-24T16:30:00Z"),
      status: MatchStatus.SCHEDULED,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });