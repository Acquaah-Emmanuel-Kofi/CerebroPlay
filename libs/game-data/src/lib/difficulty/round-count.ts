import { Difficulty } from '@cerebro-play/shared-models';

const ROUND_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 9,
  expert: 12,
};

export function difficultyToRoundCount(difficulty: Difficulty): number {
  return ROUND_COUNT_BY_DIFFICULTY[difficulty];
}
