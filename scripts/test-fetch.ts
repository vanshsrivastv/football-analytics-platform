import "dotenv/config";
import { apiFootballGet } from "../src/server/external/api-football/client";

async function main() {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2026-07-21"
  const data = await apiFootballGet("fixtures", { date: today });
  console.log(JSON.stringify(data, null, 2));
}

main();