export type PredictionInput = {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamPoints: number | null;
  awayTeamPoints: number | null;
  headToHead: {
    homeWins: number;
    awayWins: number;
    draws: number;
  };
};

export type PredictionResult = {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  reasoning: string[];
};

export interface Predictor {
  predict(input: PredictionInput): PredictionResult;
}