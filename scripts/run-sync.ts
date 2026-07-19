import "dotenv/config";
import { syncPremierLeagueStandings } from "../src/server/services/sync.service";

syncPremierLeagueStandings()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });