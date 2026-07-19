const API_FOOTBALL_HOST = "v3.football.api-sports.io";

export async function apiFootballGet(
  endpoint: string,
  params: Record<string, string>
) {
  const url = new URL(`https://${API_FOOTBALL_HOST}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": process.env.API_FOOTBALL_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football request failed: ${response.status}`);
  }

  return response.json();
}