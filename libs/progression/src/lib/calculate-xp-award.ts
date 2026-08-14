import { GameResult } from '@cerebro-play/shared-models';

const SCORE_TO_XP_DIVISOR = 10;
const PERSONAL_BEST_BONUS_XP = 50;

export interface CalculateXpAwardInput {
  result: GameResult;
  isPersonalBest: boolean;
}

export function calculateXpAward({ result, isPersonalBest }: CalculateXpAwardInput): number {
  const baseXp = Math.round(result.score / SCORE_TO_XP_DIVISOR);
  return baseXp + (isPersonalBest ? PERSONAL_BEST_BONUS_XP : 0);
}
