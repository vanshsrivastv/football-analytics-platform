import { Predictor, PredictionInput, PredictionResult } from "./predictor.interface";

const HOME_ADVANTAGE = 10;
const POINTS_WEIGHT = 0.6;
const H2H_WEIGHT = 3;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export class RuleBasedPredictor implements Predictor {
  predict(input: PredictionInput): PredictionResult {
    const reasoning: string[] = [];

    let pointsEdge = 0;
    if (input.homeTeamPoints !== null && input.awayTeamPoints !== null) {
      const pointsDiff = input.homeTeamPoints - input.awayTeamPoints;
      pointsEdge = clamp(pointsDiff * POINTS_WEIGHT, -25, 25);
      reasoning.push(
        `${input.homeTeamName} has ${input.homeTeamPoints} points vs ${input.awayTeamName}'s ${input.awayTeamPoints} this season.`
      );
    } else {
      reasoning.push("Current standings unavailable for this match — relying on home advantage only.");
    }

    const h2hDiff = input.headToHead.homeWins - input.headToHead.awayWins;
    const h2hEdge = clamp(h2hDiff * H2H_WEIGHT, -12, 12);
    if (input.headToHead.homeWins + input.headToHead.awayWins + input.headToHead.draws > 0) {
      reasoning.push(
        `Head-to-head: ${input.homeTeamName} ${input.headToHead.homeWins}W, ${input.headToHead.draws}D, ${input.headToHead.awayWins}L.`
      );
    }

    reasoning.push(`${input.homeTeamName} gets a home advantage boost.`);

    const edge = pointsEdge + HOME_ADVANTAGE + h2hEdge;

    const homeShare = clamp(50 + edge, 10, 90);
    const awayShare = 100 - homeShare;

    const draw = clamp(24 - Math.abs(edge) * 0.2, 12, 28);
    const remaining = 100 - draw;

    const homeWinProbability = Math.round((homeShare / 100) * remaining);
    const awayWinProbability = Math.round((awayShare / 100) * remaining);
    const drawProbability = 100 - homeWinProbability - awayWinProbability;

    return { homeWinProbability, drawProbability, awayWinProbability, reasoning };
  }
}