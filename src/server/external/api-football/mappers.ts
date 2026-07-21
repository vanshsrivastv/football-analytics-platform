export interface MappedStanding {
  teamExternalId: number;
  teamName: string;
  crestUrl: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
 
export function mapStandings(raw: any): MappedStanding[] {
  const rows = raw.response[0].league.standings[0];
 
  return rows.map((row: any) => ({
    teamExternalId: row.team.id,
    teamName: row.team.name,
    crestUrl: row.team.logo,
    position: row.rank,
    played: row.all.played,
    won: row.all.win,
    drawn: row.all.draw,
    lost: row.all.lose,
    goalsFor: row.all.goals.for,
    goalsAgainst: row.all.goals.against,
    points: row.points,
  }));
}
 
const statusMap: Record<string, "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED"> = {
  NS: "SCHEDULED",
  "1H": "LIVE",
  HT: "LIVE",
  "2H": "LIVE",
  FT: "FINISHED",
  PST: "POSTPONED",
  CANC: "CANCELLED",
};
 
export interface MappedFixture {
  externalId: number;
  leagueExternalId: number;
  leagueName: string;
  seasonYear: number;
  kickoff: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";
  homeTeamExternalId: number;
  homeTeamName: string;
  homeCrestUrl: string;
  awayTeamExternalId: number;
  awayTeamName: string;
  awayCrestUrl: string;
  homeScore: number | null;
  awayScore: number | null;
}
 
export function mapFixtures(raw: any): MappedFixture[] {
  return raw.response.map((item: any) => ({
    externalId: item.fixture.id,
    leagueExternalId: item.league.id,
    leagueName: item.league.name,
    seasonYear: item.league.season,
    kickoff: item.fixture.date,
    status: statusMap[item.fixture.status.short] ?? "SCHEDULED",
    homeTeamExternalId: item.teams.home.id,
    homeTeamName: item.teams.home.name,
    homeCrestUrl: item.teams.home.logo,
    awayTeamExternalId: item.teams.away.id,
    awayTeamName: item.teams.away.name,
    awayCrestUrl: item.teams.away.logo,
    homeScore: item.goals.home,
    awayScore: item.goals.away,
  }));
}