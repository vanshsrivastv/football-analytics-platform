import { RuleBasedPredictor } from "./rule-based.predictor";

export const activePredictor = new RuleBasedPredictor();
export type { PredictionInput, PredictionResult } from "./predictor.interface";