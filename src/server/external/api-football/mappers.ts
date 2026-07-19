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