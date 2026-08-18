import { Difficulty } from '@cerebro-play/shared-models';

const TIME_LIMIT_MS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3000,
  medium: 2200,
  hard: 1600,
  expert: 1100,
};

export function difficultyToTimeLimitMs(difficulty: Difficulty): number {
  return TIME_LIMIT_MS_BY_DIFFICULTY[difficulty];
}
