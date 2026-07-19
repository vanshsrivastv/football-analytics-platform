-- CreateEnum
CREATE TYPE "CompetitionTier" AS ENUM ('LEAGUE', 'CUP', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitions" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "logoUrl" TEXT,
    "tier" "CompetitionTier" NOT NULL DEFAULT 'LEAGUE',

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "competitionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "crestUrl" TEXT,
    "country" TEXT,
    "venue" TEXT,
    "founded" INTEGER,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_competitions" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "team_competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "nationality" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "photoUrl" TEXT,
    "teamId" TEXT,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "externalId" INTEGER NOT NULL,
    "seasonId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "kickoff" TIMESTAMP(3) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "venue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_statistics" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "possession" INTEGER,
    "shotsTotal" INTEGER,
    "shotsOnGoal" INTEGER,
    "corners" INTEGER,
    "fouls" INTEGER,
    "yellowCards" INTEGER,
    "redCards" INTEGER,
    "passAccuracy" DOUBLE PRECISION,
    "expectedGoals" DOUBLE PRECISION,
    "raw" JSONB,

    CONSTRAINT "match_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standings" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "played" INTEGER NOT NULL,
    "won" INTEGER NOT NULL,
    "drawn" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "standings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT,
    "engineVersion" TEXT NOT NULL,
    "homeWinProbability" DOUBLE PRECISION NOT NULL,
    "drawProbability" DOUBLE PRECISION NOT NULL,
    "awayWinProbability" DOUBLE PRECISION NOT NULL,
    "predictedWinnerId" TEXT,
    "confidence" DOUBLE PRECISION,
    "reasoning" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "playerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "competitions_externalId_key" ON "competitions"("externalId");

-- CreateIndex
CREATE INDEX "competitions_externalId_idx" ON "competitions"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_externalId_key" ON "seasons"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_competitionId_year_key" ON "seasons"("competitionId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "teams_externalId_key" ON "teams"("externalId");

-- CreateIndex
CREATE INDEX "teams_externalId_idx" ON "teams"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "team_competitions_teamId_competitionId_key" ON "team_competitions"("teamId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "players_externalId_key" ON "players"("externalId");

-- CreateIndex
CREATE INDEX "players_externalId_idx" ON "players"("externalId");

-- CreateIndex
CREATE INDEX "players_teamId_idx" ON "players"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "matches_externalId_key" ON "matches"("externalId");

-- CreateIndex
CREATE INDEX "matches_externalId_idx" ON "matches"("externalId");

-- CreateIndex
CREATE INDEX "matches_seasonId_idx" ON "matches"("seasonId");

-- CreateIndex
CREATE INDEX "matches_status_kickoff_idx" ON "matches"("status", "kickoff");

-- CreateIndex
CREATE UNIQUE INDEX "matches_homeTeamId_awayTeamId_kickoff_key" ON "matches"("homeTeamId", "awayTeamId", "kickoff");

-- CreateIndex
CREATE UNIQUE INDEX "match_statistics_matchId_teamId_key" ON "match_statistics"("matchId", "teamId");

-- CreateIndex
CREATE INDEX "standings_seasonId_position_idx" ON "standings"("seasonId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "standings_seasonId_teamId_key" ON "standings"("seasonId", "teamId");

-- CreateIndex
CREATE INDEX "predictions_matchId_idx" ON "predictions"("matchId");

-- CreateIndex
CREATE INDEX "predictions_userId_idx" ON "predictions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_teamId_key" ON "favorites"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_playerId_key" ON "favorites"("userId", "playerId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_competitions" ADD CONSTRAINT "team_competitions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_competitions" ADD CONSTRAINT "team_competitions_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_statistics" ADD CONSTRAINT "match_statistics_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_statistics" ADD CONSTRAINT "match_statistics_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
