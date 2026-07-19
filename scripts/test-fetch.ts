import "dotenv/config";
import { apiFootballGet } from "../src/server/external/api-football/client";
import { mapStandings } from "../src/server/external/api-football/mappers";

async function main() {
  const raw = await apiFootballGet("standings", {
    league: "39",
    season: "2023",
  });
  const mapped = mapStandings(raw);
  console.log(mapped);
}

main();