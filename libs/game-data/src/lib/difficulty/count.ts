import { Difficulty } from '@cerebro-play/shared-models';

const COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
  expert: 6,
};

export function difficultyToCount(difficulty: Difficulty): number {
  return COUNT_BY_DIFFICULTY[difficulty];
}
